# 📡 Voxa — Real-time Chat App

> A modern, full-stack real-time chat platform with public channels, DMs, and image support — built with **Next.js**, **Prisma**, **UploadThing**, and **Socket.IO**.

---

## ✨ Features

- 🔐 User authentication with NextAuth
- 💬 Real-time messaging via Socket.IO over WebSockets
- 🧵 Public channels, private DMs, and one-on-one chats
- 📁 Image uploads with UploadThing
- 🔄 Typing indicators & online presence
- 🖼️ Media previews in chat
- 🧑‍🤝‍🧑 Built with accessibility and responsiveness in mind

---

## 🧱 Tech Stack

| Layer       | Tech                             |
| ----------- | -------------------------------- |
| Frontend    | Next.js, Tailwind CSS, Shadcn/UI |
| Backend     | Next.js API Routes / Socket.IO   |
| Auth        | NextAuth.js                      |
| Database    | PostgreSQL + Prisma              |
| File Upload | UploadThing                      |
| Realtime    | Socket.IO                        |
| Deployment  | Vercel                           |

---

## 🧪 Getting Started

### 1. Clone the Repo

```bash
git clone https://github.com/CuteNikki/voxa.git
cd voxa
```

### 2. Install Dependencies

```bash
bun install
```

### 3. Setup Environment Variables

Create a `.env` file with the following values:

```env
DATABASE_URL=postgresql://user:password@localhost:5432/voxa
NEXTAUTH_SECRET=your_super_secret
NEXTAUTH_URL=http://localhost:3000

UPLOADTHING_SECRET=your_uploadthing_secret
UPLOADTHING_APP_ID=your_uploadthing_app_id
```

> 🔑 Use [UploadThing.com](https://uploadthing.com) to get your API keys

### 4. Setup Prisma

```bash
bunx prisma db push
bunx prisma studio
```

### 5. Start the Dev Server

```bash
bun dev
```

---

## ⚡ Socket.IO Events

| Event             | Payload                           |
| ----------------- | --------------------------------- |
| `join_chat`       | `{ chatId: string }`              |
| `send_message`    | `{ chatId, content?, imageUrl? }` |
| `receive_message` | `Message`                         |
| `user_typing`     | `{ chatId, userId }`              |

---

## 🧠 Database Schema (Simplified)

```prisma
model User {
  id        String   @id @default(cuid())
  email     String   @unique
  username  String   @unique
  messages  Message[]
  chatUsers ChatUser[]
}

model Chat {
  id        String     @id @default(cuid())
  name      String?
  isGroup   Boolean    @default(false)
  messages  Message[]
  users     ChatUser[]
}

model ChatUser {
  id      String @id @default(cuid())
  userId  String
  chatId  String
  user    User   @relation(fields: [userId], references: [id])
  chat    Chat   @relation(fields: [chatId], references: [id])
  @@unique([userId, chatId])
}

model Message {
  id        String   @id @default(cuid())
  content   String?
  imageUrl  String?
  senderId  String
  chatId    String
  createdAt DateTime @default(now())
  sender    User     @relation(fields: [senderId], references: [id])
  chat      Chat     @relation(fields: [chatId], references: [id])
}
```

---

## 🖼️ UploadThing Setup

- Endpoint: `messageImage`
- Max size: 4MB
- Returns: `imageUrl` for chat messages

Example usage:

```tsx
<UploadButton
  endpoint='messageImage'
  onClientUploadComplete={(res) => {
    sendMessage({ imageUrl: res[0].url });
  }}
/>
```

---

## ✅ Roadmap / TODOs

- [ ] 🧑‍🤝‍🧑 Group chat creation UI & logic
- [ ] 🟢 Online presence using Redis pub/sub
- [ ] 🔔 Message read receipts and notifications
- [ ] 🧩 Emoji picker, markdown support, and reactions
- [ ] 📷 Drag & drop image upload UX

---

## 🚀 Deployment

Deploy the frontend on **Vercel**, and backend on **Fly.io** or **Render**. You can also host your database on **Supabase**, **Railway**, or **Neon**.

---

## 📄 License

MIT — free to use, fork, and make your own 💬

---

## 🦊 Credits

Made by [@CuteNikki](https://github.com/CuteNikki) — built with love, ~~coffee~~ water, and the occasional meme.

---
