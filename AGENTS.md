# Browser testing

- Always use Codex's isolated in-app browser (`iab`) for this project's browser tests. Do not use or interact with the user's personal Chrome or other browser sessions.
- Use the test environment configured in `.env.local`. The test account credentials are `USERNAME` and `PASSWORD`; load them directly into the browser automation runtime without printing them, copying them into source files, or committing them.
- Start the local app with `npm run dev` when needed. Use `APP_BASE_URL` from `.env.local` (currently `https://app.savory.test:8080`) and its normal Auth0 login flow with the test credentials. This login was verified in the in-app browser.
- Use temporary test bookmarks and tags for mutations; preserve existing data and clean up only test data created by the current task.
- Run `npm run typecheck` and `npm run lint` for code changes, plus focused tests for the behavior changed.
