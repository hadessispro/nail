const fs = require('fs');
const path = require('path');

const indexPath = path.resolve(__dirname, '../index.html');
let content = fs.readFileSync(indexPath, 'utf8');

// 1. Load full_map.json
const fullMap = JSON.parse(fs.readFileSync(path.resolve(__dirname, 'full_map.json'), 'utf8'));

// 2. Extract current window.__POS_DICT from index.html
const startMarker = 'window.__POS_DICT = ';
const startIdx = content.indexOf(startMarker);
const endIdx = content.indexOf(';\n\nwindow.__t =', startIdx);

if (startIdx === -1 || endIdx === -1) {
  console.error('Failed to locate window.__POS_DICT in index.html');
  process.exit(1);
}

const currentDictStr = content.slice(startIdx + startMarker.length, endIdx);
const dict = JSON.parse(currentDictStr);

// Merge fullMap into dict
for (const [k, v] of Object.entries(fullMap)) {
  dict[k] = v;
}

// Extra high-value UI phrases
dict["SẢN PHẨM"] = "FEATURED PRODUCTS";
dict["Sản phẩm chăm sóc móng chính hãng tại tiệm"] = "Authentic salon nail care products";
dict["Products chăm sóc móng chính hãng tại tiệm"] = "Authentic salon nail care products";
dict["✓ Hàng chờ trống"] = "✓ Waitlist is empty";
dict["Khách tự check-in trên iPad sẽ tự động hiện tại đây để điều phối mở hóa đơn."] = "Clients checking in on iPad will appear here to assign & open tickets.";
dict["— Khách tự check-in trên iPad sẽ tự động hiện tại đây để điều phối mở hóa đơn."] = "— Clients checking in on iPad will appear here to assign & open tickets.";
dict["· Khách tự check-in trên iPad sẽ tự động hiện tại đây để điều phối mở hóa đơn."] = "· Clients checking in on iPad will appear here to assign & open tickets.";
dict["Clients tự check-in trên iPad sẽ tự động hiện tại đây để điều phối mở invoices."] = "Clients checking in on iPad will appear here to assign & open tickets.";
dict["— Clients tự check-in trên iPad sẽ tự động hiện tại đây để điều phối mở invoices."] = "— Clients checking in on iPad will appear here to assign & open tickets.";
dict["Mở màn hình khách iPad"] = "Open iPad Kiosk";
dict["Mở màn hình clients iPad"] = "Open iPad Kiosk";
dict["Hóa đơn đang mở"] = "Open Tickets";
dict["hóa đơn đang mở"] = "open tickets";
dict["Invoices đang mở"] = "Open Tickets";
dict["Bàn"] = "Table";
dict["Ghế"] = "Chair";
dict["Phòng"] = "Room";
dict["Hơ"] = "Dryer";
dict["Bàn nail"] = "Nail Table";
dict["Ghế pedicure"] = "Pedi Chair";
dict["Phòng wax"] = "Wax Room";
dict["Bàn hơ khô"] = "Drying Station";
dict["Thợ"] = "Techs";
dict["Lịch hẹn"] = "Appts";
dict["Mẫu HĐ"] = "Receipt";
dict["Mẫu hóa đơn"] = "Receipt Template";
dict["Doanh thu theo ngày"] = "Revenue by Day";
dict["Áp dụng cho đơn từ $"] = "Applies to orders from $";
dict["Áp dụng cho đơn từ $30"] = "Applies to orders from $30";
dict["Áp dụng cho đơn từ $50"] = "Applies to orders from $50";
dict["Hóa đơn:"] = "Ticket #:";
dict["Ngày:"] = "Date:";
dict["Giờ:"] = "Time:";
dict["Khách:"] = "Client:";
dict["Thợ:"] = "Tech:";
dict["Chưa nhập SĐT"] = "No phone entered";
dict["Hóa đơn gồm: tên tiệm · số HĐ · ngày giờ · khách · thợ · dịch vụ · giảm giá (voucher, điểm) · tip · tổng tiền · điểm cộng/còn lại · hình thức thanh toán · lời cảm ơn."] = "Receipt includes: salon name · ticket # · date & time · client · technician · services · discounts (voucher, points) · tip · total · points earned/balance · payment method · thank you message.";
dict["Đổi điểm (100 points)"] = "Redeem points (100 pts)";
dict["Đổi điểm (100 điểm)"] = "Redeem points (100 pts)";
dict["Đổi điểm"] = "Redeem points";
dict["Chờ"] = "Wait";
dict["Chờ "] = "Wait ";

console.log('Total dict keys after merge:', Object.keys(dict).length);

// 3. New enhanced window.__t function
const newTFunction = `window.__t = function(text) {
  if (typeof text !== 'string') return text;
  if (window.__pos_lang === 'vi') return text;
  var trimmed = text.trim();
  if (!trimmed) return text;
  
  if (window.__POS_DICT[trimmed]) {
    return text.replace(trimmed, window.__POS_DICT[trimmed]);
  }
  if (window.__POS_DICT[trimmed.toLowerCase()]) {
    return text.replace(trimmed, window.__POS_DICT[trimmed.toLowerCase()]);
  }
  
  // Patterns for dynamic composite strings (stations, queues, units, statuses)
  var res = text
    .replace(/\\bBàn\\s*(\\d+)/gi, 'Table $1')
    .replace(/\\bGhế\\s*(\\d+)/gi, 'Chair $1')
    .replace(/\\bPhòng\\s*(\\d+)/gi, 'Room $1')
    .replace(/\\bHơ\\s*(\\d+)/gi, 'Dryer $1')
    .replace(/\\bBàn\\s*Nail\\b/gi, 'Nail Table')
    .replace(/\\bGhế\\s*Pedicure\\b/gi, 'Pedi Chair')
    .replace(/\\bGhế\\s*Spa\\b/gi, 'Spa Chair')
    .replace(/\\bBàn\\s*hơ\\s*khô\\b/gi, 'Drying Station')
    .replace(/\\bPhòng\\s*wax\\b/gi, 'Wax Room')
    .replace(/✓\\s*Hàng chờ trống/gi, '✓ Waitlist is empty')
    .replace(/Khách tự check-in trên iPad sẽ tự động hiện tại đây để điều phối mở hóa đơn\\./gi, 'Clients self check-in on iPad will appear here to assign & open tickets.')
    .replace(/Clients tự check-in trên iPad sẽ tự động hiện tại đây để điều phối mở invoices\\./gi, 'Clients self check-in on iPad will appear here to assign & open tickets.')
    .replace(/Mở màn hình khách iPad/gi, 'Open iPad Kiosk')
    .replace(/Mở màn hình clients iPad/gi, 'Open iPad Kiosk')
    .replace(/Sản phẩm chăm sóc móng chính hãng tại tiệm/gi, 'Authentic salon nail care products')
    .replace(/Products chăm sóc móng chính hãng tại tiệm/gi, 'Authentic salon nail care products')
    .replace(/Hóa đơn đang mở/gi, 'Open Tickets')
    .replace(/Invoices đang mở/gi, 'Open Tickets')
    .replace(/hóa đơn đang mở/gi, 'open tickets')
    .replace(/\\bSẢN PHẨM\\b/g, 'FEATURED PRODUCTS')
    .replace(/\\bDoanh thu theo ngày\\b/gi, 'Revenue by Day')
    .replace(/\\bÁp dụng cho đơn từ\\s*\\$(\\d+)/gi, function(_, m) { return 'Applies to orders from $' + m; })
    .replace(/^Hóa đơn:\\s*$/gi, 'Ticket #:')
    .replace(/^Ngày:\\s*$/gi, 'Date:')
    .replace(/^Giờ:\\s*$/gi, 'Time:')
    .replace(/^Khách:\\s*$/gi, 'Client:')
    .replace(/^Thợ:\\s*$/gi, 'Tech:')
    .replace(/\\bChưa nhập SĐT\\b/gi, 'No phone entered')
    .replace(/(\\d+)\\s*(lịch|cuộc hẹn)/gi, '$1 appts')
    .replace(/(\\d+)\\s*(clients|khách)\\s*đang\\s*chờ/gi, '$1 clients waiting')
    .replace(/(\\d+)\\s*(tickets|hóa đơn)\\s*dùng\\s*voucher/gi, '$1 voucher redemptions')
    .replace(/\\bTất cả\\s*\\((\\d+)\\)/gi, 'All ($1)')
    .replace(/nếu đổi hết/gi, 'if fully redeemed')
    .replace(/đã giảm/gi, 'discounted')
    .replace(/\\bChờ\\s*(\\d+)/gi, 'Wait $1')
    .replace(/\\bVào làm\\s*·/gi, 'Start ·')
    .replace(/^Vào làm\\b/gi, 'Start Service')
    .replace(/\\bĐổi điểm\\s*\\((\\d+)\\s*(points|điểm)\\)/gi, function(_, m) { return 'Redeem points (' + m + ' pts)'; })
    .replace(/\\bĐổi điểm\\b/gi, 'Redeem points')
    .replace(/(\\d+)\\s*ngày/gi, '$1 days')
    .replace(/(\\d+)\\s*phút/gi, '$1 mins')
    .replace(/(\\d+)\\s*giờ/gi, '$1 hrs')
    .replace(/(\\d+)\\s*lượt\\s*làm/gi, '$1 services')
    .replace(/(\\d+)\\s*lượt/gi, '$1 turns')
    .replace(/(\\d+)\\s*lần/gi, '$1 times')
    .replace(/(\\d+)\\s*khách/gi, '$1 clients')
    .replace(/(\\d+)\\s*hóa\\s*đơn/gi, '$1 tickets')
    .replace(/(\\d+)\\s*HĐ/gi, '$1 tickets')
    .replace(/(\\d+)\\s*dịch\\s*vụ/gi, '$1 services')
    .replace(/(\\d+)\\s*món/gi, '$1 items')
    .replace(/(\\d+)\\s*điểm/gi, '$1 points')
    .replace(/(\\d+)\\s*người/gi, '$1 people')
    .replace(/\\bĐang làm\\b/gi, 'Busy')
    .replace(/\\bRảnh\\b/gi, 'Available')
    .replace(/\\bNghỉ\\b/gi, 'Off Duty')
    .replace(/\\bĐang phục vụ\\b/gi, 'Serving')
    .replace(/\\bĐang chờ\\b/gi, 'Waiting')
    .replace(/\\bĐã thanh toán\\b/gi, 'Paid')
    .replace(/\\bChưa thanh toán\\b/gi, 'Unpaid')
    .replace(/\\bĐã hủy\\b/gi, 'Voided')
    .replace(/\\bVào làm ngay\\b/gi, 'Start Service')
    .replace(/\\bGán thợ & Vào làm\\b/gi, 'Assign Tech & Start')
    .replace(/\\bXem Sơ đồ ghế\\b/gi, 'View Floor Plan')
    .replace(/\\bXem Sơ đồ ghế \\/ bàn\\b/gi, 'View Floor Plan & Stations')
    .replace(/\\bKhông có SĐT\\b/gi, 'No Phone')
    .replace(/\\bKhách vãng lai\\b/gi, 'Walk-in Client')
    .replace(/\\bKết ca\\b/gi, 'End Shift')
    .replace(/\\bCho thợ nghỉ\\b/gi, 'Clock Out Tech')
    .replace(/\\bNghỉ · chạm để vào ca\\b/gi, 'Off · tap to clock in')
    .replace(/\\bHôm nay\\b/gi, 'Today')
    .replace(/\\bHôm qua\\b/gi, 'Yesterday')
    .replace(/Thứ Hai/gi, 'Monday')
    .replace(/Thứ Ba/gi, 'Tuesday')
    .replace(/Thứ Tư/gi, 'Wednesday')
    .replace(/Thứ Năm/gi, 'Thursday')
    .replace(/Thứ Sáu/gi, 'Friday')
    .replace(/Thứ Bảy/gi, 'Saturday')
    .replace(/Chủ Nhật/gi, 'Sunday');

  return res;
};`;

// 4. New enhanced window.__translateProps function
const newTranslateProps = `window.__translateProps = function(p) {
  if (!p || window.__pos_lang === 'vi') return;
  try {
    if (typeof p.children === 'string') {
      p.children = window.__t(p.children);
    } else if (Array.isArray(p.children)) {
      var arr = [];
      for (var j = 0; j < p.children.length; j++) {
        var item = p.children[j];
        if (typeof item === 'string') {
          arr.push(window.__t(item));
        } else {
          arr.push(item);
        }
      }
      p.children = arr;
    }
    if (typeof p.label === 'string') p.label = window.__t(p.label);
    if (typeof p.placeholder === 'string') p.placeholder = window.__t(p.placeholder);
    if (typeof p.title === 'string') p.title = window.__t(p.title);
    if (typeof p.subtitle === 'string') p.subtitle = window.__t(p.subtitle);
    if (typeof p.hint === 'string') p.hint = window.__t(p.hint);
    if (typeof p.sub === 'string') p.sub = window.__t(p.sub);
    if (typeof p.text === 'string') p.text = window.__t(p.text);
    if (typeof p.confirmLabel === 'string') p.confirmLabel = window.__t(p.confirmLabel);
    if (typeof p.cancelLabel === 'string') p.cancelLabel = window.__t(p.cancelLabel);
    if (typeof p.message === 'string') p.message = window.__t(p.message);
    if (typeof p['aria-label'] === 'string') p['aria-label'] = window.__t(p['aria-label']);
    
    if (Array.isArray(p.head)) {
      p.head = p.head.map(function(h) { return typeof h === 'string' ? window.__t(h) : h; });
    }
    if (Array.isArray(p.foot)) {
      p.foot = p.foot.map(function(f) { return typeof f === 'string' ? window.__t(f) : f; });
    }
    if (Array.isArray(p.options)) {
      p.options = p.options.map(function(o) {
        if (o && typeof o.label === 'string') return Object.assign({}, o, { label: window.__t(o.label) });
        return o;
      });
    }
    if (Array.isArray(p.tabs)) {
      p.tabs = p.tabs.map(function(t) {
        if (t && typeof t.label === 'string') return Object.assign({}, t, { label: window.__t(t.label) });
        return t;
      });
    }
  } catch(e) {}
};`;

// Replace window.__POS_DICT
content = content.slice(0, startIdx + startMarker.length) + JSON.stringify(dict) + content.slice(endIdx);

// Replace window.__t
const tStartPos = content.indexOf('window.__t = function');
const tEndPos = content.indexOf('window.setPosLanguage =', tStartPos);
if (tStartPos !== -1 && tEndPos !== -1) {
  content = content.slice(0, tStartPos) + newTFunction + '\n\n' + content.slice(tEndPos);
}

// Replace window.__translateProps
const pStartPos = content.indexOf('window.__translateProps = function');
const pEndPos = content.indexOf('window.__interceptReactJSX = function', pStartPos);
if (pStartPos !== -1 && pEndPos !== -1) {
  content = content.slice(0, pStartPos) + newTranslateProps + '\n\n' + content.slice(pEndPos);
}

fs.writeFileSync(indexPath, content, 'utf8');
console.log('Successfully updated index.html with complete clean English translations!');
