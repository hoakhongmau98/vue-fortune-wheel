# Best Practices: Enhancement & Maintenance

Ngôn ngữ: VI

---

## 1) Kiến trúc & API
- **Giữ API ổn định**: Thêm props mới theo nguyên tắc backward-compatible; ghi rõ trong CHANGELOG/README.
- **Tách biệt concerns**: Logic quay (useRotate) độc lập với hiển thị (canvas/image).
- **Expose tối thiểu**: Chỉ expose `startRotate()`; các thao tác nâng cao dùng events.
- **Schema rõ ràng**: `PrizeConfig` phải có `id`, `value`; tuỳ chế độ cần `probability` hoặc `weight`.

## 2) Hiệu năng & UX
- **CSS transform**: Sử dụng `transform: rotateZ` + `will-change: transform` để tận dụng GPU.
- **Timing function**: Giữ `cubic-bezier(0.36, 0.95, 0.64, 1)` hoặc cung cấp preset.
- **Duration hợp lý**: 4–8s thường cho cảm giác tốt; đồng bộ âm thanh/hiệu ứng.
- **Canvas redraw**: Thêm `watch()` để redraw khi props thay đổi nhưng debounce để tránh render thừa.

## 3) Tính đúng đắn & Kiểm thử
- **Xác suất**: Validate tổng `probability` = 100 ở dev. Với `useWeight`, kiểm `weight` là số nguyên >= 0.
- **RNG**: Tách RNG ra hàm, unit test phân phối và biên (1 phần tử, góc âm, `angleBase` âm).
- **Deg tính toán**: Test `getTargetDeg()` với n = {2,3,6,8,12} để đảm bảo marker trúng giữa lát.
- **Event flow**: Test `verify=true` đường đi `rotateStart -> rotate() -> rotateEnd`.

## 4) Bảo trì & An toàn
- **TypeScript nghiêm ngặt**: tránh `any`, annotate hàm public/export.
- **Không nuốt lỗi**: Lỗi xác suất không đúng phải fail-fast.
- **Docs cập nhật**: Khi thêm props/event mới, cập nhật `README`, `docs/` đồng bộ.
- **Chống ép kết quả client**: Ở app thực tế, chỉ tin kết quả server (xem Backend guide).

## 5) Khả năng mở rộng
- **Plugin hiệu ứng**: Cho phép inject hiệu ứng âm thanh, particle khi quay/kết thúc.
- **Marker tuỳ biến**: Hỗ trợ slot/prop riêng cho kim chỉ.
- **A11y**: Role, keyboard nav, announce kết quả.
- **I18n**: Tách text/nội dung prize khỏi logic.

## 6) Observability
- **Metrics**: emit hooks/telemetry (spins, cancels, errors, win distribution).
- **Logging**: Ghi lại `prizeId`, `duration`, `angleBase`, `timingFun` để debug run-time.
- **Error boundary**: Bao quanh nơi tích hợp component để thu lỗi UI.

## 7) Checklist review mã
- Props mới có default hợp lý? có ảnh hưởng ngược không?
- Event thêm có tài liệu? có test tối thiểu?
- Thay đổi canvas có làm lệch toạ độ chữ?
- RNG thay đổi có giữ phân phối kỳ vọng?