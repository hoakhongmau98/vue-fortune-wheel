# New Developer Guide

Ngôn ngữ: VI

Mục tiêu: Giúp thành viên mới setup, chạy, debug, build, và nắm conventions để bảo trì/phát triển `vue-fortune-wheel`.

---

## 1) Yêu cầu môi trường
- Node.js LTS (>= 18 khuyến nghị)
- Yarn hoặc npm
- PNPM tuỳ chọn

---

## 2) Cài đặt & chạy demo
```bash
npm install
npm run dev
```
- Truy cập `http://localhost:5173` (mặc định của Vite).
- Xem `src/App.vue` để hiểu cách sử dụng component với 2 chế độ (canvas/image).

---

## 3) Build thư viện
```bash
npm run build
```
- Quy trình: `vue-tsc` type-check -> `vite build` (lib mode), entry `src/components/install.ts`.
- Output: `dist/` với bundling ESM và UMD, kèm `style.css`.

---

## 4) Cấu trúc thư mục chính
- `src/components/fortuneWheel/index.vue`: component chính, đăng ký props, emit events, expose methods.
- `src/components/fortuneWheel/hooks/useRotate.ts`: state quay, RNG, CSS transform.
- `src/components/fortuneWheel/hooks/useCanvas.ts`: vẽ canvas khi type=`canvas`.
- `src/components/fortuneWheel/types.ts`: định nghĩa kiểu `PrizeConfig`, `CanvasConfig`, `PropsType`.
- `src/components/fortuneWheel/utils.ts`: `getStrArray` bọc dòng tên giải.
- `src/components/install.ts`: entry export của gói.

---

## 5) Quy ước mã nguồn
- Vue 3 `<script setup lang="ts">`.
- TypeScript cho mọi hooks/kiểu public.
- Đặt tên biến rõ nghĩa, tránh viết tắt, tuân theo Clean Code.
- Tránh nested quá sâu; dùng early return.
- Không bắt lỗi chung chung; nếu catch phải xử lý có ý nghĩa.

---

## 6) Debug nhanh
- Thêm `console.log` ở `useRotate.ts` để theo dõi:
  - `isRotating`, `rotateEndDeg`, `prizeRes`.
  - `probabilityTotal`, `prizesIdArr.length`.
- Kiểm tra `rotateStyle` thực tế trong DevTools (transform, transition-duration, timing-function).
- Với canvas, tạm thời tô màu/lưới debug trong `drawCanvas()` để kiểm chứng vị trí chữ.

---

## 7) Viết test (gợi ý)
- Tách logic RNG ra hàm thuần để dễ unit test.
- Test tổng xác suất = 100 -> pass; khác -> ném lỗi.
- Test `getTargetDeg()` với mảng `prizes` kích thước khác nhau.

---

## 8) Checklist trước commit
- `npm run build` xanh.
- Kiểm tra kiểu với `vue-tsc` (được chạy trong build script).
- Cập nhật README nếu thay đổi API public.
- Tự review: props mới, event mới, tương thích ngược.

---

## 9) Lộ trình cải tiến (đồng thuận team)
- Redraw canvas khi `prizes`, `canvas` đổi (thêm `watch()`).
- A11y & i18n.
- API `rotateCancel`, `pause`, `resume` (nếu cần).
- Tách RNG để dễ test/DI và hỗ trợ seed từ server.