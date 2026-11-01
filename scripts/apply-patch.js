const fs = require('fs');
const path = require('path');

const filePath = path.resolve(__dirname, '../index.html');
let content = fs.readFileSync(filePath, 'utf8');

const patches = [
  {
    name: 'Dict update: Lịch hẹn -> Appts',
    search: '"Lịch hẹn":"Appointments"',
    replace: '"Lịch hẹn":"Appts"'
  },
  {
    name: 'Dict update: Thợ -> Techs',
    search: '"Thợ":"Technicians"',
    replace: '"Thợ":"Techs"'
  },
  {
    name: 'Dict update: Mẫu HĐ -> Receipt',
    search: '"Mẫu HĐ":"Receipt Template"',
    replace: '"Mẫu HĐ":"Receipt"'
  },
  {
    name: 'Nav rail CSS',
    search: '</style>',
    replace: '.nav-rail-bar{width:96px!important}.nav-rail-btn{width:82px!important;min-height:50px!important;height:auto!important;padding:4px 2px!important;font-size:10.5px!important;line-height:1.15!important;text-align:center!important}.nav-rail-divider{width:82px!important}</style>'
  },
  {
    name: 'Iu button component styling',
    search: 'function Iu({to:e,label:t,icon:n,badge:r}){return(0,Y.jsxs)(Dn,{to:e,end:e===`/`,className:({isActive:e})=>K(`press relative flex h-[50px] w-[72px] flex-col items-center justify-center gap-0.5 rounded-2xl text-[11px] leading-none font-semibold`,e?`bg-brand text-white shadow-[0_8px_18px_-8px_rgb(180_43_87/0.9)]`:`text-white/65 hover:bg-rail-2 hover:text-white`),children:[(0,Y.jsx)(n,{className:`size-[22px]`,strokeWidth:2}),(0,Y.jsx)(`span`,{children:t}),!!r&&(0,Y.jsx)(`span`,{className:`absolute top-1 right-1.5 grid min-w-[18px] place-items-center rounded-full bg-amber px-1 py-[3px] text-[10px] leading-none font-bold text-white ring-2 ring-rail`,children:r})]})}function Lu(){let e=q(e=>e.tickets.length),t=q(e=>e.waitlist.length),n=q(e=>{let t=xl(new Date);return e.appointments.filter(e=>e.status===`pending`&&xl(e.start)===t).length}),r=J(e=>e.adminUnlocked),i=[{to:`/`,label:`Quầy`,icon:oa,badge:e},{to:`/floor`,label:`Sơ đồ`,icon:Qn,badge:t},{to:`/appointments`,label:`Lịch hẹn`,icon:br,badge:n},{to:`/customers`,label:`Khách`,icon:Ca},{to:`/history`,label:`Hóa đơn`,icon:Hi},{to:`/vouchers`,label:`Voucher`,icon:la},{to:`/loyalty`,label:`Tích điểm`,icon:oi}],a=[{to:`/reports`,label:`Báo cáo`,icon:wr},{to:`/services`,label:`Dịch vụ`,icon:ia},{to:`/technicians`,label:`Thợ`,icon:_a},{to:`/receipt`,label:`Mẫu HĐ`,icon:Ji},{to:`/settings`,label:`Cài đặt`,icon:Qi}];return(0,Y.jsxs)(`nav`,{className:`no-print flex w-[92px] shrink-0 flex-col items-center gap-1 overflow-y-auto bg-rail py-3 [scrollbar-width:none]`,"aria-label":`Điều hướng chính`,children:[(0,Y.jsx)(`div`,{className:`mb-2 grid size-11 place-items-center rounded-2xl bg-brand text-white`,children:(0,Y.jsx)(Qr,{className:`size-6 fill-white`,strokeWidth:1.8})}),i.map(e=>(0,Y.jsx)(Iu,{...e},e.to)),(0,Y.jsxs)(`div`,{className:`my-2 flex w-[72px] items-center gap-1.5 text-[10px] font-bold tracking-wider text-white/40 uppercase`,children:[(0,Y.jsx)(`span`,{className:`h-px flex-1 bg-white/15`}),r?(0,Y.jsx)(bi,{className:`size-3`}):(0,Y.jsx)(Si,{className:`size-3`}),(0,Y.jsx)(`span`,{className:`h-px flex-1 bg-white/15`})]}),a.map(e=>(0,Y.jsx)(Iu,{...e},e.to))]})}',
    replace: 'function Iu({to:e,label:t,icon:n,badge:r}){return(0,Y.jsxs)(Dn,{to:e,end:e===`/`,title:t,className:({isActive:e})=>K(`press nav-rail-btn relative flex min-h-[50px] w-[82px] flex-col items-center justify-center gap-0.5 rounded-2xl px-1 py-1 text-[10.5px] leading-tight font-semibold text-center`,e?`bg-brand text-white shadow-[0_8px_18px_-8px_rgb(180_43_87/0.9)]`:`text-white/65 hover:bg-rail-2 hover:text-white`),children:[(0,Y.jsx)(n,{className:`size-[20px] shrink-0`,strokeWidth:2}),(0,Y.jsx)(`span`,{className:`w-full truncate px-0.5`,children:t}),!!r&&(0,Y.jsx)(`span`,{className:`absolute top-0.5 right-1 grid min-w-[17px] place-items-center rounded-full bg-amber px-1 py-[2px] text-[10px] leading-none font-bold text-white ring-2 ring-rail`,children:r})]})}function Lu(){let e=q(e=>e.tickets.length),t=q(e=>e.waitlist.length),n=q(e=>{let t=xl(new Date);return e.appointments.filter(e=>e.status===`pending`&&xl(e.start)===t).length}),r=J(e=>e.adminUnlocked),i=[{to:`/`,label:`Quầy`,icon:oa,badge:e},{to:`/floor`,label:`Sơ đồ`,icon:Qn,badge:t},{to:`/appointments`,label:`Lịch hẹn`,icon:br,badge:n},{to:`/customers`,label:`Khách`,icon:Ca},{to:`/history`,label:`Hóa đơn`,icon:Hi},{to:`/vouchers`,label:`Voucher`,icon:la},{to:`/loyalty`,label:`Tích điểm`,icon:oi}],a=[{to:`/reports`,label:`Báo cáo`,icon:wr},{to:`/services`,label:`Dịch vụ`,icon:ia},{to:`/technicians`,label:`Thợ`,icon:_a},{to:`/receipt`,label:`Mẫu HĐ`,icon:Ji},{to:`/settings`,label:`Cài đặt`,icon:Qi}];return(0,Y.jsxs)(`nav`,{className:`no-print flex w-24 nav-rail-bar shrink-0 flex-col items-center gap-1 overflow-y-auto bg-rail py-3 [scrollbar-width:none]`,"aria-label":`Điều hướng chính`,children:[(0,Y.jsx)(`div`,{className:`mb-2 grid size-11 place-items-center rounded-2xl bg-brand text-white`,children:(0,Y.jsx)(Qr,{className:`size-6 fill-white`,strokeWidth:1.8})}),i.map(e=>(0,Y.jsx)(Iu,{...e},e.to)),(0,Y.jsxs)(`div`,{className:`my-2 flex w-[82px] nav-rail-divider items-center gap-1.5 text-[10px] font-bold tracking-wider text-white/40 uppercase`,children:[(0,Y.jsx)(`span`,{className:`h-px flex-1 bg-white/15`}),r?(0,Y.jsx)(bi,{className:`size-3`}):(0,Y.jsx)(Si,{className:`size-3`}),(0,Y.jsx)(`span`,{className:`h-px flex-1 bg-white/15`})]}),a.map(e=>(0,Y.jsx)(Iu,{...e},e.to))]})}'
  },
  {
    name: 'Remove PIN demo hint under keypad',
    search: '(0,Y.jsxs)(`p`,{className:`mt-5 text-[13px] text-ink-3`,children:[`Mã PIN demo: `,(0,Y.jsx)(`b`,{className:`text-ink-2`,children:`1234`}),` (đổi trong Cài đặt)`]})',
    replace: 'null'
  },
  {
    name: 'Store seedDate auto-reset removal',
    search: 'q.getState().seedDate!==Il()&&q.getState().resetDemo();',
    replace: '/* persistent pin and store across dates */'
  },
  {
    name: 'Default PIN load from localStorage in Ll',
    search: 'openDrawer:!0},pin:`1234`,uiScale:100})',
    replace: 'openDrawer:!0},pin:(typeof localStorage!==`undefined`&&localStorage.getItem(`rose_pos_custom_pin`))||`1234`,uiScale:100})'
  },
  {
    name: 'Save custom PIN to localStorage in Settings',
    search: 'onClick:()=>{n(e=>({...e,pin:s})),c(``),r(`Đã đổi mã PIN`)}',
    replace: 'onClick:()=>{try{localStorage.setItem(`rose_pos_custom_pin`,s)}catch(e){}n(e=>({...e,pin:s})),c(``),r(`Đã đổi mã PIN`)}'
  },
  {
    name: 'resetDemo preserves custom PIN',
    search: 'resetDemo:()=>e(()=>({...Gl()}))',
    replace: 'resetDemo:()=>e(()=>{let t=Gl(),p=typeof localStorage!==`undefined`&&localStorage.getItem(`rose_pos_custom_pin`);return p&&(t.settings.pin=p),t;})'
  },
  {
    name: 'tryUnlock supports custom PIN',
    search: 'tryUnlock:t=>{let n=t===q.getState().settings.pin;return n&&e({adminUnlocked:!0}),n}',
    replace: 'tryUnlock:t=>{let n=t===((typeof localStorage!==`undefined`&&localStorage.getItem(`rose_pos_custom_pin`))||q.getState().settings.pin||`1234`);return n&&e({adminUnlocked:!0}),n}'
  },
  {
    name: 'handlePinSubmit strictly checks custom PIN',
    search: "let pin = q.getState().settings.pin || '1234';\r\n    if (pinInput === pin || pinInput === '1234') {",
    replace: "let pin = (typeof localStorage !== 'undefined' && localStorage.getItem('rose_pos_custom_pin')) || q.getState().settings.pin || '1234';\r\n    if (pinInput === pin) {"
  },
  {
    name: 'handleExecuteCleanup strictly checks custom PIN',
    search: "let pin = q.getState().settings.pin || '1234';\r\n    if (cleanupPin !== pin && cleanupPin !== '1234') {",
    replace: "let pin = (typeof localStorage !== 'undefined' && localStorage.getItem('rose_pos_custom_pin')) || q.getState().settings.pin || '1234';\r\n    if (cleanupPin !== pin) {"
  },
  {
    name: 'Remove default 1234 error text in kiosk',
    search: "children: 'Mã PIN không đúng! (Mặc định: 1234)'",
    replace: "children: 'Mã PIN không đúng! Vui lòng thử lại.'"
  },
  {
    name: 'Remove default 1234 hint in settings cleanup',
    search: "(0, Y.jsx)('span', { className: 'text-amber-700 font-normal', children: 'Mặc định: 1234' })",
    replace: 'null'
  }
];

let allOk = true;
for (const p of patches) {
  if (content.includes(p.search)) {
    console.log('[OK] Found:', p.name);
  } else {
    console.error('[FAIL] NOT found:', p.name);
    allOk = false;
  }
}

if (!allOk) {
  console.error('Aborting: some patches were not matched.');
  process.exit(1);
}

for (const p of patches) {
  content = content.replace(p.search, () => p.replace);
}

fs.writeFileSync(filePath, content, 'utf8');
console.log('ALL PATCHES SUCCESSFULLY APPLIED TO index.html!');
