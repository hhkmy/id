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
- **Natural Technical Style:** Use concise action formats such as `<Tool/Topic> <Feature/Problem> ပြင်နည်း / သတ်မှတ်နည်း / လမ်းညွှန် / မှတ်တမ်း` for Burmese titles, and Title Case for English titles.
- **Page Bundles:** Organize articles as Hugo page bundles: `content/articles/<slug>/index.md` with co-located image assets.

# Empirical Verification & Anti-Hallucination Policy (Code & Content Integrity)

This website is a trusted engineering resource. Hallucinated APIs, fabricated flags, non-existent configuration keys, or unverified code spread toxic, misleading, and broken information. All outputs—whether code implementations, shell commands, or published articles—must adhere to strict empirical engineering standards:

## 1. Technical Writing & Documentation Integrity
- **Zero-Tolerance for Hallucinations:** Every CLI flag, command syntax, configuration key, tool option, or software behavior mentioned in an article, note, or guide MUST be empirically verified against the live system (`--help`, man pages), active source code, or authoritative documentation before writing. Never guess or assume flags or options.
- **Mandatory Pre-Authoring Execution:** If an article provides a command, script, or setup step, execute or test it in the terminal first to confirm that it genuinely succeeds with exit code 0. Never publish unverified commands.
- **Owner Verification Escalation:** If a command or configuration cannot be tested directly due to lack of environment access, credentials, special hardware, destructive risk, or permission boundaries, DO NOT invent plausible-sounding commands. Clearly pause, disclose the limitation to the user/owner, and ask them to verify or run the test before documenting it.

## 2. Professional Coding & Implementation Integrity
- **Grounding in Active Codebase:** Never hallucinate API methods, import paths, or third-party packages. Always verify available dependencies in `package.json`, inspect active imports, and check actual function definitions in the codebase before writing code.
- **Official Documentation Grounding:** For Hugo (v0.165+), Tailwind CSS v4, Anime.js, and dependencies, always ground implementations on official documentation rather than outdated memory or deprecated patterns.
- **Mandatory Build & Diagnostic Verification:** Every code, template, or style change must be validated by running `npm run build` and checking diagnostics before concluding work. Zero errors and zero linter warnings are tolerated.
- **Clean Architecture & Quality Gates:** Adhere to SonarCloud Quality Gate standards (`0 open issues`), keep cognitive complexity under 15, prevent security vulnerabilities (e.g. log injection, unsafe process execution), and ensure code executes correctly without runtime failures.

# Repository Guidance

## Symbols & Arrow Guidelines

- **Unicode Over LaTeX for Arrows & Symbols:** Always use standard Unicode arrows (`→`, `←`, `↔`, `⇒`) instead of LaTeX math syntax (`$\to$`, `$\longrightarrow$`, `\implies`, `$$\text{...}$$`). Antigravity chat and markdown previews do not run KaTeX/LaTeX parsers on regular text, causing raw LaTeX commands to render as unsightly plain text.
- **Math & Dimensions:** Use Unicode symbols for dimensions and math operators (e.g. `512 × 512 px` instead of `$512 \times 512$`).
- **No Raw Mermaid in Chat:** Do not output raw Mermaid code blocks in chat conversations since the chat interface does not render them visually. Use clean Unicode arrows, lists, or structured text instead.

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

## Hugo Standards & Official Documentation Policy

- **Official Grounding Mandatory:** When implementing, refactoring, or researching Hugo functions, page methods, shortcodes, and template structures, always prioritize the official documentation at [gohugo.io/documentation](https://gohugo.io/documentation/).
- **Targeted Documentation Search:** Do not guess function signatures or rely on outdated memory or obsolete forum posts. Use web searches targeted to `domain: "gohugo.io"` and read pages directly via official Hugo URLs (`https://gohugo.io/functions/...`, `https://gohugo.io/methods/...`).
- **Hugo Version (v0.165.0+):** Strictly adhere to modern Hugo standards. Never introduce legacy or deprecated functions (e.g. `.URL`, `$.Site.RegularPages`, `$.Site.Data`, legacy paginate). Use modern top-level functions and context methods (`site.RegularPages`, `site.Data`, `page.GetPage`, `.RelPermalink`).

## Quality Assurance & Verification

- **Mandatory Build Verification:** Always run `npm run build` after modifying CSS, HTML templates, JS, or Hugo configuration.
- **License Compliance Policy:** All dependencies must comply with permissive open-source licenses (MIT, ISC, Apache-2.0, BSD). Never introduce copyleft or viral licenses (GPL, LGPL, AGPL, SSPL). Always verify compliance offline before committing via `npm run check:licenses`.
- **Zero Errors & Warnings Policy:** Inspect the build logs and linter feedback. Any syntax error, `@apply` issue, template execution failure, or linter warning **must** be resolved immediately before finishing the task or committing. Never leave open errors or warnings in the repository.
- **Automated IDE Problems Resolution (`@[current_problems]`):** Whenever `@[current_problems]` appears in user context or metadata, you MUST proactively and automatically resolve all reported warnings, errors, and diagnostic messages across all mentioned files during the current turn before concluding. Refer to `.agents/skills/ide-diagnostics/` for proactive prevention rules, including avoiding object stringification (`no-base-to-string`), ensuring concrete primitive JSDoc types, and eliminating Tailwind CSS v4 class collisions. Never ignore or leave items in `@[current_problems]`.
- **Prohibit Inline Property Collisions:** In Tailwind CSS v4, never place conflicting base and variant classes on the same element in HTML templates (e.g. `text-slate-950 dark:text-white`, `border-slate-200 dark:border-slate-700`, `bg-white dark:bg-slate-950`). This triggers IDE property collision warnings (`'X' applies the same CSS properties as 'dark:Y'`). Always encapsulate them into semantic component classes in the appropriate CSS partial using `@variant dark { ... }` blocks.

## SonarQube & SonarCloud Standards

- **Vendor & Build Asset Exclusions:** Keep third-party search libraries and generated files (`assets/pagefind/**`, `public/**`, `node_modules/**`, `resources/**`) excluded in `.sonarcloud.properties` and `sonar-project.properties`. Never allow vendor code to generate quality gate noise.
- **Coverage Exclusion Policy:** Maintain `sonar.coverage.exclusions=**/*` in `sonar-project.properties`. As a static Hugo blog without automated test runners, test coverage must be excluded to prevent SonarCloud default Quality Gate failure (`new_coverage < 80%`).
- **Function Cognitive Complexity (`javascript:S3776`):** Keep functions focused and modular; never exceed a cognitive complexity score of 15. Decompose large routines into helper functions.
- **CSS `@import` Order (`css:S8778`):** In `assets/css/main.css` and all CSS entrypoints, all `@import` statements must strictly precede all other rules and at-rules (`@source`, `@variant dark`, `@theme`, `@font-face`).
- **Modern JavaScript & Security Conventions:**
  - Prefer `element.dataset.*` over `setAttribute("data-*", ...)` or `getAttribute("data-*")` (`javascript:S7761`).
  - Prefer `String#codePointAt()` and `String.fromCodePoint()` over `charCodeAt()` and `fromCharCode()` (`javascript:S7758`).
  - Prefer `String#replaceAll()` over regex `replace(/.../g)` (`javascript:S7781`).
  - Re-export symbols directly with `export { X } from "./module.js"` instead of importing first (`javascript:S7763`).
  - Never leave empty `catch` blocks without an explanatory comment explaining why the exception is safely ignored (`javascript:S2486`).
  - Simplify conditions (`else if` instead of nesting `if` inside `else`, `for-of` instead of indexed `for` over arrays).
  - **Safe Process Execution (`javascript:S4036`):** Never invoke bare command names (e.g. `"curl"`, `"npx"`, `"wrangler"`) with `execFileSync`, `execFile`, or `spawn`. Always use verified absolute binary paths (`/usr/bin/curl`, `process.execPath`, or `path.join(path.dirname(process.execPath), "npx")`) or sanitize the PATH.
  - **Nullish Coalescing for Defaults (`javascript:S6644`):** Use `??` or `||` instead of ternary expressions for fallback/default assignments (`const x = val ?? defaultVal`).
  - **Log Injection Prevention (`jssecurity:S5145` / CWE-117):** Never concatenate untrusted HTTP response strings, external API objects, or user input into `console.log`, `console.warn`, or `console.error`. Use parameterized logging (`%s`, `%d`), calculate lengths from local arrays, and strip CRLF characters.
  - **All Green & Grade 'A' Policy (Zero Sonar Issues):** Every scan must achieve **Passed (Green)** on the Quality Gate and strictly maintain **Grade A (1.0)** across all categories: Security (A), Reliability (A), Maintainability (A), Security Hotspots (100% / A), and `0 open issue(s)`. Run `npm run sonar:issues` before committing to verify full compliance. Refer to `.agents/skills/sonarcloud-standards/` for detailed guidelines.
- **Accessible Name & Visible Label Compliance (WCAG 2.5.3 / `Web:S7927`):**
  - Interactive elements with visible text must never have conflicting or mismatched `aria-label` attributes.
  - Do not add redundant `aria-label` attributes to elements whose visible label already conveys the name. For extra context, nest `<span class="sr-only">`.
  - For icon-only buttons and links, use `<span class="sr-only">Description</span>` inside the element for reliable assistive technology access.
- **Shell & Python Standards:**
  - In Bash scripts, always use `[[ ... ]]` instead of POSIX `[ ... ]` (`shelldre:S7688`).
  - Always provide a default `*) ;;` case branch in `case` statements (`shelldre:S131`).
  - Provide explicit `return` statements at the end of shell functions (`shelldre:S7682`).
  - Define constants for literals repeated 3 or more times (`shelldre:S1192`).
  - In Python, use `str.replace()` for literal string substitutions rather than `re.sub()` (`python:S5361`).

## Git Push & Commit Policy

- **Do Not Push Automatically:** Do not execute `git push` unless the user explicitly instructs or confirms to push. You may make local git commits when appropriate to organize work, but pushing to the remote repository is strictly forbidden unless explicitly requested by the user.
- **Atomic Logical Commits (No Micro-Commits):** Never commit single file edits repeatedly or make intermediate trial commits. Group all related changes for a complete task, feature, or bugfix into one clean, verified commit.
- **Commit Message Standard:**
  - Follow Conventional Commits: `type(scope): summary`.
  - Header: Short, lowercase, imperative, under 72 characters.
  - Body: Always include a blank line after the header, followed by a detailed bulleted list (`- ...`) detailing the specific changes made, reasons, and files affected.
  - When reporting to the user after committing, provide the commit hash and a bulleted listing of changes made.
- **Consolidate Unpushed Commits:** If multiple incremental or trial commits have accumulated locally before pushing to remote, reorganize/squash them into clean, logically grouped commits so the remote Git history remains clean.
- **Zero Same-File Duplicate Commits:** When modifying a file or feature (such as `README.md`, documentation, configs, or a specific module) that was already touched in an unpushed local commit, never create a second or third commit touching that exact same file or scope. Always consolidate, squash, or amend into the existing unpushed commit before reporting to the user.
- Work directly on the `main` branch for repository changes. Do not create new branches unless the user asks for a branch or pull request workflow.
- If `git push origin main` fails with `GH006: Protected branch update failed` or `Changes must be made through a pull request`, stay on `main` and fix the GitHub branch protection/ruleset that is requiring pull requests, then retry `git push origin main`. Do not create, switch to, push, merge, or open a branch/PR as a fallback unless the user explicitly asks for that workflow.
- Keep unrelated work in separate commits. When the worktree already has local changes, stage only the files that belong to the current request.
- If a user asks to commit and says separate commits may be needed, split logically independent changes before pushing.
- Good examples:
  - `chore(lighthouse): refresh score data`
  - `perf(lighthouse): improve reported metrics`
  - `build(lighthouse): update generated score data`
  - `fix(header): repair qr modal animation`
  - `docs(content): update article metadata`
