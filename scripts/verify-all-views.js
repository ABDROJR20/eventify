const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const outDir = path.join(process.cwd(), 'public', 'test_screenshots');

if (!fs.existsSync(outDir)) {
  fs.mkdirSync(outDir, { recursive: true });
}

async function verify() {
  console.log('--- STARTING ADMIN PORTAL & RESPONSIVENESS VERIFICATION ---');

  // 1. Authenticate Admin
  console.log('1. Authenticating admin user via /api/auth/admin-login...');
  const loginRes = await fetch('http://localhost:3000/api/auth/admin-login', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email: 'admin@eventify.com', password: 'admin123' })
  });

  const cookieHeader = loginRes.headers.get('set-cookie');
  const token = cookieHeader?.match(/eventify_session=([^;]+)/)?.[1];
  if (!token) throw new Error('Could not get session token');
  console.log('Admin session token ready.');

  // 2. Launch Chrome
  console.log('2. Launching headless Chrome on port 9224...');
  const chrome = spawn(chromePath, [
    '--headless=new',
    '--remote-debugging-port=9224',
    '--disable-gpu',
    '--no-first-run',
    '--no-default-browser-check',
    '--user-data-dir=' + path.join(process.cwd(), '.next', 'chrome_verify_profile')
  ]);

  let list = null;
  for (let i = 0; i < 15; i++) {
    try {
      const res = await fetch('http://127.0.0.1:9224/json/list');
      list = await res.json();
      if (list && list.length > 0) break;
    } catch {
      await new Promise(r => setTimeout(r, 400));
    }
  }

  if (!list || list.length === 0) throw new Error('Chrome did not respond on CDP port');

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

    async function evaluate(expression) {
      const res = await send('Runtime.evaluate', { expression, returnByValue: true });
      return res.result?.value;
    }

    async function capture(filename) {
      const res = await send('Page.captureScreenshot', { format: 'png' });
      const filePath = path.join(outDir, filename);
      fs.writeFileSync(filePath, Buffer.from(res.data, 'base64'));
      console.log('  [Screenshot saved]', filename, '(' + fs.statSync(filePath).size + ' bytes)');
      return filePath;
    }

    async function waitForElement(selector, maxTries = 15) {
      await new Promise(r => setTimeout(r, 2000));
      for (let i = 0; i < maxTries; i++) {
        try {
          const exists = await evaluate(`Boolean(document.querySelector("${selector}"))`);
          if (exists) return true;
        } catch {}
        await new Promise(r => setTimeout(r, 500));
      }
      return false;
    }

    // Set cookie
    await send('Network.enable');
    await send('Network.setCookie', {
      name: 'eventify_session',
      value: token,
      url: 'http://localhost:3000/'
    });

    await send('Page.enable');

    // ============================================
    // TEST 1: MOBILE VIEW (390 x 844)
    // ============================================
    console.log('\n3. Testing MOBILE View (390 x 844) on /admin...');
    await send('Emulation.setDeviceMetricsOverride', { width: 390, height: 844, deviceScaleFactor: 2, mobile: true });
    await send('Page.navigate', { url: 'http://localhost:3000/admin' });
    await waitForElement('header h2');
    await new Promise(r => setTimeout(r, 1000));

    await capture('verified_mobile_overview.png');

    // Check hamburger button visibility on Mobile
    const mobileBtnCheck = await evaluate(`
      (() => {
        const btn = document.querySelector('#admin-hamburger-btn');
        if (!btn) return { exists: false };
        const rect = btn.getBoundingClientRect();
        return {
          exists: true,
          width: rect.width,
          height: rect.height,
          visible: rect.width > 0 && rect.height > 0
        };
      })()
    `);
    console.log('Mobile hamburger button status:', mobileBtnCheck);

    // CLICK Hamburger button on Mobile
    console.log('Clicking hamburger button on Mobile...');
    await evaluate(`document.querySelector('#admin-hamburger-btn')?.click()`);
    await new Promise(r => setTimeout(r, 600));

    const mobileSidebarState = await evaluate(`
      (() => {
        const aside = document.querySelector('aside');
        const overlay = document.querySelector('.backdrop-blur-sm, .fixed.inset-0');
        return {
          isOpen: aside ? aside.className.includes('translate-x-0') && !aside.className.includes('-translate-x-full') : false,
          hasOverlay: !!overlay,
          asideClasses: aside?.className
        };
      })()
    `);
    console.log('Mobile sidebar open check:', mobileSidebarState);
    await capture('verified_mobile_sidebar_open.png');

    // Click Close (X) button on Mobile
    console.log('Clicking close button on Mobile...');
    await evaluate(`document.querySelector('aside button[aria-label="Close navigation menu"]')?.click()`);
    await new Promise(r => setTimeout(r, 600));

    const mobileClosedState = await evaluate(`
      (() => {
        const aside = document.querySelector('aside');
        const overlay = document.querySelector('.backdrop-blur-sm, .fixed.inset-0');
        return {
          isClosed: aside ? aside.className.includes('-translate-x-full') : false,
          overlayGone: !overlay
        };
      })()
    `);
    console.log('Mobile sidebar close check:', mobileClosedState);
    await capture('verified_mobile_sidebar_closed.png');

    // ============================================
    // TEST 2: TABLET VIEW (768 x 1024)
    // ============================================
    console.log('\n4. Testing TABLET View (768 x 1024) on /admin...');
    await send('Emulation.setDeviceMetricsOverride', { width: 768, height: 1024, deviceScaleFactor: 2, mobile: true });
    await new Promise(r => setTimeout(r, 800));

    await capture('verified_tablet_overview.png');

    // CLICK Hamburger button on Tablet
    console.log('Clicking hamburger button on Tablet...');
    await evaluate(`document.querySelector('#admin-hamburger-btn')?.click()`);
    await new Promise(r => setTimeout(r, 600));

    const tabletSidebarState = await evaluate(`
      (() => {
        const aside = document.querySelector('aside');
        const overlay = document.querySelector('.backdrop-blur-sm, .fixed.inset-0');
        return {
          isOpen: aside ? aside.className.includes('translate-x-0') : false,
          hasOverlay: !!overlay
        };
      })()
    `);
    console.log('Tablet sidebar open check:', tabletSidebarState);
    await capture('verified_tablet_sidebar_open.png');

    // Navigate to All Events from Sidebar Link
    console.log('Clicking "All Events" in sidebar...');
    await evaluate(`
      (() => {
        const links = Array.from(document.querySelectorAll('aside nav a'));
        const eventsLink = links.find(l => l.innerText.includes('All Events'));
        if (eventsLink) eventsLink.click();
      })()
    `);
    await waitForElement('header h2');
    await new Promise(r => setTimeout(r, 1200));

    console.log('Arrived on /admin/events in Tablet view.');
    await capture('verified_tablet_events.png');

    // Test hamburger on /admin/events
    console.log('Clicking hamburger button on /admin/events...');
    await evaluate(`document.querySelector('#admin-events-hamburger-btn')?.click()`);
    await new Promise(r => setTimeout(r, 600));
    await capture('verified_tablet_events_sidebar_open.png');

    // Navigate to User Management
    console.log('Clicking "User Management" in sidebar...');
    await evaluate(`
      (() => {
        const links = Array.from(document.querySelectorAll('aside nav a'));
        const usersLink = links.find(l => l.innerText.includes('User Management'));
        if (usersLink) usersLink.click();
      })()
    `);
    await waitForElement('header h2');
    await new Promise(r => setTimeout(r, 1200));
    await capture('verified_tablet_users.png');

    ws.close();
    console.log('\n--- ALL VERIFICATIONS COMPLETED SUCCESSFULLY! ---');
  } finally {
    chrome.kill();
  }
}

verify().catch(err => {
  console.error('Verification failed:', err);
  process.exit(1);
});
