 <div align="center">

  <img src="public/finora-logo.svg" alt="Finora Logo" width="240" />

  <h3>Manage Money Smarter & Effortlessly</h3>

  <p>A sleek personal finance and budget management application for tracking transactions, visualizing financial insights, managing savings goals, and building better money habits.</p>

  <p>
    <a href="https://react.dev/"><img src="https://img.shields.io/badge/React-19-61DAFB?style=for-the-badge&logo=react&logoColor=black" alt="React" /></a>
    <a href="https://vite.dev/"><img src="https://img.shields.io/badge/Vite-6.x-646CFF?style=for-the-badge&logo=vite&logoColor=white" alt="Vite" /></a>
    <a href="https://tailwindcss.com/"><img src="https://img.shields.io/badge/Tailwind_CSS-3.4-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white" alt="Tailwind CSS" /></a>
    <a href="https://firebase.google.com/"><img src="https://img.shields.io/badge/Firebase-Authentication-FFCA28?style=for-the-badge&logo=firebase&logoColor=black" alt="Firebase" /></a>
    <a href="https://recharts.org/"><img src="https://img.shields.io/badge/Recharts-Charts-22c55e?style=for-the-badge" alt="Recharts" /></a>
  </p>

  <p>
    <a href="https://github.com/saifullahtanim/Finora">Repository</a> •
    <a href="https://github.com/saifullahtanim/Finora/issues">Report a Bug</a> •
    <a href="https://github.com/saifullahtanim/Finora/issues">Request a Feature</a>
  </p>

</div>

---

## ✨ Features

### 🔐 Authentication & Security
- Google and GitHub sign-in using Firebase Authentication.
- Email and password registration and login.
- Email verification for registered users.
- Password strength indicator.
- Password reset through email.
- Demo mode for exploring the application, if enabled.

### 💳 Account & Transaction Management
- Manage multiple account types, including cash, checking, savings, credit cards, investments, and crypto wallets.
- Track income, expenses, and account balances.
- View transaction history.
- Transfer funds between accounts, if enabled.

### 📊 Financial Analytics
- Visualize income and expenses using interactive charts.
- Explore spending by category.
- Review historical spending trends.
- Calculate daily spending allowances based on your budget settings.

### 🎯 Savings Goals & Subscriptions
- Create savings goals and monitor progress.
- Track recurring subscriptions and bills.
- View progress toward financial milestones.

### 🎨 Modern User Interface
- Responsive dashboard for desktop, tablet, and mobile.
- Dark mode and light mode.
- Modern glassmorphism-inspired design.
- Interactive charts and smooth UI animations.

### 🌍 Multi-Currency & Data Management
- Currency options for BDT (৳), USD ($), EUR (€), GBP (£), INR (₹), CAD ($), AUD ($), and JPY (¥), if configured.
- Export transaction data to CSV.
- Back up and restore supported application data using JSON.

---

## 🛠️ Tech Stack

| Layer | Technologies |
|---|---|
| Frontend | React, JavaScript (ES6+) |
| Build Tool | Vite |
| Styling | Tailwind CSS, Custom CSS |
| Authentication | Firebase Authentication |
| Database | Cloud Firestore, if configured |
| Data Visualization | Recharts |
| Icons | Lucide Icons |
| Animations | Canvas Confetti, Lottie Web, if configured |
| Date Utilities | date-fns, if configured |

---

## 🚀 Getting Started

Follow these instructions to run Finora locally.

### 1. Clone the repository

```bash
git clone https://github.com/saifullahtanim/Finora.git
cd Finora
```

### 2. Install dependencies

```bash
npm install
```

### 3. Configure Firebase

Create a `.env.local` file in the project root and add your Firebase configuration:

```env
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_storage_bucket
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
```

Replace the placeholder values with the configuration from your Firebase project.

**Firebase setup:**
1. Create a project in the [Firebase Console](https://console.firebase.google.com/).
2. Register your web application.
3. Enable the sign-in providers you want to use under Authentication.
4. Add your local development domain to Authorized domains if required.
5. Configure the appropriate Firebase services for the features used by your application.

> Never commit private service-account credentials or secret keys to GitHub. Client-side Firebase configuration is not a substitute for properly configured Firebase Security Rules.

### 4. Start the development server

```bash
npm run dev
```

Open the local URL displayed in your terminal. For a standard Vite setup, this is usually:

http://localhost:5173/

---

## 📦 Production Build

Build the application:

```bash
npm run build
```

Preview the production build locally:

```bash
npm run preview
```

---

## 🔑 Environment Variables

The following variables are used in the example Firebase configuration. Confirm that their names match the variables referenced by your source code.

| Variable | Purpose |
|---|---|
| `VITE_FIREBASE_API_KEY` | Firebase web API key |
| `VITE_FIREBASE_AUTH_DOMAIN` | Firebase Authentication domain |
| `VITE_FIREBASE_PROJECT_ID` | Firebase project identifier |
| `VITE_FIREBASE_STORAGE_BUCKET` | Firebase Storage bucket |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender ID |
| `VITE_FIREBASE_APP_ID` | Firebase application identifier |

Do not upload your `.env.local` file. Add it to `.gitignore` if it is not already excluded.

---

## 📁 Project Structure

A simplified example of the project structure:

```text
Finora/
├── public/
│   └── finora-logo.svg
├── src/
│   ├── assets/
│   ├── components/
│   ├── pages/
│   ├── services/
│   ├── App.jsx
│   └── main.jsx
├── .env.example
├── .gitignore
├── package.json
├── index.html
└── README.md
```

The actual structure may differ depending on your implementation.

---

## 🔒 Authentication Providers

Finora can use Firebase Authentication to support:

- Google sign-in
- GitHub sign-in
- Email and password authentication
- Email verification
- Password reset

These features require the corresponding providers, email templates, authorized domains, and authentication settings to be configured in Firebase.

---

## 🤝 Contributing

Contributions, suggestions, and bug reports are welcome.

1. Fork the repository.
2. Create a feature branch.
3. Commit your changes.
4. Push your branch.
5. Open a pull request.

For bugs and feature requests, visit the [GitHub Issues](https://github.com/saifullahtanim/Finora/issues) page.

---

## 📄 License

No license has been specified yet. Add a `LICENSE` file if you intend to distribute this project under an open-source license.

---

<div align="center">

  **Finora — Manage Money Smarter & Effortlessly**

  Built with ❤️ for smarter personal financial management.

  <sub>Developed by <a href="https://github.com/saifullahtanim">Saifulla Tanim</a></sub>

</div>
