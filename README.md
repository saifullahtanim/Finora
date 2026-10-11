<div align="center">

  <img src="public/finora-logo.svg" alt="Finora Logo" width="240" />

  <h3>Manage Money Smarter & Effortlessly</h3>

  <p>A sleek, state-of-the-art personal wealth & budget management web application built for seamless tracking, real-time visual analytics, and bank-grade privacy.</p>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React 19" /></a>
    <a href="https://vitejs.dev/"><img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-v13-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" /></a>
    <a href="https://recharts.org/"><img src="https://img.shields.io/badge/Recharts-3.x-22c55e?style=for-the-badge&logo=chartdotjs&logoColor=white" alt="Recharts" /></a>
  </p>

</div>

---

## ✨ Features

- **🔐 Modern Firebase Authentication**
  - Instant One-Click Login with **Google** & **GitHub**.
  - Secure Email/Password registration with **Email Verification Gatekeeper**.
  - Real-time **4-Level Capsule Password Strength Meter** (Weak 🔴 ➔ Fair 🟠 ➔ Good 🟡 ➔ Strong 🟢).
  - One-click instant **Demo Mode** for quick exploration.

- **💳 Multi-Account & Card Carousel**
  - Manage Cash, Checking, Credit Cards, Savings, Investments, and Crypto wallets.
  - Interactive credit card carousel with live balances and credit limit monitoring.
  - Inter-account instant fund transfers with synchronized transaction logs.

- **📊 Visual Financial Analytics**
  - Dynamic Cash Flow area graphs (Income vs. Expense) powered by **Recharts**.
  - Category breakdown donut charts & 6-month historical spending bars.
  - **Spending Velocity Engine**: Live daily spending allowance calculations.

- **🎯 Savings Goals & Subscriptions**
  - Set milestone targets with progress bars and celebratory confetti animations 🎉.
  - Track recurring subscriptions (Netflix, Spotify, Utilities) with 1-click bill settlement.

- **🎨 Aesthetic UI & Multi-Currency**
  - Polished dark mode & light mode with glassmorphism styling.
  - Global currency switcher (**BDT ৳**, **USD $**, **EUR €**, **GBP £**, **INR ₹**, **CAD $**, **AUD $**, **JPY ¥**).
  - Complete JSON backup/restore & CSV transaction exports.

---

## 🛠️ Tech Stack

| Layer | Technologies |
| :--- | :--- |
| **Frontend** | React 19, JavaScript (ES6+), Vite 8 |
| **Styling** | Tailwind CSS 3.4, Custom Glassmorphism UI, Lucide Icons |
| **Backend & Auth** | Firebase 13 (Auth, Firestore DB, Google & GitHub OAuth) |
| **Data Viz & UX** | Recharts, Canvas Confetti, Date-fns, Lottie Web |

---

## 🚀 Quick Start

### 1. Clone the repository
```bash
git clone https://github.com/your-username/budget.git
cd budget
```

### 2. Install dependencies
```bash
npm install
```

### 3. Setup Firebase Environment Variables
Create a `.env.local` file in the project root (reference [.env.example](.env.example)):

```env
VITE_FIREBASE_API_KEY=your_api_key_here
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.firebasestorage.app
VITE_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

### 4. Run Development Server
```bash
npm run dev
```

Open your browser at `http://localhost:5173/` to explore Finora!

---

## 📦 Build for Production

```bash
npm run build
npm run preview
```

---

<div align="center">
  <sub>Built with ❤️ for smarter personal financial management.</sub>
</div>
