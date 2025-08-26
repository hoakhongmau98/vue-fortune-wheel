# Wheel of Fortune (Vue 3 + TypeScript) - Core Functionality

Ngôn ngữ: VI

Mục tiêu tài liệu: Giải thích đầy đủ kiến trúc và logic cốt lõi của thành phần `FortuneWheel` để giúp thành viên mới nhanh chóng nắm bắt, bảo trì và mở rộng tính năng.

---

## 1) Tổng quan kiến trúc
- **Kiểu dự án**: Thư viện component Vue 3 (Vite + TS).
- **Entry lib**: `src/components/install.ts` xuất `FortuneWheel` làm entry build trong `vite.config.ts` (chế độ lib, external `vue`).
- **Demo app**: `src/App.vue` dùng trực tiếp component để minh họa 2 chế độ: `canvas` và `image`.
- **Thành phần chính**: `src/components/fortuneWheel/index.vue` (SFC, `<script setup lang="ts">`).
- **Hook lõi**:
  - `hooks/useRotate.ts`: xử lý RNG, state quay, góc, style transition, sự kiện.
  - `hooks/useCanvas.ts`: chỉ dùng khi `type === 'canvas'`, vẽ canvas (vòng, lát cắt, chữ).
- **Kiểu dữ liệu**: `types.ts` mô tả `PrizeConfig`, `CanvasConfig`, `PropsType`.
- **Tiện ích**: `utils.ts` có `getStrArray` để bọc dòng chữ theo độ dài.

Cấu trúc render của `FortuneWheel`:
- Vòng quay: `<div class="fw-wheel" :style="rotateStyle">` chứa `<canvas/>` (mode canvas) hoặc slot `#wheel` (mode image).
- Nút: `<div class="fw-btn">` chứa nút text (canvas) hoặc slot `#button` (image).

---

## 2) API công khai của component
- **Props chính** (xem chi tiết trong README):
  - `type`: `'canvas' | 'image'` (mặc định `canvas`).
  - `useWeight`: `boolean` (mặc định `false`). Nếu `true`, xác suất tính theo `weight` (số nguyên); nếu `false`, dùng `probability` (thập phân, tổng phải bằng 100).
  - `disabled`: khóa quay.
  - `verify`: bật chế độ xác minh từ backend. Khi bật, ấn nút sẽ phát `rotateStart` kèm callback phải được gọi để bắt đầu quay.
  - `canvas`: `CanvasConfig` (radius, textRadius, textLength, textDirection, lineHeight, borderWidth, borderColor, btnText, btnWidth, fontSize).
  - `duration`: thời gian 1 lần quay (ms), dùng làm giá trị transition-duration.
  - `timingFun`: hàm thời gian CSS cho transition.
  - `angleBase`: số vòng cơ sở (360 * angleBase). Âm cho phép quay ngược.
  - `prizeId`: ép kết quả về id giải thưởng (0 là không ép; có thể đổi khi đang quay).
  - `prizes`: danh sách giải thưởng theo `PrizeConfig`.
- **Events**:
  - `rotateStart`: khi người dùng click nút. Nếu `verify = true`, nhận callback `rotate()` để khởi động sau khi xác minh xong.
  - `rotateEnd`: khi kết thúc animation, trả về object giải thưởng.
- **Methods (expose)**:
  - `startRotate()`: gọi từ ref để kích hoạt quay như hành vi click.

---

## 3) Luồng hoạt động và state cốt lõi (useRotate.ts)
- `isRotating`: cờ trạng thái đang quay.
- `rotateEndDeg`: tổng góc cần quay (tích lũy), dùng để set CSS `transform: rotateZ(...)`.
- `prizeRes`: kết quả giải thưởng (object đầy đủ từ `prizes`).
- `probabilityTotal`: tổng xác suất. Nếu `useWeight = false` -> tổng `probability`; nếu `true` -> coi như 100 (chuẩn hóa theo mảng id).
- `decimalSpaces`: nội suy bậc thập phân tối đa của các `probability` để chuyển xác suất thập phân về số lượng phần tử nguyên trong mảng id (tối đa 4 chữ số thập phân -> nhân 10/100/1000/10000).
- `prizesIdArr`: mảng id lặp theo trọng số (weight) hoặc xác suất đã quy đổi; phục vụ RNG đồng đều bằng `random(0, len - 1)`.
- `rotateDuration`: giây, chỉ > 0 khi đang quay (để transition hoạt động một lần quay).
- `rotateStyle`: object CSS động cho wheel (transform, transition-duration, timing-function).
- `rotateBase`: `angleBase * 360`; nếu `angleBase < 0` trừ thêm 360 để đảm bảo hướng quay ngược hợp lý.
- `canRotate`: chỉ cho phép quay khi không `disabled`, không đang quay và tổng xác suất hợp lệ (== 100).
- `watch(prizeId)`: khi đang quay và `prizeId` đổi, tính lại `rotateEndDeg` để “ép” kết quả mới một cách mượt, đảm bảo vẫn tăng/giảm đủ vòng tránh giật.

Các hàm chính:
- `checkProbability()`: ném lỗi nếu tổng xác suất khác 100 (khi `useWeight=false`).
- `handleClick()`: phát `rotateStart` (và chờ callback khi `verify=true`), sau đó gọi `onRotateStart()`.
- `onRotateStart()`: bật `isRotating`, chọn `prizeId` (từ prop hoặc RNG), tính `rotateEndDeg = rotateBase + getTargetDeg(prizeId)`.
- `onRotateEnd()`: tắt `isRotating`, chuẩn hóa góc về `[0,360)`, phát `rotateEnd(prizeRes)`.
- `getRandomPrize()`: bốc ngẫu nhiên id từ `prizesIdArr`.
- `getTargetDeg(prizeId)`: tính góc đích theo vị trí lát cắt: với `n` giải, mỗi lát có `angle = 360/n`, vị trí i -> trả `360 - (angle*i + angle/2)` để trỏ vào giữa lát.

Hệ quả:
- RNG là rời rạc theo id, không lệch do phân phối đều trên `prizesIdArr`.
- Có thể ép kết quả động bằng cách thay `prizeId` trong khi quay; hook xử lý để không gây “quay lùi” bất thường.

---

## 4) Vẽ vòng quay (useCanvas.ts)
- Áp dụng khi `type === 'canvas'`.
- Từ `canvasConfig` (gộp mặc định + `props.canvas`), tính `arc = PI / (prizes.length / 2) = 2π / prizes.length`.
- Vẽ từng lát: đặt `fillStyle = bgColor`, vẽ cung tròn (bên ngoài và vào tâm), stroke theo `borderWidth/Color`.
- Khóa canvas bằng `save()/restore()` để vẽ chữ:
  - Dịch đến điểm giữa lát ở bán kính `textRadius`.
  - Xoay theo `textDirection` (`horizontal`/`vertical`).
  - Bóc chuỗi `name` thành các dòng bằng `getStrArray(name, textLength)`, đo và căn giữa theo `lineHeight`.
- Chỉ vẽ một lần trong `onMounted()`; nếu muốn dynamic redraw khi `prizes` hay `canvas` đổi, cần mở rộng thêm `watch()` (đang chưa có).

---

## 5) Chế độ Image vs Canvas
- **Canvas**: component tự vẽ bánh xe và nút (text). Phụ thuộc `bgColor`, `color`, `name` của prize.
- **Image**: người dùng cung cấp slot `#wheel` (ảnh vòng quay) và `#button` (ảnh nút). Khi ở chế độ này, `bgColor/color/name` không bắt buộc trong `PrizeConfig`.
- Logic quay (RNG, góc, sự kiện) giống nhau giữa hai chế độ; khác biệt chủ yếu ở phần hiển thị.

---

## 6) Điều kiện và ràng buộc dữ liệu
- `prizes.length >= 1`, mỗi phần tử có `id > 0`, `value` (bắt buộc), và:
  - Nếu `useWeight = true` -> cần `weight` là số nguyên không âm; tổng không cần 100.
  - Nếu `useWeight = false` -> cần `probability` (số), tốI đa 4 chữ số thập phân; tổng bắt buộc = 100.
- `prizeId = 0` để sử dụng RNG; khác 0 để ép kết quả. Có thể thay đổi khi đang quay.
- `angleBase` âm -> quay ngược. Giá trị nhỏ (|angleBase| < 1) làm tổng góc ít vòng hơn.
- `duration` xác định thời gian transition; cần đồng bộ với UX mong đợi.

---

## 7) Tương tác Backend (mô hình verify)
- Khi `verify = true`, click nút sẽ phát `rotateStart` với callback `rotate()`.
- Ứng dụng/Backend nên:
  1. Gọi API xác minh đủ điều kiện quay và/hoặc bốc kết quả đảm bảo tuân thủ luật/khuyến mãi.
  2. Nếu hợp lệ -> gọi `rotate()` để bắt đầu quay; đồng thời có thể đặt `prizeId` để ép kết quả trúng tương ứng.
  3. Nếu không hợp lệ -> không gọi `rotate()` và hiển thị lỗi.
- Kết thúc quay (`rotateEnd`) trả về object giải thưởng để client ghi log, hiển thị hoặc gọi API lưu kết quả.

---

## 8) Điểm mở rộng khuyến nghị
- Thêm `watch()` cho `prizes`, `canvas` để tự động vẽ lại canvas khi cấu hình thay đổi.
- Bổ sung validate runtime (dev-only warnings) cho cấu trúc `prizes` để phát hiện sớm cấu hình lỗi.
- Cho phép tùy biến marker (kim chỉ) độc lập với bánh xe.
- Hỗ trợ accessibility: ARIA role, keyboard, announce kết quả.
- Thêm callback `rotateCancel` khi `verify=true` nhưng không được phép quay.
- Thêm API tạm dừng/tiếp tục hoặc hủy quay (nâng cao UX khi ép kết quả).

---

## 9) Tóm tắt
- Logic cốt lõi tách bạch: hiển thị (Canvas/Image) vs. quay/RNG (useRotate).
- RNG dựa trên nhân bản id theo xác suất/trọng số -> chọn ngẫu nhiên đều.
- Hỗ trợ ép kết quả và xác minh backend, phù hợp bài toán quay thưởng thực tế.