# ONLINE BOOKSTORE – CỬA HÀNG SÁCH TRỰC TUYẾN

## 1. Giới thiệu dự án

### 1.1. Tổng quan

Online Bookstore là dự án xây dựng website bán sách trực tuyến, giúp khách hàng có thể tìm kiếm, tham khảo thông tin sách, lựa chọn sản phẩm, thêm vào giỏ hàng và thực hiện đặt hàng thông qua website.

Bên cạnh các chức năng dành cho khách hàng, hệ thống còn cung cấp trang quản trị dành cho quản trị viên (Admin), hỗ trợ quản lý sách, danh mục sách, đơn hàng và tài khoản người dùng.

Dự án được xây dựng theo mô hình Frontend – Backend, trong đó giao diện người dùng được phát triển bằng React và TypeScript, Backend sử dụng Node.js và Express.js, dữ liệu được lưu trữ trong MongoDB thông qua Mongoose.

### 1.2. Mục tiêu

- Xây dựng một website bán sách trực tuyến có giao diện thân thiện, dễ sử dụng.
- Cung cấp các chức năng cơ bản của một hệ thống thương mại điện tử.
- Hỗ trợ khách hàng tìm kiếm, lựa chọn và đặt mua sách.
- Hỗ trợ quản trị viên quản lý sản phẩm và đơn hàng.
- Áp dụng kiến thức về React, TypeScript, Node.js, Express và MongoDB vào một dự án thực tế.
- Rèn luyện kỹ năng làm việc nhóm, quản lý mã nguồn và triển khai ứng dụng.

### 1.3. Phạm vi dự án

Dự án tập trung xây dựng hai khu vực chính:

**Khu vực khách hàng:**
- Truy cập và xem danh sách sách.
- Tìm kiếm sách theo tên hoặc từ khóa.
- Lọc sách theo danh mục.
- Xem thông tin chi tiết của từng cuốn sách.
- Đăng ký, đăng nhập và đăng xuất.
- Thêm, xóa và cập nhật số lượng sách trong giỏ hàng.
- Đặt hàng khi đã đăng nhập.
- Theo dõi lịch sử và trạng thái đơn hàng.

**Khu vực quản trị viên:**
- Đăng nhập vào trang quản trị.
- Quản lý thông tin sách.
- Quản lý danh mục sách.
- Quản lý đơn hàng.
- Quản lý tài khoản người dùng.
- Cập nhật trạng thái xử lý đơn hàng.

---

## 2. Công nghệ sử dụng

Dự án sử dụng các công nghệ sau:

### 2.1. Frontend

| Công nghệ | Vai trò |
|---|---|
| React | Xây dựng giao diện người dùng theo dạng component. |
| TypeScript | Bổ sung kiểu dữ liệu cho JavaScript, giúp hạn chế lỗi trong quá trình phát triển. |
| Vite | Công cụ khởi tạo và chạy dự án React, hỗ trợ phát triển nhanh. |
| React Router | Quản lý điều hướng giữa các trang trong website. |

Frontend chịu trách nhiệm hiển thị giao diện, tiếp nhận thao tác của người dùng và gửi yêu cầu đến Backend để lấy hoặc cập nhật dữ liệu.

### 2.2. Backend

| Công nghệ | Vai trò |
|---|---|
| Node.js | Môi trường chạy JavaScript phía máy chủ. |
| Express.js | Xây dựng máy chủ và các API xử lý yêu cầu từ Frontend. |
| CORS | Hỗ trợ cho phép Frontend giao tiếp với Backend theo cấu hình được thiết lập. |
| dotenv | Đọc các biến môi trường từ file `.env`. |

Backend chịu trách nhiệm xử lý nghiệp vụ, kiểm tra dữ liệu, xác thực người dùng, phân quyền và giao tiếp với cơ sở dữ liệu.

### 2.3. Database

| Công nghệ | Vai trò |
|---|---|
| MongoDB | Hệ quản trị cơ sở dữ liệu NoSQL, lưu trữ dữ liệu dưới dạng document. |
| Mongoose | Thư viện hỗ trợ Node.js làm việc với MongoDB thông qua Schema và Model. |

Dự kiến hệ thống sử dụng các nhóm dữ liệu chính:

- Users: Lưu thông tin tài khoản người dùng.
- Books: Lưu thông tin sách.
- Categories: Lưu danh mục sách.
- Orders: Lưu thông tin đơn hàng.

### 2.4. Công cụ hỗ trợ phát triển

- Visual Studio Code: Viết và chỉnh sửa mã nguồn.
- Git: Quản lý phiên bản mã nguồn.
- GitHub: Lưu trữ mã nguồn và hỗ trợ làm việc nhóm.
- Postman: Kiểm tra các API của Backend.
- MongoDB Compass: Quan sát và quản lý dữ liệu MongoDB bằng giao diện trực quan.

---

## 3. Chức năng chính của hệ thống

Hệ thống có hai nhóm người dùng chính: Khách hàng (User) và Quản trị viên (Admin).

### 3.1. Chức năng dành cho khách hàng

**a. Đăng ký tài khoản**

- Người dùng nhập các thông tin cần thiết để tạo tài khoản.
- Hệ thống kiểm tra tính hợp lệ của thông tin đăng ký.
- Mật khẩu được mã hóa trước khi lưu vào cơ sở dữ liệu.
- Tài khoản đăng ký mới mặc định có quyền khách hàng (User).

**b. Đăng nhập và đăng xuất**

- Người dùng nhập email và mật khẩu.
- Backend kiểm tra thông tin tài khoản.
- Nếu hợp lệ, hệ thống cấp thông tin xác thực để người dùng truy cập các chức năng cần đăng nhập.
- Người dùng có thể đăng xuất khi không còn nhu cầu sử dụng.

**c. Xem danh sách sách**

- Hiển thị danh sách các sách hiện có.
- Mỗi sản phẩm hiển thị những thông tin cơ bản như tên sách, ảnh bìa, giá bán và danh mục.
- Người dùng có thể lựa chọn một cuốn sách để xem chi tiết.

**d. Tìm kiếm sách**

- Cho phép tìm kiếm sách theo tên hoặc từ khóa.
- Hiển thị kết quả phù hợp với nội dung tìm kiếm.
- Thông báo khi không tìm thấy sản phẩm phù hợp.

**e. Xem sách theo danh mục**

- Hiển thị danh sách danh mục sách.
- Cho phép người dùng lựa chọn một danh mục.
- Hệ thống hiển thị các sách thuộc danh mục tương ứng.

**f. Xem chi tiết sách**

Hiển thị thông tin chi tiết của sản phẩm, bao gồm:
- Tên sách.
- Hình ảnh.
- Tác giả.
- Giá bán.
- Mô tả.
- Danh mục.
- Số lượng tồn kho (nếu có).

**g. Quản lý giỏ hàng**

- Thêm sách vào giỏ hàng.
- Xóa sách khỏi giỏ hàng.
- Thay đổi số lượng sách.
- Tính tổng tiền các sản phẩm trong giỏ.
- Kiểm tra số lượng sản phẩm phù hợp với tồn kho.

**h. Đặt hàng**

- Khách hàng phải đăng nhập trước khi đặt hàng.
- Kiểm tra thông tin nhận hàng.
- Kiểm tra sản phẩm và số lượng đặt mua.
- Tính tổng tiền đơn hàng.
- Tạo đơn hàng và lưu vào cơ sở dữ liệu.
- Thông báo kết quả đặt hàng.

**i. Xem lịch sử đơn hàng**

- Hiển thị danh sách đơn hàng của khách hàng.
- Xem chi tiết từng đơn hàng.
- Theo dõi trạng thái đơn hàng.

### 3.2. Chức năng dành cho quản trị viên

**a. Quản lý sách**

- Thêm sách mới.
- Xem danh sách sách.
- Chỉnh sửa thông tin sách.
- Xóa sách.
- Cập nhật giá bán và số lượng tồn kho.

**b. Quản lý danh mục**

- Thêm danh mục mới.
- Chỉnh sửa tên và thông tin danh mục.
- Xóa danh mục khi đáp ứng điều kiện phù hợp.
- Xem danh sách các danh mục hiện có.

**c. Quản lý đơn hàng**

- Xem danh sách đơn hàng của hệ thống.
- Xem thông tin chi tiết đơn hàng.
- Cập nhật trạng thái đơn hàng.
- Theo dõi tình trạng xử lý đơn hàng.

**d. Quản lý người dùng**

- Xem danh sách tài khoản.
- Xem thông tin người dùng.
- Quản lý trạng thái tài khoản.
- Phân biệt tài khoản khách hàng và quản trị viên.

### 3.3. Phân quyền người dùng

Hệ thống phân chia quyền truy cập thành hai vai trò:

| Vai trò | Quyền hạn |
|---|---|
| User | Xem sách, tìm kiếm, quản lý giỏ hàng, đặt hàng và xem đơn hàng của bản thân. |
| Admin | Quản lý sách, danh mục, đơn hàng và người dùng. |

Lưu ý: Người dùng đăng ký tài khoản thông thường không được tự lựa chọn quyền Admin. Quyền quản trị viên được thiết lập riêng và được kiểm tra ở phía Backend.

---

## 4. Cấu trúc thư mục dự án

Dự án được chia thành ba khu vực chính: `client`, `server` và `docs`.

```text
FULLSTACK-PROJECT/
│
├── client/                  # Frontend - Giao diện
│   ├── public/
│   ├── src/
│   │   ├── assets/          # Hình ảnh, tài nguyên
│   │   ├── components/      # Các thành phần giao diện dùng chung
│   │   ├── pages/           # Các trang của website
│   │   ├── layouts/         # Bố cục giao diện
│   │   ├── context/         # Quản lý Context
│   │   ├── store/           # Quản lý trạng thái ứng dụng
│   │   ├── services/        # Gọi API đến Backend
│   │   ├── hooks/           # Custom Hooks
│   │   ├── routes/          # Cấu hình điều hướng
│   │   ├── utils/           # Hàm tiện ích
│   │   ├── App.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
├── server/                  # Backend - Xử lý dữ liệu
│   ├── config/              # Cấu hình kết nối
│   ├── controllers/         # Xử lý yêu cầu API
│   ├── models/              # Mô hình dữ liệu MongoDB
│   ├── routes/              # Khai báo API
│   ├── middleware/          # Middleware
│   ├── services/            # Xử lý nghiệp vụ
│   ├── utils/               # Hàm hỗ trợ
│   ├── app.js
│   ├── server.js
│   └── package.json
│
├── docs/                    # Tài liệu dự án
│   ├── images/
│   ├── database/
│   └── screenshots/
│
├── .gitignore
├── README.md
└── .env.example
```

### 4.1. Giải thích các thư mục Frontend

- `assets`: Chứa hình ảnh, biểu tượng và các tài nguyên giao diện.
- `components`: Chứa những thành phần có thể tái sử dụng như Header, Footer, BookCard.
- `pages`: Chứa các trang chính như Trang chủ, Đăng nhập, Đăng ký, Giỏ hàng.
- `layouts`: Chứa bố cục chung cho khu vực khách hàng và quản trị viên.
- `context`: Quản lý dữ liệu dùng chung thông qua React Context.
- `store`: Quản lý trạng thái ứng dụng tập trung.
- `services`: Chứa các hàm giao tiếp với API Backend.
- `hooks`: Chứa các Custom Hooks để tái sử dụng logic React.
- `routes`: Quản lý đường dẫn và bảo vệ các trang cần đăng nhập.
- `utils`: Chứa các hàm tiện ích như định dạng tiền tệ và kiểm tra dữ liệu.

### 4.2. Giải thích các thư mục Backend

- `config`: Chứa cấu hình kết nối MongoDB và các thiết lập hệ thống.
- `controllers`: Tiếp nhận yêu cầu và trả về kết quả cho người dùng.
- `models`: Định nghĩa cấu trúc dữ liệu thông qua Mongoose.
- `routes`: Khai báo các đường dẫn API.
- `middleware`: Kiểm tra xác thực, phân quyền và xử lý lỗi.
- `services`: Chứa các xử lý nghiệp vụ của hệ thống.
- `utils`: Chứa các hàm hỗ trợ dùng chung.
- `app.js`: Khởi tạo Express và đăng ký middleware, routes.
- `server.js`: Khởi động máy chủ và kết nối cơ sở dữ liệu.

### 4.3. Thư mục Docs

- `images`: Lưu hình ảnh minh họa và sơ đồ thiết kế.
- `database`: Lưu tài liệu thiết kế cơ sở dữ liệu.
- `screenshots`: Lưu ảnh chụp giao diện và kết quả kiểm thử.

---

## 5. Hướng dẫn cài đặt và chạy dự án

### 5.1. Yêu cầu trước khi cài đặt

Trước khi chạy dự án, cần chuẩn bị:

**Bước 1: Cài đặt Node.js**

- Truy cập: https://nodejs.org/
- Tải phiên bản LTS phù hợp với hệ điều hành.
- Tiến hành cài đặt theo hướng dẫn.
- Mở Terminal hoặc CMD và kiểm tra:

```bash
node -v
npm -v
```

Nếu cả hai lệnh hiển thị phiên bản thì Node.js và npm đã được cài đặt thành công.

**Bước 2: Cài đặt Visual Studio Code**

- Truy cập: https://code.visualstudio.com/
- Tải và cài đặt VS Code.
- Mở thư mục `FULLSTACK-PROJECT` bằng VS Code.

**Bước 3: Chuẩn bị MongoDB**

Có thể lựa chọn một trong hai cách:

- MongoDB Community Server: Cài đặt MongoDB trực tiếp trên máy tính.
- MongoDB Atlas: Sử dụng cơ sở dữ liệu MongoDB trên nền tảng đám mây.

Nếu sử dụng MongoDB local, cần bảo đảm dịch vụ MongoDB đang hoạt động trước khi khởi động Backend.

Nếu sử dụng MongoDB Atlas, cần tạo database, cấu hình quyền truy cập và lấy Connection String.

**Bước 4: Cài đặt Git (nếu làm việc nhóm)**

Truy cập: https://git-scm.com/

Sau khi cài đặt, kiểm tra:

```bash
git --version
```

Git giúp quản lý lịch sử thay đổi mã nguồn và hỗ trợ các thành viên làm việc chung trên GitHub.

### 5.2. Tải mã nguồn dự án

Nếu đã có mã nguồn trên máy tính, mở trực tiếp thư mục `FULLSTACK-PROJECT`.

Nếu lấy mã nguồn từ GitHub:

```bash
git clone <LINK_REPOSITORY>
```

Sau đó di chuyển vào thư mục dự án:

```bash
cd FULLSTACK-PROJECT
```

Lưu ý: Thay `<LINK_REPOSITORY>` bằng đường dẫn GitHub thực tế của nhóm.

### 5.3. Cài đặt và chạy Backend

**Bước 1: Mở Terminal tại thư mục gốc dự án.**

Di chuyển vào thư mục Backend:

```bash
cd server
```

**Bước 2: Cài đặt các thư viện cần thiết.**

```bash
npm install
```

Lệnh này sẽ đọc file `package.json` và cài đặt các thư viện cần thiết cho Backend.

**Bước 3: Tạo file môi trường `.env`.**

Trong thư mục `server`, tạo một file có tên `.env`.

Sao chép nội dung từ file `.env.example` ở thư mục gốc vào file `server/.env`.

Ví dụ nội dung:

```env
PORT=5000

MONGODB_URI=mongodb://127.0.0.1:27017/online_bookstore

JWT_SECRET=your_secret_key_here

CLIENT_URL=http://localhost:5173
```

Giải thích các biến:

| Biến | Ý nghĩa |
|---|---|
| PORT | Cổng chạy Backend. |
| MONGODB_URI | Địa chỉ kết nối MongoDB. |
| JWT_SECRET | Khóa bí mật dùng để ký và xác minh JWT. |
| CLIENT_URL | Địa chỉ Frontend được phép truy cập API. |

Nếu dùng MongoDB Atlas, thay giá trị `MONGODB_URI` bằng Connection String được cung cấp từ Atlas.

Không đưa file `.env` lên GitHub vì file này chứa thông tin cấu hình và khóa bí mật.

**Bước 4: Khởi động Backend.**

```bash
npm run dev
```

Nếu thành công, Terminal sẽ hiển thị thông báo tương tự:

```text
MongoDB connected successfully
Server is running on port 5000
```

**Bước 5: Kiểm tra Backend.**

Mở trình duyệt và truy cập:

http://localhost:5000

Nếu nhận được phản hồi:

```json
{
  "message": "Online Bookstore API is running"
}
```

thì Backend đã hoạt động.

### 5.4. Cài đặt và chạy Frontend

**Bước 1: Mở một Terminal mới.**

Không tắt Terminal đang chạy Backend.

Tại thư mục gốc dự án, di chuyển vào thư mục Frontend:

```bash
cd client
```

**Bước 2: Cài đặt các thư viện.**

```bash
npm install
```

**Bước 3: Khởi động Frontend.**

```bash
npm run dev
```

Nếu thành công, Terminal sẽ hiển thị địa chỉ tương tự:

```text
Local: http://localhost:5173/
```

**Bước 4: Truy cập website.**

Mở trình duyệt và nhập:

http://localhost:5173

Nếu giao diện website hiển thị, Frontend đã chạy thành công.

### 5.5. Tổng kết cách chạy dự án

Khi phát triển, cần mở đồng thời hai Terminal:

**Terminal 1 – Backend**

```bash
cd server
npm install
npm run dev
```

**Terminal 2 – Frontend**

```bash
cd client
npm install
npm run dev
```

Chỉ cần cài đặt thư viện một lần, những lần chạy tiếp theo có thể sử dụng trực tiếp lệnh `npm run dev`, trừ khi có thay đổi về thư viện hoặc môi trường.

---

## 6. Địa chỉ chạy dự án

Sau khi khởi động thành công, hệ thống sử dụng các địa chỉ mặc định sau:

| Thành phần | Địa chỉ |
|---|---|
| Frontend | http://localhost:5173 |
| Backend | http://localhost:5000 |
| Backend API kiểm tra | http://localhost:5000/ |

Trong đó:

- Frontend là nơi người dùng tương tác với website.
- Backend tiếp nhận và xử lý các yêu cầu từ Frontend.
- MongoDB lưu trữ dữ liệu của hệ thống.

Lưu ý: Các địa chỉ trên là địa chỉ chạy trong môi trường phát triển trên máy tính cá nhân. Khi triển khai lên Internet, địa chỉ sẽ thay đổi theo nền tảng Hosting hoặc Cloud được sử dụng.

---

## 7. Quy trình hoạt động của hệ thống

Hệ thống hoạt động theo mô hình Frontend – Backend – Database.

Quy trình cơ bản:

1. Người dùng thao tác trên giao diện Frontend.
2. Frontend gửi yêu cầu HTTP đến Backend thông qua API.
3. Backend tiếp nhận yêu cầu và kiểm tra dữ liệu.
4. Backend xử lý nghiệp vụ và truy vấn MongoDB thông qua Mongoose.
5. MongoDB trả về kết quả truy vấn.
6. Backend gửi phản hồi về Frontend dưới dạng JSON.
7. Frontend nhận dữ liệu và cập nhật giao diện cho người dùng.

Ví dụ: Khi khách hàng xem danh sách sách:

- Frontend gửi yêu cầu lấy danh sách sách.
- Backend nhận yêu cầu từ API.
- Backend truy vấn dữ liệu trong MongoDB.
- MongoDB trả về danh sách sách.
- Backend gửi danh sách sách về Frontend.
- Frontend hiển thị các sản phẩm trên website.

---

## 8. Bảo mật và phân quyền

Dự án định hướng áp dụng một số biện pháp bảo mật cơ bản:

- Sử dụng bcrypt để mã hóa mật khẩu trước khi lưu vào cơ sở dữ liệu.
- Sử dụng JWT để xác thực người dùng.
- Sử dụng Middleware để kiểm tra trạng thái đăng nhập.
- Phân quyền User và Admin ở phía Backend.
- Kiểm tra dữ liệu đầu vào trước khi xử lý.
- Không lưu trữ thông tin bí mật trực tiếp trong mã nguồn.
- Không cho phép người dùng tự đăng ký tài khoản với quyền Admin.

Các biện pháp trên cần được triển khai và kiểm thử trong quá trình phát triển sản phẩm.

---

## 9. Kiểm thử dự án

Trong quá trình phát triển, nhóm tiến hành kiểm thử các chức năng để bảo đảm hệ thống hoạt động đúng yêu cầu.

Các nội dung kiểm thử dự kiến:

| STT | Nội dung kiểm thử | Kết quả mong muốn |
|---|---|---|
| 1 | Đăng ký tài khoản hợp lệ | Tạo tài khoản thành công |
| 2 | Đăng nhập đúng thông tin | Đăng nhập thành công |
| 3 | Đăng nhập sai mật khẩu | Hiển thị thông báo lỗi |
| 4 | Tìm kiếm sách | Hiển thị kết quả phù hợp |
| 5 | Lọc sách theo danh mục | Hiển thị đúng danh mục |
| 6 | Thêm sách vào giỏ hàng | Sản phẩm được thêm |
| 7 | Đặt hàng khi chưa đăng nhập | Yêu cầu đăng nhập |
| 8 | Đặt hàng khi đã đăng nhập | Tạo đơn hàng thành công nếu dữ liệu hợp lệ |
| 9 | Admin thêm sách | Sách mới được lưu |
| 10 | User truy cập chức năng Admin | Bị từ chối truy cập |

---

## 10. Hướng phát triển trong tương lai

Một số chức năng có thể được bổ sung để hoàn thiện hệ thống:

- Tích hợp thanh toán trực tuyến.
- Bổ sung đánh giá và nhận xét sách.
- Gợi ý sách dựa trên lịch sử mua hàng.
- Thống kê doanh thu và số lượng đơn hàng.
- Tối ưu tốc độ tải trang.
- Cải thiện khả năng hiển thị trên thiết bị di động.
- Triển khai website lên môi trường Internet.

---

## 11. Kết luận

Dự án Online Bookstore hướng đến xây dựng một website bán sách trực tuyến với các chức năng cơ bản phục vụ khách hàng và quản trị viên.

Thông qua dự án, nhóm có cơ hội vận dụng kiến thức về phát triển giao diện với React, xử lý Backend bằng Node.js và Express, đồng thời quản lý dữ liệu bằng MongoDB.

Đây cũng là cơ hội để các thành viên rèn luyện kỹ năng lập trình, làm việc nhóm, quản lý mã nguồn và triển khai một sản phẩm phần mềm hoàn chỉnh hơn.# project_ltw
