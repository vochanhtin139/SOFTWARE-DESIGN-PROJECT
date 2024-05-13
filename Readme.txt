# Hướng dẫn cách build sourcecode cũng như cấu hình
## Yêu cầu Hệ Thống
- **Node.js**: Phiên bản mới nhất (tải về từ nodejs.org)
- **NPM**: Phiên bản mới nhất (đã được cài đặt với Node.js)
- **Database**: MongoDB
## Cài đặt và Cấu hình
### Cài đặt Ban Đầu
1. **Clone dự án**:
   ```
   git clone [URL của Repository]
   cd [Tên Thư Mục]
   ```
2. **Cài đặt các package**:
   ```
   npm install
   ```
### Cấu hình
Thông tin về việc cấu hình các biến môi trường và các tài nguyên bên ngoài:
- **Biến môi trường**:
  - `PORT`: Cổng mà server sẽ chạy (mặc định: 3000)
  - `DB_URL`: URL kết nối cơ sở dữ liệu
  - `SECRET_KEY`: Khóa bí mật cho mã hóa
  Đặt các biến này trong một tệp `.env` trong thư mục gốc của dự án.
### Cấu trúc Thư Mục
Giải thích cấu trúc thư mục của dự án:
```
/proj_root
    /node_modules
    /src
        /controllers
        /config
        /models
	/repositories
        /routes
    /public
    /views
    .env
    server.js
```
## Chạy Dự Án
- **Mở terminal trong folder src và nhập command sau**:
  ```
  npm start
  ```
- **Truy cập**:
  - Mở trình duyệt và truy cập `http://localhost:3000`
## Kiểm Thử
Hướng dẫn chi tiết về cách thực hiện kiểm thử tự động:
```
npm test
```
## Đóng góp
Hướng dẫn về cách mọi người có thể đóng góp vào dự án của nhóm em:
1. Fork và clone dự án.
2. Tạo một nhánh mới (`git checkout -b feature-branch`)
3. Commit sự thay đổi (`git commit -am 'Add some feature'`)
4. Push lên nhánh (`git push origin feature-branch`)
5. Tạo một Pull Request.