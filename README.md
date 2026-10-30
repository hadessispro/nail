# nail

### Rose Nail Spa · POS (Point of Sale System)

Phần mềm quản lý tiệm Nail & Spa chuyên nghiệp, thiết kế tối ưu cho màn hình cảm ứng tại quầy (Touchscreen POS), hoạt động 100% Offline hoặc Deploy lên Vercel / Cloud.

---

## 🌟 Tính Năng Chính

1. **Bán Hàng & Thu Ngân (Checkout & POS)**
   - Lựa chọn danh mục và dịch vụ nhanh (Full set, Gel Manicure, Pedicure, Waxing, Nail Art, Kids, Add-on, Sản phẩm).
   - Phân chia thợ làm (Technician Assignment) & tính phần trăm hoa hồng (Commission).
   - Tùy chọn Tip (15%, 18%, 20%, 25% hoặc nhập số tiền tùy ý).
   - Thanh toán đa phương thức: Tiền mặt (Cash), Thẻ (Card), Chuyển khoản (Transfer). Tự động tính tiền thối.
   - Áp dụng Voucher giảm giá & Đổi điểm thưởng tích lũy (Loyalty Points).

2. **Sơ Đồ Mặt Bằng Tiệm (Floor Map)**
   - Trực quan hóa mặt bằng thực tế: 8 Bàn nail (Mani), 6 Ghế pedicure (Pedi), 3 Bàn hơ khô (Dry), 2 Phòng Wax, Quầy thu ngân, Khu chờ, Cửa ra vào.
   - Hiển thị trạng thái theo thời gian thực: Đang phục vụ, Cần dọn vệ sinh, Trống đón khách.
   - Xếp khách từ danh sách chờ vào vị trí ngay tức thì.

3. **Quản Lý Lịch Hẹn & Hàng Chờ (Appointments & Waitlist)**
   - Theo dõi lịch hẹn theo ngày, giờ, thợ yêu cầu.
   - Quản lý danh sách khách vãng lai chờ (Walk-in waitlist) kèm số người và thời gian chờ ước tính.

4. **Khách Hàng & Điểm Tích Lũy (CRM & Loyalty)**
   - Lưu trữ thông tin khách: Tên, SĐT, Email, Sinh nhật, Ghi chú sở thích/dị ứng, Thợ quen.
   - Tự động tích lũy điểm theo chi tiêu và lịch sử đổi thưởng.

5. **Lịch Sử Hóa Đơn & In Nhiệt (Invoices & Thermal Receipt)**
   - Xem lại tất cả hóa đơn đã lập theo ngày, thợ, phương thức thanh toán.
   - In hóa đơn nhiệt khổ 80mm, 58mm hoặc giấy A4 tiêu chuẩn.
   - Hỗ trợ lệnh mở két tiền (Cash drawer).

6. **Báo Cáo Doanh Thu & Thợ (Reports & Commission)**
   - Thống kê doanh thu theo ngày, tuần, tháng.
   - Bảng phân chia hoa hồng & tiền Tip chi tiết cho từng thợ.
   - Dịch vụ bán chạy nhất và biểu đồ giờ cao điểm.
   - *Được bảo vệ bằng mã PIN bảo mật.*

7. **Cài Đặt & Dữ Liệu (Settings & Backup)**
   - Mã PIN mặc định: `1234` (có thể đổi trong Cài đặt).
   - Chỉnh cỡ chữ / giao diện phóng to theo kích thước màn hình quầy thu ngân.
   - Xuất dữ liệu ra file JSON để sao lưu USB hàng ngày và Khôi phục khi cần.
   - Tự tạo sẵn bộ dữ liệu mẫu (Demo seed) mô phỏng 60 ngày hoạt động thực tế.

8. **Banner Quảng Cáo Header (Voucher, Sản Phẩm & Thêm Banner Từ Máy Local)**
   - Đính một thanh banner dài nổi bật trên toàn bộ các trang tại thanh Navigation Header.
   - Tự động xoay tua hiển thị các mã Voucher ưu đãi và Sản phẩm bán chạy của tiệm.
   - Hỗ trợ tải trực tiếp hình ảnh banner từ máy tính cá nhân (`+ Banner máy`), lưu trữ offline trên trình duyệt (`localStorage`), có giao diện quản lý xóa/thêm ảnh nhanh chóng.

---

## 🚀 Cách Chạy Phần Mềm

### Cách 1: Chạy trực tiếp (Không cần cài đặt, không cần internet)
- Bấm đúp chuột vào file **`MO-POS.bat`** hoặc mở trực tiếp file **`index.html`** bằng trình duyệt (Chrome, Edge, Cốc Cốc, Brave).

### Cách 2: Chạy qua Node.js Server
```bash
npm run serve
# Truy cập: http://localhost:3000
```

---

## ☁️ Hướng Dẫn Deploy Lên Vercel

### Cách 1: Deploy qua Vercel CLI (Nhanh nhất)
1. Mở PowerShell / Terminal tại thư mục này.
2. Đăng nhập tài khoản Vercel:
   ```bash
   vercel login
   ```
3. Chạy lệnh deploy:
   ```bash
   vercel --prod
   ```
4. Chọn các thiết lập mặc định (Enter) -> Vercel sẽ cấp ngay cho bạn tên miền trực tiếp dạng: `https://ten-du-an.vercel.app`.

### Cách 2: Deploy qua GitHub & Vercel Dashboard
1. Tạo một Repository mới trên GitHub (ví dụ: `nails-store-pos`).
2. Đẩy toàn bộ mã nguồn lên:
   ```bash
   git remote add origin https://github.com/<tai-khoan>/nails-store-pos.git
   git branch -M main
   git push -u origin main
   ```
3. Vào [vercel.com](https://vercel.com), bấm **Add New Project** -> Chọn GitHub repo vừa đẩy -> Bấm **Deploy**.
