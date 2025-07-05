# 🧾 InvoDrop

InvoDrop is a powerful full-stack invoicing platform built with **React** and **Express.js**, designed to help freelancers, small businesses, and entrepreneurs easily create, send, manage, and track invoices with built-in client management and business analytics.




## 🧰 Quick Setup

### 1. Clone the Repository

```bash
git clone https://github.com/karansinghcodes/InvoDrop.git
cd InvoDrop
```


## ⚙️ Environment Setup

Before running the project, create a `.env` file inside the `backend/` directory.

> 📄 Use the provided `backend/.env.example` file as a reference.

### Example `.env` file:

```env
DATABASE_URL=""
PORT_NUMBER=
JWT_SECRET=
RESEND_API_KEY=
CLOUDINARY_URL=cloudinary://<your_api_key>:<your_api_secret>@my_cloud_name
```

### 2. Install All Dependencies

```bash
npm install
npm run install-all
```

This installs dependencies for both:

- `/backend`
- `/frontend`


## 🚀 Running the Project

### 🧪 Development Mode (with hot reload)

```bash
npm run dev
```

- Runs both backend and frontend with auto-reloading
- Backend runs on: `http://localhost:<PORT_NUMBER from .env>`
- Frontend runs on: `http://localhost:5173`

### 🏗️ Build for Production

```bash
npm run build
```

- Builds backend to `/backend/dist`
- Builds frontend to `/frontend/dist`

### 🔁 Start in Production Mode

```bash
npm start
```

- Backend: `node backend/dist/index.js`
- Frontend: `vite preview` (serves production build)


## 🚀 Features

- ✅ Create and send professional invoices  
- 📥 Automatically email invoices to clients  
- 👥 Manage client information  
- 📊 Track payments and sales history  
- 📈 Get real-time analytics on revenue, unpaid invoices, and customer trends  
- 🔒 Secure login system (JWT-based authentication)  
- 📅 View invoice status: Paid, Unpaid, Overdue  
- 🧠 Smart dashboard with charts & filters  


## 🛠️ Tech Stack

### Frontend (React + Vite)

- React 19
- Vite
- TypeScript
- Tailwind CSS / Shadcn UI
- React Query, Zod, Lucide, Radix UI

### Backend (Node.js + Express)

- Express.js
- TypeScript
- PostgreSQL (via Prisma ORM)
- JWT Authentication
- Resend (for sending emails)
- Cloudinary (for image hosting)


## 📁 Project Structure

```
my-project/
├── backend/       # Express + Prisma + API
├── frontend/      # React + Vite
├── .gitignore
├── package.json   # Root (to run both apps together)
└── README.md
```

## 📜 Root-Level Script Reference

| Script               | Description                                      |
|----------------------|--------------------------------------------------|
| `npm install`        | Installs root dependencies (`concurrently`)      |
| `npm run install-all`| Installs frontend and backend dependencies       |
| `npm run dev`        | Runs both frontend and backend in dev mode       |
| `npm run build`      | Builds both apps                                 |
| `npm start`          | Runs both apps in production                     |


---

> 📝 Licensed under the [MIT License](./LICENSE)
