const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const chromePath = 'C:\\Program Files\\Google\\Chrome\\Application\\chrome.exe';
const screenshotPath = path.join(process.cwd(), 'public', 'test_admin_login.png');

try {
  execSync(`"${chromePath}" --headless=new --disable-gpu --window-size=390,844 "--screenshot=${screenshotPath}" http://localhost:3000/admin/login`, { timeout: 20000 });
  if (fs.existsSync(screenshotPath)) {
    console.log('SUCCESS: Screenshot captured at', screenshotPath, 'Size:', fs.statSync(screenshotPath).size);
  } else {
    console.log('FAIL: Screenshot file not found');
  }
} catch (e) {
  console.error('Execution error:', e.message);
}
