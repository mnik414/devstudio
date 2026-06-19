# Task 17-a — Admin Panel Persian Localization

**Agent**: full-stack-developer (admin Persian)
**File modified**: `src/components/views/admin-view.tsx` (single file, +119/-111 lines)

## Summary
Converted the entire admin panel UI chrome to Persian using the existing i18n system (`useT()` from `@/lib/lang-store` + `admin.*` keys in `src/lib/i18n.ts`). The admin is now permanently Persian/RTL regardless of the public-site language toggle.

## Key changes

### Infra
- Added `import { useT } from '@/lib/lang-store'`
- Added `type TFunc` and helper `resourceLabel(t, model)` → `t(`admin.r.${model}`)`
- `formatDate()` now uses `fa-IR` locale for Persian timestamps
- `useAdminFetch(model, token, t)` and `useAdminMutations(model, token, t)` accept `t` so toast/error messages can be translated

### Components translated (all got `const t = useT()`)
- **LoginCard** — title, description, label, button, toasts; `dir="rtl"` on root
- **RecordTable** — heading, search placeholder (icon/padding swapped for RTL), refresh/new buttons, table headers, action titles, empty state
- **EditDialog** — title (`Edit/New + resource label`), Persian descriptions, Cancel/Save Changes/Create buttons; `dir="rtl"` on DialogContent
- **ViewDialog** — title (`Details + resource label`), "Submitted on", Close button; `dir="rtl"`
- **DeleteDialog** — title (`Delete + resource label`), confirmation text, Cancel/Delete buttons; `dir="rtl"`
- **DashboardOverview** — welcome header, "Refresh stats", "Platform Snapshot"→`admin.overview`, "QUICK ACTIONS", "RECENT ACTIVITY", "See all", all stat-card labels (using `admin.r.*`), quick-action labels (`New + resource label`), ActivityColumn titles/empty labels; `dir="rtl"` on root
- **Dashboard** — top bar ("Admin Panel", "Authenticated", "Back to site", "Logout"), sidebar ("Overview", "Resources", "Dashboard" button, resource labels, "RO"→`admin.readonly`); `dir="rtl"` on root

### RTL layout swaps
- Sidebar: `left-0`→`right-0`, `-translate-x-full`→`translate-x-full`, `border-r`→`border-l`
- Search icon: `left-2.5`→`right-2.5`, `pl-8`→`pr-8`
- Action column: `text-right`→`text-left`, `justify-end`→`justify-start`
- Decorative orbs in welcome header: `-right-`→`-left-`
- Arrows: `ArrowLeft` (LTR "back") → `ArrowRight` (RTL "back") for back buttons; `ArrowRight` → `ArrowLeft` for forward/"see all" buttons
- `ml-auto` → `mr-auto` on sidebar RO badge

### Inline Persian strings (no i18n key available)
- EditDialog descriptions: "برای ذخیرهٔ تغییرات، فیلدها را ویرایش کنید." / "برای ایجاد رکورد جدید، فیلدها را پر کنید."
- ActivityColumn subtitle: "آخرین ۵ مورد"

### Left in English (per task spec)
- Form field labels in `MODEL_CONFIGS.formFields` (dynamic, admins understand them)
- Brand text "DevStudio CMS"
- Status badges (`New`, `Read`, `Replied`, `Contacted`, `Won`, `Lost`) — no i18n keys provided

## Verification
- `bun run lint` — clean, no errors
- `bunx tsc --noEmit` — no new errors introduced (only pre-existing errors in `i18n.ts` duplicate keys and `MODEL_CONFIGS.listColumns` boolean property remain, both unrelated to this task)
- `dev.log` shows successful `/api/admin?model=...` 200 responses after edits

## Call sites updated to pass `t`
- `RecordTable`: `useAdminFetch(model, token, t)`
- `EditDialog`: `useAdminMutations(model, token, t)`
- `DeleteDialog`: `useAdminMutations(model, token, t)`
