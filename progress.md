# Task Summary
Backend optimizations and configuration fixes.

# Completed Items
- **Entry Point Fixed**: Updated `package.json`'s start and dev scripts to correctly execute `"node server.js"` and `"nodemon server.js"` instead of the non-existent `index.js`.

# Pending Items
- **CORS Hardening**: The current backend implements an open CORS policy (`app.use(cors())`). It needs to be restricted accurately to `"https://bhutanhillsdaynightteer.in"`, configurable by `dotenv`.
- **API Security / Route Protection**: Protect sensitive data mutation routes like `POST /games`, `PUT /games`, and `DELETE /games` using the existing `authMiddleware` functionality so arbitrary public clients can't submit game records.
- Real-time event handling implementations if `socket.io` is strictly required.

# Known Blockers
- None at this time.
