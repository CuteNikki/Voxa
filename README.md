# 📡 Voxa — Realtime Chat App

> A sleek, serverless, full-stack real-time chat app with public channels, DMs, and media support — powered by **Next.js**, **Convex**, and **UploadThing**.

---

## ✨ Features

- 🔐 Auth with NextAuth.js (OAuth, email, etc.)
- 💬 Real-time chat with reactive Convex queries
- 📁 Image uploads via UploadThing
- 🧵 Public channels, private DMs, and one-on-one threads
- ✍️ Typing indicators and presence tracking
- 🖼️ Inline image/media previews
- ⚡ Serverless & scalable — deploy to Vercel in minutes
- 💖 Designed for accessibility, responsiveness, and minimal latency

---

## 🧱 Tech Stack

| Layer       | Tech                                          |
| ----------- | --------------------------------------------- |
| Frontend    | Next.js (App Router), Tailwind CSS, Shadcn/UI |
| Backend     | Convex functions & database                   |
| Auth        | NextAuth.js                                   |
| File Upload | UploadThing                                   |
| Realtime    | Convex Live Queries                           |
| Deployment  | Vercel (Frontend + Convex CLI)                |

---

## 📁 Image Upload with UploadThing

- 📎 Endpoint: `messageImage`
- 📐 Max size: 4MB
- 🖼️ Returns: `imageUrl` to be stored in messages
- ✅ Works perfectly with Convex + Next.js

---

## ✅ Roadmap

- [ ] Public & private chat logic
- [ ] Real-time messaging with Convex
- [ ] Typing indicator + ephemeral state
- [ ] Read receipts
- [ ] Markdown & emoji support
- [ ] Drag-and-drop upload UX
- [ ] User presence view (online/offline)

---

## 🚀 Deployment

- Frontend: [Vercel](https://vercel.com)
- Backend: [Convex](https://dashboard.convex.dev)
- Image hosting: [UploadThing](https://uploadthing.com)

All serverless. No backend infra to maintain.

---

## 🧃 About

**Voxa** is a personal project built for learning, experimenting, and chatting with style. Real-time communication meets simplicity.

Made by [@CuteNikki](https://github.com/CuteNikki) — with love, focus, and a sprinkle of chaos.

---

## 📄 License

MIT — free to use, fork, and build upon 💬
