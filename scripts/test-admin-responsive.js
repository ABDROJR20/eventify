const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const artifactsDir = path.join(process.cwd(), 'public', 'test_screenshots');

if (!fs.existsSync(artifactsDir)) {
  fs.mkdirSync(artifactsDir, { recursive: true });
}

async function run() {
  console.log('1. Logging in to get admin session cookie...');
  const loginRes = await fetch('http://localhost:3000/api/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@eventify.com', password: 'admin123' })
  });

  const cookieHeader = loginRes.headers.get('set-cookie');
  const tokenMatch = cookieHeader?.match(/eventify_session=([^;]+)/);
  if (!tokenMatch) {
    throw new Error('Failed to extract eventify_session cookie');
  }
  const token = tokenMatch[1];
  console.log('Admin session token obtained.');

  console.log('2. Starting Chrome with remote debugging on port 9222...');
  const chromeProcess = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9222',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(process.cwd(), '.next', 'chrome_temp_profile')
  ]);

  // Give Chrome 2 seconds to launch
  await new Promise(r => setTimeout(r, 2000));

  try {
    // Create a new page target or find existing
    let listRes = await fetch('http://127.0.0.1:9222/json/list');
    let pages = await listRes.json();
    let page = pages.find(p => p.type === 'page');
    if (!page) {
      const newPageRes = await fetch('http://127.0.0.1:9222/json/new?about:blank', { method: 'PUT' });
      page = await newPageRes.json();
    }
    const wsUrl = page.webSocketDebuggerUrl;
    console.log('3. Connecting to Page CDP WebSocket at', wsUrl);

    const ws = new WebSocket(wsUrl);
    await new Promise(resolve => ws.onopen = resolve);

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

    // Set cookie
    await send('Network.enable');
    await send('Network.setCookie', {
      name: 'eventify_session',
      value: token,
      domain: 'localhost',
      path: '/'
    });

    async function capture(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const filePath = path.join(artifactsDir, filename);
      fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
      console.log('Saved screenshot:', filename, fs.statSync(filePath).size, 'bytes');
      return filePath;
    }

    async function evaluate(expression) {
      return await send('Runtime.evaluate', { expression, returnByValue: true });
    }

    console.log('4. Testing Mobile View (390 x 844)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 390,
      height: 844,
      deviceScaleFactor: 2,
      mobile: true
    });

    await send('Page.enable');
    await send('Page.navigate', { url: 'http://localhost:3000/admin' });
    await new Promise(r => setTimeout(r, 3000));

    await capture('admin_mobile_overview.png');

    // Check if hamburger button is in DOM and clickable
    const btnCheck = await evaluate(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const menuBtn = btns.find(b => b.className.includes('lg:hidden') || b.querySelector('svg'));
        return {
          found: !!menuBtn,
          classes: menuBtn ? menuBtn.className : '',
          visible: menuBtn ? (menuBtn.offsetWidth > 0 && menuBtn.offsetHeight > 0) : false
        };
      })()
    `);
    console.log('Mobile hamburger button check:', btnCheck.result.value);

    // Click hamburger button to open sidebar
    await evaluate(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const menuBtn = btns.find(b => b.className.includes('lg:hidden'));
        if (menuBtn) menuBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    await capture('admin_mobile_sidebar_open.png');

    // Check sidebar visibility
    const sidebarCheck = await evaluate(`
      (() => {
        const aside = document.querySelector('aside');
        const overlay = document.querySelector('.backdrop-blur-sm, .fixed.inset-0');
        return {
          asideFound: !!aside,
          asideClasses: aside ? aside.className : '',
          asideTransform: aside ? window.getComputedStyle(aside).transform : '',
          overlayFound: !!overlay
        };
      })()
    `);
    console.log('Mobile sidebar state after click:', sidebarCheck.result.value);

    // Click Close (X) button
    await evaluate(`
      (() => {
        const closeBtn = document.querySelector('aside button');
        if (closeBtn) closeBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    await capture('admin_mobile_sidebar_closed.png');

    console.log('5. Testing Tablet View (768 x 1024)...');
    await send('Emulation.setDeviceMetricsOverride', {
      width: 768,
      height: 1024,
      deviceScaleFactor: 2,
      mobile: true
    });
    await new Promise(r => setTimeout(r, 1000));
    await capture('admin_tablet_overview.png');

    // Click hamburger in tablet view
    await evaluate(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const menuBtn = btns.find(b => b.className.includes('lg:hidden'));
        if (menuBtn) menuBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    await capture('admin_tablet_sidebar_open.png');

    // Navigate to All Events
    console.log('6. Testing Tablet Events Page (/admin/events)...');
    await send('Page.navigate', { url: 'http://localhost:3000/admin/events' });
    await new Promise(r => setTimeout(r, 3000));
    await capture('admin_tablet_events.png');

    // Click hamburger on Events page in tablet view
    await evaluate(`
      (() => {
        const btns = Array.from(document.querySelectorAll('button'));
        const menuBtn = btns.find(b => b.className.includes('lg:hidden'));
        if (menuBtn) menuBtn.click();
      })()
    `);
    await new Promise(r => setTimeout(r, 600));
    await capture('admin_tablet_events_sidebar_open.png');

    ws.close();
    console.log('All tests completed successfully!');
  } finally {
    chromeProcess.kill();
  }
}

run().catch(err => {
  console.error('Test run failed:', err);
  process.exit(1);
});
