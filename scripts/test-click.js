const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';

async function test() {
  const loginRes = await fetch('http://localhost:3000/api/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@eventify.com', password: 'admin123' })
  });
  const token = loginRes.headers.get('set-cookie').match(/eventify_session=([^;]+)/)[1];

  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9223',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(process.cwd(), '.next', 'chrome_temp_test')
  ]);
  await new Promise(r => setTimeout(r, 2000));

  let list = null;
  for (let i = 0; i < 10; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9223/json/list');
      list = await res.json();
      if (list && list.length > 0) break;
    } catch (e) {
      await new Promise(r => setTimeout(r, 500));
    }
  }
  if (!list || list.length === 0) throw new Error('Chrome failed to start');
  try {
    const ws = new WebSocket(list[0].webSocketDebuggerUrl);
    await new Promise(r => ws.onopen = r);

    let id = 1;
    function send(method, params = {}) {
      return new Promise((resolve, reject) => {
        const msgId = id++;
        const handler = (e) => {
          const res = JSON.parse(e.data);
          if (res.id === msgId) {
            ws.removeEventListener('message', handler);
            if (res.error) reject(new Error(JSON.stringify(res.error)));
            else resolve(res.result);
          }
        };
        ws.addEventListener('message', handler);
        ws.send(JSON.stringify({ id: msgId, method, params }));
      });
    }

    await send('Network.enable');
    await send('Network.setCookie', { name: 'eventify_session', value: token, url: 'http://localhost:3000/' });
    await send('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 2, mobile: true });
    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:3000/admin' });
    
    // Wait for the admin page to load and verify auth
    for (let i = 0; i < 20; i++) {
      await new Promise(r => setTimeout(r, 500));
      const pageState = await send('Runtime.evaluate', {
        expression: 'Boolean(document.querySelector("header h2"))',
        returnByValue: true
      });
      if (pageState.result?.value) {
        console.log('Page loaded successfully! Header found after ' + ((i + 1) * 500) + 'ms');
        break;
      }
    }

    // Inspect all buttons
    const buttonsInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          return Array.from(document.querySelectorAll('button')).map(b => ({
            classes: b.className,
            parent: b.parentElement ? b.parentElement.tagName : null,
            svg: b.querySelector('svg')?.getAttribute('class') || b.querySelector('svg')?.tagName
          }));
        })()
      `,
      returnByValue: true
    });
    console.log('Buttons on page:', buttonsInfo.result.value);

    // Click the actual hamburger button in header
    const clickRes = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const btn = document.querySelector('header button');
          if (btn) {
            btn.click();
            return { clicked: true, btnClass: btn.className };
          }
          return { clicked: false };
        })()
      `,
      returnByValue: true
    });
    console.log('Click result:', clickRes.result.value);

    await new Promise(r => setTimeout(r, 800));

    // Check aside state
    const asideInfo = await send('Runtime.evaluate', {
      expression: `
        (() => {
          const aside = document.querySelector('aside');
          const overlay = document.querySelector('.backdrop-blur-sm, .fixed.inset-0');
          return {
            classes: aside ? aside.className : null,
            transform: aside ? window.getComputedStyle(aside).transform : null,
            hasOverlay: !!overlay
          };
        })()
      `,
      returnByValue: true
    });
    console.log('Aside after clicking header hamburger:', asideInfo.result.value);

    // Save screenshot
    const shot = await send('Page.captureScreenshot', { format: 'png' });
    const outPath = path.join(process.cwd(), 'public', 'test_screenshots', 'actual_click_sidebar.png');
    fs.writeFileSync(outPath, Buffer.from(shot.data, 'base64'));
    console.log('Screenshot saved to:', outPath);

    ws.close();
  } finally {
    chrome.kill();
  }
}

test().catch(console.error);
