# 🌟 NEXUS FRAGRANCE - Luxury E-Commerce & CMS System

**NEXUS FRAGRANCE** là một hệ thống Website Thương mại điện tử chuyên cung cấp các dòng nước hoa cao cấp, được tích hợp kèm Hệ quản trị nội dung (CMS) mạnh mẽ dành cho quản trị viên. Dự án được xây dựng với kiến trúc **Frontend (React)** và **Backend (ASP.NET Core MVC & Web API)** tách biệt nhưng tích hợp hoàn hảo.

---

## 🚀 Các Công Nghệ Sử Dụng (Tech Stack)

### 1. Backend (ASP.NET Core 6/7)
- **Framework:** ASP.NET Core MVC (dành cho Admin Dashboard) & ASP.NET Core Web API (cung cấp dữ liệu cho React).
- **Database:** SQL Server tích hợp **Entity Framework Core** (Code-First).
- **Authentication:** Cookie Authentication cho Admin & API Authentication cho Frontend.
- **Documentation:** Swagger UI (tích hợp đầy đủ `ProducesResponseType` và Schemas).
- **Tính năng nổi bật:** MemoryCache (cho OTP Quên mật khẩu), CORS Policy (cho phép React gọi API).

### 2. Frontend (React 18)
- **Framework:** React.js (tạo bằng Create React App).
- **Routing:** React Router DOM v6.
- **Styling:** CSS3 thuần với phong cách thiết kế **Luxury/Minimalism** (Glassmorphism, Gradient tinh tế, Animation mượt mà).
- **Tính năng nổi bật:** Context API (Quản lý Giỏ hàng toàn cục), Axios (gọi API).

---

## 💎 Các Chức Năng Cốt Lõi Đã Triển Khai (Key Features)

### 🌐 Dành Cho Khách Hàng (Frontend - React)
1. **Giao diện Luxury:** Giao diện được thiết kế theo tông màu Đen - Vàng Champagne (Black & Gold), mang lại cảm giác sang trọng chuẩn các hãng nước hoa Niche (Le Labo, Tom Ford).
2. **Xác thực người dùng:**
   - Đăng nhập / Đăng ký tài khoản.
   - Quên mật khẩu & Đặt lại mật khẩu bằng hệ thống mã **OTP (One-Time Password)**.
3. **Khám phá sản phẩm:**
   - Danh sách sản phẩm với lưới grid mượt mà.
   - Tìm kiếm từ khóa, Lọc theo Danh mục.
   - **Lọc theo khoảng giá (Min Price - Max Price)** trực tiếp qua API.
   - Sắp xếp theo: Mới nhất, Cũ nhất, Giá tăng dần, Giá giảm dần.
4. **Giỏ hàng & Thanh toán (Checkout Flow):**
   - Thêm, bớt, xóa sản phẩm khỏi giỏ hàng (lưu trữ đồng bộ).
   - Form thanh toán chuyên nghiệp, ghi nhận thông tin giao hàng độc lập.
   - Màn hình Đặt hàng thành công (`Order Success`) cung cấp Mã đơn hàng tracking.

### 🛡️ Dành Cho Quản Trị Viên (Backend - Admin MVC)
1. **SaaS Dashboard Hiện Đại:**
   - Giao diện Admin lột xác hoàn toàn với phong cách **Glassmorphism**, sử dụng các Mini-stat cards (thống kê nhanh), bảng dữ liệu chuẩn SaaS.
2. **Quản lý Đơn hàng (Order Management) CHUYÊN SÂU:**
   - Xem danh sách đơn hàng với trạng thái trực quan (Chờ duyệt, Đang giao, Hoàn thành).
   - Xem **Chi tiết đơn hàng** với giao diện Hóa đơn chuyên nghiệp.
   - **Sửa thông tin giao hàng:** Quản trị viên có thể cập nhật Địa chỉ/SĐT giao hàng *của riêng đơn hàng đó* mà không làm ảnh hưởng đến dữ liệu gốc của khách hàng.
   - **Xóa Chi tiết đơn hàng:** Xóa từng sản phẩm bị hủy trong đơn, hệ thống tự động **hoàn trả số lượng (Auto Restock)** về kho `StockQuantity`.
3. **Quản lý Khách hàng & Sản phẩm:**
   - Quản lý kho, danh mục, upload hình ảnh sản phẩm.
   - Sửa/Xóa tài khoản khách hàng.
4. **Quản lý Bài viết (Blog/Post):**
   - Viết bài với Rich Text Editor.
   - Tự động cạo sạch thẻ HTML (HTML Stripping regex) ở trang danh sách để chống vỡ giao diện thẻ preview bài viết.
5. **API Documentation:**
   - Hệ thống Swagger được gắn `[Tags]` phân nhóm gọn gàng.
   - Cung cấp Schema rõ ràng cho Frontend Developer tích hợp.

---

## ⚙️ Hướng Dẫn Cài Đặt & Chạy Dự Án (How to Run)

Để hệ thống hoạt động đầy đủ, bạn cần chạy song song cả 2 Project: Backend và Frontend.

### Phần 1: Khởi động Backend (ASP.NET Core)
1. Mở Solution `NhanCMS_Solution.sln` bằng **Visual Studio**.
2. Thiết lập chuỗi kết nối Database (Connection String) trong file `appsettings.json` (nếu cần thiết).
3. Mở **Package Manager Console** (Tools > NuGet Package Manager > Package Manager Console) và chạy lệnh:
   ```powershell
   Update-Database
   ```
   *(Để khởi tạo các bảng và dữ liệu mẫu vào SQL Server).*
4. Nhấn **Ctrl + F5** (Run without Debugging) để chạy Backend.
   - Mặc định Backend sẽ chạy ở: `http://localhost:7226`
   - **Trang Admin:** `http://localhost:7226/`
   - **Tài liệu API (Swagger):** `http://localhost:7226/swagger/index.html`

### Phần 2: Khởi động Frontend (React.js)
1. Mở Terminal (Command Prompt hoặc VS Code Terminal) và trỏ vào thư mục `cms.frontend`:
   ```bash
   cd cms.frontend
   ```
2. Cài đặt các gói thư viện phụ thuộc (chỉ làm ở lần đầu tiên):
   ```bash
   npm install
   ```
3. Khởi động server React:
   ```bash
   npm start
   ```
4. Trình duyệt sẽ tự động mở trang web mua sắm ở địa chỉ: `http://localhost:3000`

---

## 🧩 Cấu Trúc Thư Mục (Folder Structure)

```text
📦 asp-net-main
 ┣ 📂 CMS.Data         # Chứa Entity Models (Product, Order, Customer...) và ApplicationDbContext (EF Core)
 ┣ 📂 CMS.Backend      # Server ASP.NET Core (Admin MVC Controllers + Web API Controllers)
 ┃ ┣ 📂 Controllers    # Các Controller của Admin Panel (Trả về View Razor)
 ┃ ┣ 📂 Controllers/Api# Các API Controller (Cung cấp JSON cho React)
 ┃ ┗ 📂 Views          # Các file giao diện Razor (.cshtml) phong cách SaaS
 ┗ 📂 cms.frontend     # Source code Frontend (React 18)
   ┣ 📂 src/components # Layouts (Header, Footer), UI Elements
   ┣ 📂 src/context    # CartContext (Quản lý giỏ hàng)
   ┣ 📂 src/pages      # Các màn hình (Home, Products, Checkout, Auth...)
   ┗ 📜 index.css      # File CSS gốc cấu hình Design System (Luxury UI)
```

## 🎯 Kết luận
NEXUS FRAGRANCE là một minh chứng cho khả năng kết hợp giữa sức mạnh lưu trữ, xử lý dữ liệu phức tạp của ASP.NET Core và tính linh hoạt, tương tác mượt mà của React. Hệ thống đã đáp ứng đầy đủ tiêu chuẩn của một đồ án môn học nâng cao cũng như thực tế ứng dụng thương mại điện tử chuyên nghiệp.

> **Tác giả / Nhóm phát triển:** [Nghĩa Nhân]
> **Năm thực hiện:** 2026
