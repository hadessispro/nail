import { AppSettings, FloorZone, ServiceCategory, ServiceItem, Station, Technician, Voucher } from '../types';

export const THEME_COLORS = {
  rose: '#d9486f',
  coral: '#e8704f',
  gold: '#c99a2e',
  jade: '#2f9a78',
  teal: '#1f9aa3',
  sky: '#4a86c8',
  clay: '#9a6a4f',
  slate: '#6a7a8c',
};

export const DEFAULT_SETTINGS: AppSettings = {
  shop: {
    name: 'Rose Nail Spa',
    address: '123 Colonial Dr, Orlando, FL 32803',
    phone: '4075550123',
    website: 'rosenailspa.com',
    tagline: 'Nails · Waxing · Spa',
  },
  hours: {
    open: '09:00',
    close: '19:00',
  },
  taxRate: 0,
  tipPresets: [15, 18, 20, 25],
  loyalty: {
    enabled: true,
    earnPerDollar: 1,
    redeemPoints: 100,
    redeemValue: 5,
    minRedeem: 100,
    maxPercent: 50,
  },
  receipt: {
    paper: '80',
    lang: 'vi',
    showTech: true,
    showPoints: true,
    showBarcode: true,
    showPhone: true,
    thanks: 'Cảm ơn quý khách! / Thank you!',
    footer: 'Hẹn gặp lại · See you again',
  },
  printer: {
    type: 'thermal',
    name: 'EPSON TM-T20III',
    copies: 1,
    autoPrint: false,
    openDrawer: true,
  },
  pin: '1234',
  uiScale: 100,
};

export const DEFAULT_TECHNICIANS: Omit<Technician, 'id'>[] = [
  { name: 'Cindy', fullName: 'Nguyễn Cao Kỳ Duyên', phone: '4075550141', color: THEME_COLORS.rose, commission: 60, active: true, onDuty: true },
  { name: 'Pam', fullName: 'Pamela Tran', phone: '4075550142', color: THEME_COLORS.coral, commission: 60, active: true, onDuty: true },
  { name: 'Hồng Đào', fullName: 'Lê Hồng Đào', phone: '4075550143', color: THEME_COLORS.gold, commission: 65, active: true, onDuty: true },
  { name: 'Quang Minh', fullName: 'Trần Quang Minh', phone: '4075550144', color: THEME_COLORS.jade, commission: 60, active: true, onDuty: true },
  { name: 'Henry', fullName: 'Nguyễn Hưng', phone: '4075550145', color: THEME_COLORS.teal, commission: 55, active: true, onDuty: true },
  { name: 'Khánh Hà', fullName: 'Phạm Khánh Hà', phone: '4075550146', color: THEME_COLORS.sky, commission: 60, active: true, onDuty: true },
  { name: 'Jenny', fullName: 'Ý Lan', phone: '4075550147', color: THEME_COLORS.clay, commission: 60, active: true, onDuty: true },
  { name: 'Linda', fullName: 'Linda Võ', phone: '4075550148', color: THEME_COLORS.slate, commission: 60, active: true, onDuty: false },
];

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  { id: 'c-set', name: 'Bộ móng · Full set', color: THEME_COLORS.rose },
  { id: 'c-mani', name: 'Móng tay · Manicure', color: THEME_COLORS.coral },
  { id: 'c-pedi', name: 'Móng chân · Pedicure', color: THEME_COLORS.teal },
  { id: 'c-art', name: 'Thiết kế · Nail art', color: THEME_COLORS.gold },
  { id: 'c-wax', name: 'Waxing', color: THEME_COLORS.jade },
  { id: 'c-kids', name: 'Trẻ em · Kids', color: THEME_COLORS.sky },
  { id: 'c-add', name: 'Cộng thêm · Add-on', color: THEME_COLORS.clay },
  { id: 'c-prod', name: 'Sản phẩm', color: THEME_COLORS.slate },
];

export const RAW_SERVICES: [string, string, number, number][] = [
  ['c-set', 'Full Set Acrylic', 40, 60],
  ['c-set', 'Full Set Crystal', 35, 60],
  ['c-set', 'Full Set Solar P&W', 55, 75],
  ['c-set', 'Full Set Silk Fiber', 45, 60],
  ['c-set', 'Full Set Gel-X', 60, 75],
  ['c-set', 'Fill-in Acrylic', 30, 45],
  ['c-set', 'Fill-in Solar P&W', 45, 60],
  ['c-set', 'Fill-in Gel-X', 45, 60],
  ['c-set', 'Volume Touch Up', 20, 30],
  ['c-mani', 'Regular Manicure', 18, 30],
  ['c-mani', 'Gel Manicure', 32, 45],
  ['c-mani', 'French Manicure', 25, 40],
  ['c-mani', 'Dip Powder', 42, 60],
  ['c-mani', 'Deluxe Manicure', 35, 50],
  ['c-mani', 'Polish Change (Hand)', 12, 20],
  ['c-pedi', 'Regular Pedicure', 28, 40],
  ['c-pedi', 'Deluxe Pedicure', 38, 55],
  ['c-pedi', 'Spa Pedicure', 48, 65],
  ['c-pedi', 'Gel Pedicure', 45, 60],
  ['c-pedi', 'French Pedicure', 35, 50],
  ['c-pedi', 'Polish Change (Toes)', 14, 20],
  ['c-pedi', 'Mani & Pedi Combo', 55, 85],
  ['c-art', 'Design (per nail)', 5, 10],
  ['c-art', 'French Tip', 8, 15],
  ['c-art', 'Chrome / Mirror', 12, 15],
  ['c-art', 'Ombré', 15, 20],
  ['c-art', 'Cat Eye', 15, 20],
  ['c-art', 'Gems / Charms', 5, 10],
  ['c-wax', 'Eyebrow Wax', 12, 15],
  ['c-wax', 'Lip Wax', 8, 10],
  ['c-wax', 'Chin Wax', 8, 10],
  ['c-wax', 'Eyebrow + Lip', 18, 20],
  ['c-wax', 'Full Face Wax', 45, 40],
  ['c-wax', 'Underarm Wax', 20, 15],
  ['c-wax', 'Half Leg Wax', 35, 30],
  ['c-kids', 'Kids Manicure', 15, 25],
  ['c-kids', 'Kids Pedicure', 22, 30],
  ['c-kids', 'Kids Mani & Pedi', 35, 50],
  ['c-kids', 'Kids Polish Change', 8, 15],
  ['c-add', 'Remove Old Set', 10, 15],
  ['c-add', 'Paraffin Treatment', 10, 15],
  ['c-add', 'Hot Stone Massage', 15, 15],
  ['c-add', 'Callus Treatment', 8, 10],
  ['c-add', 'Extra Massage (5 min)', 5, 5],
  ['c-prod', 'Cuticle Oil', 8, 0],
  ['c-prod', 'Hand Cream', 12, 0],
  ['c-prod', 'Gift Card $50', 50, 0],
  ['c-prod', 'Nail Care Kit', 25, 0],
];

export const STATION_DIMENSIONS = {
  mani: { w: 3.8, h: 3.7 },
  pedi: { w: 4.9, h: 3.3 },
  wax: { w: 4.9, h: 3 },
  dry: { w: 2.3, h: 2.2 },
};

export function getFloorZonesAndStations(): { zones: FloorZone[]; stations: Station[] } {
  const zones: FloorZone[] = [
    { id: 'z-mani', name: 'Khu làm móng tay', kind: 'mani', x: 0.4, y: 0.4, w: 17.6, h: 10 },
    { id: 'z-pedi', name: 'Khu pedicure', kind: 'pedi', x: 18.6, y: 0.4, w: 11, h: 12.6 },
    { id: 'z-dry', name: 'Khu hơ khô', kind: 'dry', x: 0.4, y: 11, w: 8.6, h: 3.8 },
    { id: 'z-desk', name: 'Quầy thu ngân', kind: 'desk', x: 9.6, y: 11, w: 8.4, h: 3.8 },
    { id: 'z-wait', name: 'Khu chờ', kind: 'wait', x: 0.4, y: 15.4, w: 11.6, h: 3.2 },
    { id: 'z-door', name: 'Cửa ra vào', kind: 'door', x: 12.6, y: 17.5, w: 5.4, h: 1.1 },
    { id: 'z-wax', name: 'Phòng wax', kind: 'wax', x: 18.6, y: 13.6, w: 11, h: 5 },
  ];

  const stations: Station[] = [];
  const add = (id: string, name: string, kind: 'mani' | 'pedi' | 'wax' | 'dry', x: number, y: number) => {
    stations.push({ id, name, kind, x, y, ...STATION_DIMENSIONS[kind] });
  };

  [1.2, 5.4, 9.6, 13.8].forEach((x, i) => add(`st-m${i + 1}`, `Bàn ${i + 1}`, 'mani', x, 1.8));
  [1.2, 5.4, 9.6, 13.8].forEach((x, i) => add(`st-m${i + 5}`, `Bàn ${i + 5}`, 'mani', x, 6.2));
  [1.8, 5.5, 9.2].forEach((y, i) => {
    add(`st-p${i * 2 + 1}`, `Ghế ${i * 2 + 1}`, 'pedi', 19.4, y);
    add(`st-p${i * 2 + 2}`, `Ghế ${i * 2 + 2}`, 'pedi', 24.6, y);
  });
  [1.2, 3.9, 6.6].forEach((x, i) => add(`st-d${i + 1}`, `Hơ ${i + 1}`, 'dry', x, 12.3));
  [19.4, 24.6].forEach((x, i) => add(`st-w${i + 1}`, `Phòng ${i + 1}`, 'wax', x, 15));

  return { zones, stations };
}
