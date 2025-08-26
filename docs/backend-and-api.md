# Backend & API Integration Guide

Ngôn ngữ: VI

Mục tiêu: Chuẩn hoá tích hợp Backend với component `FortuneWheel` để đảm bảo tính công bằng, khả năng kiểm soát, và khả năng audit trong môi trường production.

---

## 1) Nguyên tắc thiết kế
- **Server-authoritative**: Backend quyết định có cho quay hay không và (tuỳ chế độ) quyết định kết quả.
- **Idempotency**: Mọi yêu cầu quay phải có requestId để tránh double-spend.
- **Traceability**: Log đầy đủ người dùng, thời điểm, seed, kết quả, tham số xác suất.
- **Fairness & Compliance**: Cân nhắc thuật toán RNG, chứng cứ xác suất, và luật khuyến mãi.

---

## 2) Hai mô hình điều khiển kết quả
- **Client RNG (mặc định)**: `verify=false`, client tự RNG theo cấu hình `prizes`. Dùng cho demo, nội bộ, hoặc game casual không yêu cầu kiểm soát giải.
- **Server Verified/Controlled**: `verify=true`. Luồng điển hình:
  1. Người dùng click -> component phát `rotateStart((rotate) => ...)`.
  2. Frontend gọi API `POST /lottery/spin/prepare` kèm `userId`, `campaignId`, `requestId`.
  3. Backend kiểm tra điều kiện (quota, cooldown, đủ điều kiện tham dự, tồn kho giải,...).
  4. Nếu được phép, backend chọn `prizeId` (có thể dùng RNG server hoặc rule-based) và trả `{ allowed: true, prizeId }`.
  5. Frontend gọi `rotate()` để bắt đầu quay và đồng thời set `prizeId` vào component (hoặc truyền qua props trước đó).
  6. Khi quay kết thúc (`rotateEnd`), frontend gọi `POST /lottery/spin/confirm` với kết quả để backend chốt và phát thưởng.

Lợi ích: Kiểm soát minh bạch, dễ audit, ngăn chặn gian lận client.

---

## 3) Hợp đồng API (gợi ý)
- `POST /lottery/spin/prepare`
  - Request
    ```json
    {
      "userId": "u_123",
      "campaignId": "c_2024_q4",
      "requestId": "uuid-...",
      "clientTs": 1730000000000
    }
    ```
  - Response (allowed)
    ```json
    {
      "allowed": true,
      "prizeId": 2,
      "spinConfig": {
        "duration": 6000,
        "angleBase": 10
      }
    }
    ```
  - Response (denied)
    ```json
    { "allowed": false, "reason": "cooldown" }
    ```

- `POST /lottery/spin/confirm`
  - Request
    ```json
    {
      "userId": "u_123",
      "campaignId": "c_2024_q4",
      "requestId": "uuid-...",
      "result": {
        "prizeId": 2,
        "value": "Red's value"
      },
      "clientTs": 1730000005000
    }
    ```
  - Response
    ```json
    { "status": "ok" }
    ```

Ghi chú: `spinConfig` có thể ghi đè `duration`, `angleBase` theo chiến dịch.

---

## 4) Mô hình dữ liệu Prize (gợi ý)
- Bảng `prize` (id, name, value, weight, probability, stock, active, campaignId,...)
- Bảng `spin_log` (id, requestId, userId, prizeId, campaignId, allowed, reason, createdAt, seed, clientMeta,...)
- Bảng `inventory` (prizeId, stock, reserved, consumed)

Quy tắc:
- Với `useWeight=true`: dùng `weight` (số nguyên). Server nên chuẩn hoá xác suất từ trọng số.
- Với `useWeight=false`: tổng `probability` bắt buộc = 100.

---

## 5) Thuật toán chọn giải (server)
- RNG cryptographically strong (ví dụ: `crypto.randomInt`) hoặc PRNG với seed log lại.
- Chọn theo phân phối rời rạc (alias method, hoặc mảng nhân bản id tương tự client nhưng chạy trên server).
- Tích hợp ràng buộc: hết hàng, daily cap, per-user cap, black/white list.

---

## 6) Bảo mật & chống gian lận
- Chống thao tác DOM (ép `prizeId`) bằng cách chỉ tin kết quả đã confirm từ server.
- Ký/verify JWT cho request, rate limiting, CSRF, replay protection (idempotency key).
- Obfuscate/không hiển thị `probability` nhạy cảm trên client.

---

## 7) Lỗi, retry và đồng bộ trạng thái
- Nếu `prepare` timeout: không gọi `rotate()`, hiển thị lỗi; cho phép thử lại.
- Nếu `confirm` thất bại: retry theo backoff; tránh nhân đôi thưởng dùng `requestId`.
- Đảm bảo UI không kẹt ở trạng thái quay nếu có lỗi mạng: theo dõi `rotateEnd` để reset.

---

## 8) Checklist tích hợp
- Mapping 1-1 `prizeId` giữa server và client.
- Kiểm thử tổng xác suất = 100 (hoặc trọng số hợp lệ).
- Ghi log đầy đủ mọi bước; theo dõi KPI: spins, win rate, prize consumption.
- Đảm bảo `duration`, `angleBase`, `timingFun` phù hợp UX.