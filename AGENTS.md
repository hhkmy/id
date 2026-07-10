# Repository Guidance

## JavaScript Libraries

- Use Anime.js for site animation work.
- Keep Anime.js animation code in `assets/js/anime-enhancements.js` unless there is a clear reason to place it elsewhere.
- Do not reintroduce the old Anime.js `onScroll()` reveal-controller pattern for page content. Above-the-fold hero/header content must render without depending on delayed animation JavaScript.
- For scroll reveal effects, all card/box surfaces across the site must reveal one-by-one and repeat when they leave and re-enter the viewport. Use Anime.js timelines for the clockwork-style sequence, keep each box independently resettable, and avoid tying resets to a whole `.panel` threshold because tall sections such as About > Employment can hide visible boxes.
- Do not replace Anime.js interactions with ad hoc vanilla JavaScript animation effects when Anime.js can handle the behavior.
- Use the installed `clipboard` package (`ClipboardJS`) for code-copy buttons.
- Keep ClipboardJS setup in `assets/js/code-copy.js`; do not fold it into `assets/js/main.js`.
- Do not use `navigator.clipboard` or custom fallback copy scripts for `.code-copy-button`; keep copy behavior in the Hugo `js.Build` bundle through ClipboardJS.
- Keep `assets/js/main.js` as a small initializer that imports focused modules instead of accumulating feature code directly.

## Commit Messages

- Work directly on the `main` branch for repository changes. Do not create new branches unless the user explicitly asks for a branch or pull request workflow.
- If `git push origin main` fails with `GH006: Protected branch update failed` or `Changes must be made through a pull request`, stop and report the protection error to the user. Do not create, switch to, push, or merge a branch as a fallback unless the user explicitly asks for that branch or pull request workflow.
- Prefer Conventional Commit style: `type(scope): summary`.
- Keep the summary short, lowercase, and imperative when it reads naturally.
- Choose a clear scope that names the area changed, such as `lighthouse`, `footer`, `header`, `deps`, or `content`.
- Keep unrelated work in separate commits. When the worktree already has local changes, stage only the files that belong to the current request.
- If a user asks to commit and says separate commits may be needed, split logically independent changes before pushing.
- Good examples:
  - `chore(lighthouse): refresh score data`
  - `perf(lighthouse): improve reported metrics`
  - `build(lighthouse): update generated score data`
  - `fix(header): repair qr modal animation`
  - `docs(content): update article metadata`
