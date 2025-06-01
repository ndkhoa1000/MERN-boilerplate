# MERN-boilerplate 

## Tổng Quan Dự Án

Dự án này là một boilerplate cho MERN stack (MongoDB, Express.js). Hai phiển bản chính là xác thực phi trạng thái dựa trên **JWT (JSON Web Token)** và xác thực có trạng thái dựa trên **session**.

**_Tham khảo_**: một boilerplate cho xác thực email, xác thực 2 bước, lưu các sessions đăng nhập v.v [MERN Auth with Nodejs, 2FA, Email Verification, Cookies, Sessions, JWT & Nextjs](https://www.youtube.com/watch?v=2LRLsMracAY)

Tài liệu này cung cấp hướng dẫn cho cả hai phương pháp. Vui lòng tham khảo nhánh (branch) hoặc cấu hình cụ thể bạn đang sử dụng nếu kho lưu trữ của bạn duy trì các phiên bản riêng biệt.

**Các Tính Năng Backend Cốt Lõi (Chung cho cả hai phương pháp xác thực):**

*   **Backend Node.js & Express.js:** Một nền tảng vững chắc để xây dựng các API RESTful.
*   **Tích Hợp MongoDB:** Sử dụng Mongoose ODM để tương tác với cơ sở dữ liệu.
*   **Passport.js:** Tận dụng Passport cho các chiến lược xác thực.
*   **TypeScript:** Được viết bằng TypeScript để đảm bảo an toàn kiểu và cải thiện trải nghiệm của nhà phát triển.
*   **Cấu Hình Môi Trường:** Sử dụng tệp `.env` để quản lý các cài đặt dành riêng cho môi trường.
*   **Ghi Log Có Cấu Trúc:** Triển khai Winston để ghi log ứng dụng.
*   **Xử Lý Lỗi:** Middleware xử lý lỗi tập trung.
*   **Xác Thực Đầu Vào:** Sử dụng Zod để xác thực dữ liệu yêu cầu.
*   **Cấu Trúc Module:** Được tổ chức thành các services, controllers, models, routes, và utils để dễ bảo trì hơn.
*   **Quản Lý Người Dùng:** Quản lý hồ sơ người dùng cơ bản (lấy, cập nhật, xóa).
*   **Tích Hợp Google OAuth 2.0:** Được hỗ trợ cho cả luồng JWT và session.

## Hướng Dẫn Sử Dụng Dự Án

### Điều Kiện Tiên Quyết

*   Node.js (khuyến nghị v18 trở lên)
*   npm hoặc yarn
*   Một instance MongoDB (cục bộ hoặc lưu trữ trên đám mây như MongoDB Atlas)

### Hướng Dẫn Cài Đặt Chung

1.  **Sao Chép (Clone) Kho Lưu Trữ:**
    ```bash
    git clone https://github.com/ndkhoa1000/MERN-boilerplate
    cd MERN-boilerplate/backend
    ```
    * Hãy đảm bảo bạn đã chuyển sang nhánh (checkout branch) mong muốn.*
    ```bash
    # Ví dụ: git checkout main # Cho phiên bản JWT
    # Ví dụ: git checkout auth(local-google)-noRBAC  # Cho phiên bản session
    ```

2.  **Cài Đặt Các Gói Phụ Thuộc:**
    ```bash
    npm install
    # hoặc
    # yarn install
    ```

3.  **Thiết Lập Biến Môi Trường:**
    *   Tạo một tệp `.env` trong thư mục `backend` bằng cách sao chép tệp ví dụ:
        ```bash
        cp .env.example .env
        ```
    *   Mở tệp `.env` và điền các giá trị bắt buộc. **Lưu ý rằng một số biến là dành riêng cho chiến lược xác thực bạn đang sử dụng.**

        **Các Biến Chung (Bắt buộc cho cả hai):**
        *   `PORT`: Cổng mà máy chủ backend của bạn sẽ chạy (ví dụ: 8000).
        *   `NODE_ENV`: Đặt thành `development` hoặc `production`.
        *   `MONGO_URI`: Chuỗi kết nối MongoDB của bạn.
        *   `GOOGLE_CLIENT_ID`: Google OAuth Client ID của bạn.
        *   `GOOGLE_CLIENT_SECRET`: Google OAuth Client Secret của bạn.
        *   `GOOGLE_CALLBACK_URL`: URL callback Google OAuth của backend (ví dụ: `http://localhost:8000/api/auth/google/callback`).
        *   `FRONTEND_ORIGIN`: URL của ứng dụng frontend của bạn (cho CORS và cài đặt cookie/chuyển hướng).
        *   `FRONTEND_GOOGLE_CALLBACK_URL`: URL callback Google OAuth của frontend của bạn.

        **Các Biến Dành Riêng Cho JWT (Chỉ khi sử dụng xác thực JWT):**
        *   `JWT_SECRET`: Một khóa bí mật mạnh, duy nhất để ký JWT.
        *   `JWT_EXPIRES_IN`: Thời gian hết hạn cho access token (ví dụ: `1d`, `1h`, `15m`).

        **Các Biến Dành Riêng Cho Session (Chỉ khi sử dụng xác thực dựa trên session):**
        *   `SESSION_SECRET`: Một khóa bí mật mạnh, duy nhất để ký cookie session. **Rất quan trọng cho bảo mật session.**
        *   `SESSION_EXPIRES_IN`: Thời gian hết hạn cho access token (ví dụ: `1d`, `1h`, `15m`).
    
4.  **Chạy Máy Chủ Phát Triển:**
    ```bash
    npm run dev
    ```
    Lệnh này sẽ khởi động máy chủ bằng `ts-node-dev` (nếu được cấu hình trong `package.json`), cung cấp tính năng tải lại nóng (hot-reloading) cho phát triển TypeScript. Máy chủ thường có thể truy cập tại `http://localhost:PORT`.

5.  **Xây Dựng (Build) Cho Môi Trường Production:**
    ```bash
    npm run build
    ```
    Lệnh này biên dịch mã TypeScript sang JavaScript trong thư mục `dist`.

6.  **Khởi Động Trong Môi Trường Production:**
    ```bash
    npm run start
    ```
    Lệnh này chạy mã JavaScript đã biên dịch từ thư mục `dist` bằng Node.js. Đảm bảo `NODE_ENV` của bạn được đặt thành `production` trong tệp `.env` cho các triển khai production.

### Cấu Trúc Dự Án (Backend)

Cấu trúc dự án backend được thiết kế để dễ dàng mở rộng và bảo trì:
```
backend/
├── src/
│   ├── @types/             # Khai báo kiểu tùy chỉnh
│   ├── config/             # Cấu hình ứng dụng (app, database, http, passport)
│   ├── controllers/        # Xử lý yêu cầu, logic định tuyến
│   ├── enums/              # Định nghĩa Enum (mã lỗi, nhà cung cấp)
│   ├── middlewares/        # Middleware của Express (asyncHandler, errorHandler, isAuthenticated)
│   ├── models/             # Model và schema của Mongoose (User, Account)
│   ├── routes/             # Định nghĩa các tuyến API
│   ├── services/           # Logic nghiệp vụ, tương tác cơ sở dữ liệu
│   ├── utils/              # Các hàm tiện ích (bcrypt, jwt, logger, appError)
│   ├── validation/         # Schema xác thực Zod
│   ├── index.ts            # Điểm vào chính của ứng dụng
├── .env.example            # Ví dụ về biến môi trường
├── Dockerfile.dev          # Dockerfile cho phát triển (nếu có)
├── package.json
├── tsconfig.json
└── ... (các tệp dự án khác)
```

## Các Phiên Bản Xác Thực

Bản mẫu này có thể được cấu hình hoặc có các nhánh riêng biệt cho các phương thức xác thực sau:

### 1. Xác Thực JWT (JSON Web Token) (Phi trạng thái - Stateless)
**_Note_**: Hiện tại chỉ mới sử dụng accessToken, chưa triển khai refreshToken.

*   **Khái niệm:** Sau khi đăng nhập thành công, máy chủ cấp một JWT đã ký (access token) cho client. Client bao gồm token này trong header `Authorization` (thường là Bearer token) cho các yêu cầu tiếp theo đến các tài nguyên được bảo vệ. Máy chủ xác thực token mà không cần lưu trữ trạng thái session.
*   **Tính năng chính:** Khả năng mở rộng, phi trạng thái, phù hợp cho microservices, SPA và ứng dụng di động.
*   **Đăng xuất:** Chủ yếu là phía client xóa token (chưa có frontend để ví dụ). Mở rộng: Tạo danh sách từ chối (denylist) phía máy chủ cho access token hoặc vô hiệu hóa refresh token có thể được triển khai để tăng cường bảo mật (dùng **Redis**).
*   **Refresh Token:** Được khuyến nghị để quản lý vòng đời token, cho phép client lấy access token mới mà không cần xác thực lại. Model `Account` trong bản mẫu này đã được chuẩn bị để lưu trữ refresh token.
*   **Các Tệp Liên Quan (Thường gặp):**
    *   `src/utils/jwt.ts` (để ký/xác minh token)
    *   `src/config/passport.config.ts` (cấu hình chiến lược JWT)
    *   `src/middlewares/isAuthenticated.middleware.ts` (kiểm tra JWT trong các yêu cầu)

### 2. Xác Thực Dựa Trên Session (Có trạng thái - Stateful)

*   **Khái niệm:** Sau khi đăng nhập thành công, máy chủ tạo một session và lưu trữ ID session trong một cookie gửi đến client. Client tự động gửi cookie này với các yêu cầu tiếp theo. Máy chủ sử dụng ID session để truy xuất dữ liệu session (ví dụ: thông tin người dùng) được lưu trữ phía máy chủ (trong bộ nhớ theo mặc định, hoặc một kho lưu trữ bền vững trong môi trường production).
*   **Tính năng chính:** Truyền thống, đơn giản hơn để triển khai cho một số ứng dụng web, trạng thái được quản lý trên máy chủ.
*   **Đăng xuất:** Máy chủ hủy session, và client thường xóa cookie session.
*   **Các Tệp Liên Quan (Thường gặp):**
    *   Cài đặt middleware `express-session` (thường trong `src/index.ts` hoặc một tệp cấu hình riêng).
    *   `src/config/passport.config.ts` (LocalStrategy với `session:true`, và các triển khai cho `passport.serializeUser` và `passport.deserializeUser`).

## Các Endpoint API Chính (Đường dẫn cơ sở mặc định: `/api`)

Hành vi của một số Endpoint, đặc biệt là đăng nhập và đăng xuất, sẽ khác nhau dựa trên chiến lược xác thực.

### Xác Thực (`/auth`)

*   **`POST /register`**: Đăng ký người dùng cục bộ mới. (Chung cho cả hai)
*   **`GET /google`**: Bắt đầu đăng nhập Google OAuth. (Chung cho cả hai)
*   **`GET /google/callback`**: Callback Google OAuth. (Hành vi khác nhau: đặt cookie session hoặc cấp JWT)

*   **Nếu sử dụng Xác thực JWT:**
    *   `POST /login`: Đăng nhập người dùng cục bộ, trả về một access token (và lý tưởng là một refresh token).
    *   `POST /logout`: Xác nhận đăng xuất. Client xử lý việc xóa token. Máy chủ có thể vô hiệu hóa refresh token hoặc thêm access token vào danh sách từ chối nếu được triển khai.
    *   *(Cần có một điểm cuối `/refresh-token` để sử dụng refresh token.)*

*   **Nếu sử dụng Xác thực Dựa Trên Session:**
    *   `POST /login`: Đăng nhập người dùng cục bộ, thiết lập một session và đặt một cookie session.
    *   `POST /logout`: Đăng xuất người dùng bằng cách hủy session phía máy chủ và xóa cookie session.

### Người Dùng (`/user` - Các Tuyến Được Bảo Vệ)

*Các tuyến này yêu cầu một JWT hợp lệ hoặc một session đang hoạt động, tùy thuộc vào cấu hình.*
*   `GET /current`: Lấy hồ sơ của người dùng hiện đang được xác thực.
*   `GET /profile/:id`: Lấy hồ sơ của người dùng theo ID.
*   `PUT /profile/update`: Cập nhật hồ sơ của người dùng hiện tại.
*   `DELETE /profile/delete`: Xóa tài khoản của người dùng hiện tại.

## Phát Triển Thêm

1.  **Tích Hợp Frontend:**
    *   Phát triển một ứng dụng frontend (ví dụ: React, Vue, Angular).
    *   **Đối với JWT:** Triển khai lưu trữ token an toàn (ví dụ: cookie HttpOnly cho refresh token, bộ nhớ/localStorage cho access token), gửi token với các yêu cầu và xử lý logic làm mới token.
    *   **Đối với Session:** Đảm bảo frontend xử lý cookie chính xác và thực hiện các yêu cầu bao gồm thông tin xác thực (credentials).

2.  **Cải Tiến Dành Riêng Cho JWT:**
    *   **Triển Khai Refresh Token:** Nếu chưa được triển khai đầy đủ, hãy phát triển một chiến lược xoay vòng refresh token mạnh mẽ. Model `Account` ([`backend/src/models/account.model.ts`](backend/src/models/account.model.ts)) bao gồm các trường (`refreshToken`, `tokenExpiry`) làm điểm khởi đầu.
    *   **Danh Sách Từ Chối Access Token:** Để vô hiệu hóa ngay lập tức access token phía máy chủ khi đăng xuất hoặc các sự kiện bảo mật (ví dụ: sử dụng Redis).

3.  **Cải Tiến Dành Riêng Cho Session:**
    *   **Kho Lưu Trữ Session Bền Vững:** Đối với môi trường production, hãy thay thế kho lưu trữ session trong bộ nhớ mặc định bằng một kho lưu trữ bền vững như `connect-mongo` (cho MongoDB) hoặc một kho lưu trữ dựa trên Redis. Điều này rất quan trọng để ngăn mất session khi máy chủ khởi động lại.

4.  **Cải Tiến Chung (Áp dụng cho cả hai):**
    *   **Kiểm Thử (Testing):** Triển khai các bài kiểm thử đơn vị (unit test), kiểm thử tích hợp (integration test) và kiểm thử đầu cuối (end-to-end test) toàn diện.
    *   **Triển Khai (Deployment):** Cấu hình để triển khai lên nền tảng lưu trữ bạn chọn (ví dụ: Docker, Heroku, AWS, Vercel).
    *   **Các Tính Năng Nâng Cao:** Thêm các tính năng như đặt lại mật khẩu, xác minh email, xác thực hai yếu tố, kiểm soát truy cập dựa trên vai trò (RBAC), v.v., khi cần thiết.

---

README tổng hợp này nhằm mục đích cung cấp một cái nhìn tổng quan toàn diện. Hãy điều chỉnh nó thêm dựa trên cách bạn dự định trình bày hoặc quản lý các phiên bản xác thực khác nhau trong kho lưu trữ của mình.
