# Best Practices — Enhancement and Maintenance

## Architecture and Code Quality
- Prefer composables (`useRotate`, `useCanvas`) for separation of concerns; keep `index.vue` thin.
- Maintain strict typings in `types.ts`; extend via additive interfaces to avoid breaking changes.
- Keep public APIs stable: props, events, and exposed methods should be versioned and documented.

## Probability and Fairness
- Probability mode: always validate `sum(probability) === 100` before passing to the component.
- Weight mode: use integer weights; review distribution offline and add monitoring to detect anomalies.
- Server-driven results: when fairness or compliance is required, compute result server-side and pass `prizeId` to the component.

## Security and Anti-abuse
- Gate spins using `verify=true` and a backend check for quota, auth, and rate limits.
- Never expose secret logic in the front end; treat the UI as untrusted.

## UX and Performance
- Avoid extremely long `duration`; recommended 4–8 seconds for perceived fairness.
- Use `angleBase` sign for direction if you need variety; keep magnitude consistent to avoid motion sickness.
- In image mode, provide high-resolution assets and avoid large inline SVG filters that can jank transitions.
- Debounce or ignore repeated clicks during spinning; `canRotate` already guards, but also mute UI cues.

## Canvas Mode Tips
- Tune `textLength`, `lineHeight`, and `fontSize` for different locales; CJK often needs smaller `fontSize`.
- Use contrasting `bgColor`/`color` pairs per segment; test in light/dark backgrounds.
- Re-render canvas when prize data changes; factor a `watch` on `prizes` if you enable dynamic updates.

## Deterministic Outcomes
- For demos: set `prizeId` before starting.
- For live: compute on server after `rotateStart` and call the provided start callback; optionally update `prizeId` mid-spin to align with delayed server decisions.

## Testing and CI
- Add unit tests for selection logic (probability/weight array shaping and angle math).
- Add type checks in CI (`vue-tsc`) and linting as desired.
- Visual regression tests for canvas/image modes if your theme is branded.

## Versioning and Releases
- Document changes in `CHANGELOG.md`.
- Follow semver: breaking prop/event changes require a major bump.
- Provide migration notes when deprecating props or changing defaults.

## Common Pitfalls
- Probability sum not 100 ➜ throws error and blocks spin.
- Using non-integer weights ➜ distribution may not match expectations.
- Changing `prizeId` after spin ends ➜ no effect; set before or during spin.