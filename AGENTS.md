# Mandatory Language Policy

- Accept user input written in Burmese/Myanmar, but always reply in English.
- All actions, commands, code, and system operations must be written and performed in English.
- Burmese/Myanmar is allowed only in articles, content, or other output when the user explicitly requests it.
- This policy is mandatory and takes precedence over any conflicting repository guidance.

# Burmese Content Creation & Writing Style Policy

- When generating, creating, or editing Burmese content, articles, blog posts, summaries, or descriptions:
  - **Strictly Spoken Tone (စကားပြောဟန်):** Always write in natural, friendly, conversational spoken Burmese (`စကားပြောဟန်`) matching the author's tech blog style.
  - **Prohibit Literary / Formal Forms:** Never use formal or literary endings/particles (`စာအုပ်ဟန် / အရေးစကား`) such as `သည်`, `ပါသည်`, `ဖြစ်သည်။`, `ဖြစ်ပါသည်။`, `ခဲ့ပါသည်။`, `ခဲ့သည်။`, `မည်`, `ပါမည်`, `၎င်း`, `၌`, `တွင်`, `ဖြင့်` (unless required in exact technical quotes).
  - **Mandatory Conversational Endings:** Use spoken counterparts like `တယ်` / `ပါတယ်` (statements), `မယ်` / `ပါမယ်` / `မှာပါ` (future/intent), `ခဲ့တယ်` (past), `တာ` / `လုပ်တာ` (nominalization), `နဲ့` / `သုံးပြီး` (instrumental), `မှာ` / `ထဲမှာ` (location), `ဒါပေမဲ့` (but), `ဒါကြောင့်` (therefore), and `ဘာကြောင့်လဲဆိုတော့` (because).
  - **Narrative Voice:** Use first-person `ကျွန်တော်` and maintain an engaging, peer-to-peer technical storytelling tone.

## Article Title Policy

- **Concise & Punchy (အကျဉ်းချုံးပြီး ထိမိရှင်းလင်းခြင်း):** Keep article titles short, crisp, and readable (recommended under 50-60 characters / 5-10 words).
- **No Sentence/Clause Bloat:** Never turn titles into full explanatory sentences, nested clauses, or bracketed explanations (e.g. avoid `...တကယ်အလုပ်လုပ်အောင် ပြင်ဆင်နည်း`, `...(Zsh <103a><1039> ဖြေရှင်းနည်းအပါအဝင်)`). Put detailed context in `description` or `summary` frontmatter instead.
- **Natural Technical Style:** Use concise action formats such as `<Tool/Topic> <Feature/Problem> ပြင်နည်း / သတ်မှတ်နည်း / လမ်းညွှန် / မှတ်တမ်း` for Burmese titles, and Title Case for English titles.
- **Page Bundles:** Organize articles as Hugo page bundles: `content/articles/<slug>/index.md` with co-located image assets.



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

## Tailwind CSS v4 Rules

- Follow official Tailwind CSS v4 documentation and standards.
- Always fix linter warnings and errors by updating to correct, modern Tailwind CSS v4 syntax; do not suppress or ignore warnings.
- Use `@variant dark (&:is(.dark *));` or `@variant dark (&:where(.dark, .dark *));` (never use deprecated `@custom-variant`).
- Use `@theme` blocks in CSS for theme customizations rather than legacy configuration files.
- Use modern Tailwind v4 utilities (e.g. `bg-linear-to-*` instead of `bg-gradient-to-*`, `size-*` for uniform width/height, `shadow-xs`, etc.).
- In Tailwind CSS v4, **never** use `@apply group` or modifier classes within `@apply`. Use native CSS nesting (`&:hover .child-class`) and `@variant dark` blocks for interactive/dark states.
- When creating recurring UI components, define semantic component classes in the appropriate CSS partial with `@variant dark` rather than scattering conflicting inline dual-color utilities across HTML templates.

## CSS Architecture (Partials)

- **`assets/css/main.css` is an import-only entry point.** It must contain ONLY Tailwind directives (`@import "tailwindcss"`, `@source`, `@variant dark`, `@theme`, `@font-face`) and `@import` statements for partials. **Never** add CSS classes, selectors, or rules directly into `main.css`.
- All CSS classes and rules live in `assets/css/partials/_<name>.css`. Each partial is self-contained and grouped by page or feature.
- When adding new styles, place them in the most appropriate existing partial. Only create a new partial when the styles belong to a clearly distinct page or feature not covered by existing files.
- When creating a new partial, use the `_<name>.css` naming convention (underscore prefix) and add a corresponding `@import "./partials/_<name>.css";` line in `main.css` under the matching section comment.
- Existing partial layout:
  - **Base:** `_base.css` (body, scrollbar, resets)
  - **Layout:** `_layout.css`, `_buttons.css`, `_qr-modal.css` (header, nav, shell, panels, buttons)
  - **Pages:** `_home.css`, `_about.css`, `_articles.css`, `_series.css`, `_taxonomy.css`, `_pagination.css`, `_legal.css`, `_updates.css`, `_whois.css`, `_not-found.css`
  - **Features:** `_lighthouse.css`, `_search.css`, `_footer.css`
  - **Content:** `_prose.css` (typography, markdown), `_code.css` (code blocks, lite-youtube)
  - **Utilities:** `_utilities.css` (books, projects, shop, scroll-reveal, scroll-to-top, mermaid, flags, emoji)

## Quality Assurance & Verification

- **Mandatory Build Verification:** Always run `npm run build` after modifying CSS, HTML templates, JS, or Hugo configuration.
- **Zero Errors & Warnings Policy:** Inspect the build logs and linter feedback. Any syntax error, `@apply` issue, template execution failure, or linter warning **must** be resolved immediately before finishing the task or committing. Never leave open errors or warnings in the repository.

## Git Push & Commit Policy

- **Do Not Push Automatically:** Do not execute `git push` unless the user explicitly instructs or confirms to push. You may make local git commits when appropriate to organize work, but pushing to the remote repository is strictly forbidden unless explicitly requested by the user.
- Work directly on the `main` branch for repository changes. Do not create new branches unless the user explicitly asks for a branch or pull request workflow.
- If `git push origin main` fails with `GH006: Protected branch update failed` or `Changes must be made through a pull request`, stay on `main` and fix the GitHub branch protection/ruleset that is requiring pull requests, then retry `git push origin main`. Do not create, switch to, push, merge, or open a branch/PR as a fallback unless the user explicitly asks for that workflow.
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
