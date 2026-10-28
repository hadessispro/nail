export interface ShopSettings {
  name: string;
  address: string;
  phone: string;
  website: string;
  tagline: string;
}

export interface BusinessHours {
  open: string;
  close: string;
}

export interface LoyaltyConfig {
  enabled: boolean;
  earnPerDollar: number;
  redeemPoints: number;
  redeemValue: number;
  minRedeem: number;
  maxPercent: number;
}

export interface ReceiptConfig {
  paper: '58' | '80' | 'a4';
  lang: 'vi' | 'en';
  showTech: boolean;
  showPoints: boolean;
  showBarcode: boolean;
  showPhone: boolean;
  thanks: string;
  footer: string;
}

export interface PrinterConfig {
  type: 'thermal' | 'normal';
  name: string;
  copies: number;
  autoPrint: boolean;
  openDrawer: boolean;
}

export interface AppSettings {
  shop: ShopSettings;
  hours: BusinessHours;
  taxRate: number;
  tipPresets: number[];
  loyalty: LoyaltyConfig;
  receipt: ReceiptConfig;
  printer: PrinterConfig;
  pin: string;
  uiScale: number;
}

export interface Technician {
  id: string;
  name: string;
  fullName: string;
  phone: string;
  color: string;
  commission: number; // percentage, e.g. 60
  active: boolean;
  onDuty: boolean;
}

export interface ServiceCategory {
  id: string;
  name: string;
  color: string;
}

export interface ServiceItem {
  id: string;
  categoryId: string;
  name: string;
  price: number;
  duration: number; // in minutes
  active: boolean;
}

export interface Customer {
  id: string;
  name: string;
  phone: string;
  email?: string;
  notes?: string;
  preferredTechId?: string;
  createdAt: string;
}

export interface Voucher {
  id: string;
  code: string;
  type: 'percent' | 'amount';
  value: number;
  expiresAt: string | null;
  maxUses: number | null;
  usedCount: number;
  minSpend: number;
  note: string;
}

export interface OrderLineItem {
  id: string;
  serviceId: string;
  name: string;
  price: number;
  qty: number;
  techId: string;
  techName?: string;
}

export interface Invoice {
  id: string;
  code: string;
  createdAt: string;
  customerId?: string;
  customerName?: string;
  lines: OrderLineItem[];
  subtotal: number;
  discount: number;
  voucherCode?: string;
  pointsUsed: number;
  pointsDiscount: number;
  tax: number;
  tip: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'transfer';
  cashGiven?: number;
  change?: number;
  techId?: string;
}

export interface Station {
  id: string;
  name: string;
  kind: 'mani' | 'pedi' | 'wax' | 'dry' | 'desk' | 'wait' | 'door';
  x: number;
  y: number;
  w: number;
  h: number;
  dirtySince?: string | null;
}

export interface FloorZone {
  id: string;
  name: string;
  kind: 'mani' | 'pedi' | 'wax' | 'dry' | 'desk' | 'wait' | 'door';
  x: number;
  y: number;
  w: number;
  h: number;
}

export interface Appointment {
  id: string;
  customerId?: string;
  customerName: string;
  customerPhone?: string;
  serviceIds: string[];
  techId?: string;
  stationId?: string;
  start: string;
  duration: number;
  status: 'pending' | 'arrived' | 'completed' | 'cancelled';
  note?: string;
  invoiceId?: string;
}

export interface WaitlistEntry {
  id: string;
  name: string;
  customerId?: string;
  serviceIds: string[];
  preferredTechId?: string;
  partySize: number;
  createdAt: string;
  note?: string;
}

export interface LoyaltyPointRecord {
  id: string;
  customerId: string;
  invoiceId?: string;
  points: number;
  reason: string;
  createdAt: string;
}
