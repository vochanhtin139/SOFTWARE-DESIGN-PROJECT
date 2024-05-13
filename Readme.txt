# Hướng dẫn cách build sourcecode cũng như cấu hình
## Yêu cầu hệ thống
- **Node.js**: Phiên bản mới nhất (tải về từ nodejs.org)
- **NPM**: Phiên bản mới nhất (đã được cài đặt với Node.js)
- **Database**: MongoDB
## Cài đặt và cấu hình
### Cài đặt ban đầu
1. **Clone dự án**:
   ```
   git clone [URL của Repository]
   cd [Tên thư mục]
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
### Cấu trúc thư mục
Cấu trúc thư mục chính của dự án:
```
    /src
        /config
	/controllers
	/helpers
	/middleware
        /models
	/node_modules
	/repositories
        /routes
    	/source
		/public
			/css
			/img
			/js
    		/resources
			/scss
			/views
		app.js
		server.js
	/utils
    	config.env
```
## Chạy dự án
- **Mở terminal trong folder src và nhập command sau**:
  ```
  npm start
  ```
- **Truy cập**:
  - Mở trình duyệt và truy cập `http://localhost:3000`
## Kiểm thử
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