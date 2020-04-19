# th16-news
th16-news - Báo điện tử

Danh sách sinh viên: 
- 1612793 - Lê Công Tuyền
- 1612771 - Tu Đình Tư
- 1612760 - Nguyễn Minh Trường

<details><summary><b>Frontend Phase</b></summary>
<p>

#### Các công việc đã hoàn thành:

- Giao diện các phân quyền 
- ứng dụng `bootstrap`, `jquery`

#### Các chức năng cần backend để hoạt động:

- Phân quyền người dùng
- Thay đổi ảnh đại diện
- Thay đổi thông tin người dùng
- Gia hạn premium
- ...

</p>
</details>

<details><summary><b>Backend Phase</b></summary>
<p>

#### Các công việc đã hoàn thành:

##### Phân hệ độc giả (guest)

- Trang chủ
- Hệ thống menu
- Xem danh sách bài viết
- Xem chi tiết bài viết
- Tìm kiếm bài viết: full-text search
- Đăng nhập: sử dụng signedCookie, mã hóa bcrypt
- Đăng kí

##### Phân hệ độc giả (subscriber)

- Có đầy đủ chức năng của phân hệ `guest`
- Cập nhật thông tin cá nhân
- Truy cập được các bài viết `premium` khi tài khoản còn hạn sử dụng

##### Phân hệ phóng viên (writer)

- Đăng bài viết
- Xem danh sách bài do mình viết
- Hiệu chỉnh bài viết ` bị từ chối`, `chưa được duyệt`

##### Phân hệ biên tập viên (editor)

- Xem danh sách bài `draft` do `writer` đăng vào chuyên mục mình quản lý
- Từ chối bài viết
- Xem bài & xác định thời điểm bài viết được xuất bản
- Xem danh sách bài viết do mình xử lý (duyệt, từ chối)

##### Phân hệ quản trị (admin)

- Dashboard (hiển thị các chức năng sử dụng)
- Quản lý chuyên mục
- Quản lý `tag`
- Quản lý bài viết
- Quản lý người dùng
- Gia hạn độc giả `subscriber`
- Phân công chuyên mục cho `editor`

##### Nâng cao

- Giao diện đẹp, responsive
- Upload lên host (heroku)
- Quên mật khẩu, có mail OTP

</p>
</details>

##### Note: This app using MVC Web App (Server-Render).
Cần sửa lại file .env với thông tin email, password để app có thể gửi mail OTP

- link github: https://github.com/ctuyen/th16-news
- link heroku: http://saladnews.herokuapp.com/
