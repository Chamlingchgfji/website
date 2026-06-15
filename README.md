# NeonForge — Premium Gaming Top-up Marketplace

NeonForge is a premium dark, neon-glass e-commerce/top-up website with:
- Responsive UI (HTML/CSS)
- Animated hero + GSAP scroll effects
- Product showcase
- Mobile navigation
- Real Login / Signup / Logout (Express + sessions)
- Contact page (saves messages when DB is available)

## Project Structure
```
public/
  index.html
  login.html
  signup.html
  contact.html
  css/style.css
  css/animations.css
  js/auth.js
  js/contact.js
routes/
  auth.js
  contact.js
server.js
package.json
server/db.js
```

## Requirements
- Node.js (v18+)

## Install dependencies
From the project root:
```bash
npm install
```

> Note (Windows DB): This project uses `sqlite3` for persistence. If your environment cannot build native sqlite binaries, the UI will still work, but auth/contact routes will degrade gracefully.

## Run the server
```bash
npm start
```

Server runs at:
- http://localhost:3000/
- http://localhost:3000/login
- http://localhost:3000/signup
- http://localhost:3000/contact

## Testing (quick)
1. Sign up a new account
2. Log in and verify you can access authenticated actions (UI hooks)
3. Log out
4. Send a message from Contact


