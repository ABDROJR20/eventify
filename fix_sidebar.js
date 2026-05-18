const fs = require('fs');
const path = require('path');

const dir = path.join(process.cwd(), 'src/app/dashboard');
const files = [
  'page.js',
  'analytics/page.js',
  'events/page.js',
  'attendees/page.js',
  'registrations/page.js',
  'settings/page.js'
];

files.forEach(f => {
  const p = path.join(dir, f);
  if (!fs.existsSync(p)) return;
  let code = fs.readFileSync(p, 'utf8');
  
  // 1. Center Eventify text
  code = code.replace(/<Link href="\/"( className="w-full")?>\s*<h1 className="text-brand-blue text-2xl font-black mb-10 cursor-pointer italic( text-center)?">Eventify<\/h1>\s*<\/Link>/g, '<Link href="/" className="w-full">\n          <h1 className="text-brand-blue text-2xl font-black mb-10 cursor-pointer italic text-center">Eventify</h1>\n        </Link>');

  // 2. Add responsive menu icons if missing
  if (!code.includes('Menu } from "lucide-react"')) {
    code = code.replace(/} from "lucide-react"/, ', X, Menu } from "lucide-react"');
  }

  // 3. Add useState and "use client" if missing
  if (!code.includes('"use client"')) {
    code = '"use client";\n\n' + code;
  }
  if (!code.includes('import { useState }')) {
    code = code.replace(/"use client";\n\n/, '"use client";\n\nimport { useState } from "react";\n');
  }

  // 4. Add state for sidebar
  if (!code.includes('isSidebarOpen')) {
    code = code.replace(/(export default function \w+\(\) \{\n)/, '$1  const [isSidebarOpen, setIsSidebarOpen] = useState(false);\n');
  }

  // 5. Update Sidebar layout to be responsive
  if (!code.includes('fixed inset-0 bg-slate-900/50')) {
    code = code.replace(
      /\{\/\* Sidebar \*\/\}\s*<aside className="w-64 bg-white border-r border-slate-200 flex flex-col p-6 h-screen fixed top-0 left-0 z-20">/,
      `{/* Sidebar Overlay for Mobile */}
      {isSidebarOpen && (
        <div 
          className="fixed inset-0 bg-slate-900/50 z-20 lg:hidden backdrop-blur-sm"
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside className={\`w-64 bg-white border-r border-slate-200 flex flex-col p-6 h-screen fixed top-0 left-0 z-30 transition-transform duration-300 ease-in-out \${isSidebarOpen ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}\`}>`
    );
  }

  // 6. Update the header in the Sidebar to include the close (X) button
  if (!code.includes('<X size={24} />')) {
    code = code.replace(
      /<Link href="\/" className="w-full">\s*<h1 className="text-brand-blue text-2xl font-black mb-10 cursor-pointer italic text-center">Eventify<\/h1>\s*<\/Link>/,
      `<div className="flex justify-between items-center mb-10">\n          <Link href="/" className="w-full">\n            <h1 className="text-brand-blue text-2xl font-black cursor-pointer italic text-center">Eventify</h1>\n          </Link>\n          <button className="lg:hidden text-slate-500 hover:bg-slate-100 p-1 rounded-lg shrink-0" onClick={() => setIsSidebarOpen(false)}>\n            <X size={24} />\n          </button>\n        </div>`
    );
  }

  // 7. Make NavItem accept onClick
  code = code.replace(
    /function NavItem\(\{ icon, label, active = false, href = "#"(, onClick)? \}\) \{/,
    'function NavItem({ icon, label, active = false, href = "#", onClick }) {'
  );
  code = code.replace(
    /<Link href=\{href\} className="block"( onClick=\{onClick\})?>/,
    '<Link href={href} className="block" onClick={onClick}>'
  );

  // 8. Pass onClick to NavItems
  code = code.replace(
    /<NavItem icon=\{([^}]+)\} label="([^"]+)" (active )?href="([^"]+)"( onClick=\{[^\}]+\})? \/>/g,
    '<NavItem icon={$1} label="$2" $3href="$4" onClick={() => setIsSidebarOpen(false)} />'
  );

  // 9. Update Main Content wrappers and add hamburger icon to header
  if (!code.includes('lg:p-10 lg:ml-64 w-full')) {
    code = code.replace(
      /<div className="flex-1 p-10 ml-64">\s*<header className="([^"]+)">/,
      (match, classNames) => {
        return `<div className="flex-1 p-6 lg:p-10 lg:ml-64 w-full overflow-hidden">\n        <header className="${classNames} relative">\n          <button \n            className="lg:hidden p-2 bg-white border border-slate-200 rounded-xl text-slate-600 hover:bg-slate-50 shrink-0 mb-4"\n            onClick={() => setIsSidebarOpen(true)}\n          >\n            <Menu size={24} />\n          </button>`;
      }
    );
  }

  fs.writeFileSync(p, code);
});

console.log("Files updated successfully.");
