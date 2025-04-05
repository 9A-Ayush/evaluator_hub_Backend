
# 🛠️ Evaluator's Hub - Backend

This is the backend for **Evaluator's Hub**, a full-stack web app designed to handle evaluations and asset assessments (vehicles, jewelry, metals, and property). Built with **Node.js**, **Express**, and **MongoDB**. 🔥

## 🚀 Live API
👉 https://evaluator-hub-backend.onrender.com

---

## 📁 Project Structure

```
.
├── controllers          # Logic for handling requests
│   ├── assetController.js
│   ├── evaluationController.js
│   ├── reportController.js
│   └── userController.js
│
├── middleware           # Auth & admin verification
│   ├── admin.js
│   ├── auth.js
│   └── authMiddleware.js
│
├── models               # Mongoose schemas
│   ├── Report.js
│   ├── assetModel.js
│   ├── evaluationModel.js
│   ├── reportModel.js
│   └── userModel.js
│
├── routes               # API endpoints
│   ├── assetRoutes.js
│   ├── authRoutes.js
│   ├── evaluationRoutes.js
│   ├── reportRoutes.js
│   └── userRoutes.js
│
├── server.js            # Main server file
├── .gitignore
├── package.json
└── package-lock.json
```

---

## ⚙️ Setup Instructions

1. **Clone the repo**
   ```bash
   git clone https://github.com/9A-Ayush/evaluator-hub-backend.git
   cd evaluator-hub-backend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Create `.env` file**
   ```
   MONGODB_URI=your_mongo_connection_string
   ```

4. **Run the server**
   ```bash
   node server.js
   ```
   or for development:
   ```bash
   nodemon server.js
   ```

---

## 🔐 Features

- 🧑 User authentication (JWT based)
- ✍️ User registration & login
- 📊 Evaluation management
- 🏎️ Asset management (vehicles, jewelry, property, metals)
- 📃 Report generation
- 🛡️ Role-based authorization

---

## 🌐 Frontend Repo

👉 [Frontend GitHub Repo](https://github.com/9A-Ayush/evaluator_hub-frnt.git)  
👉 [Live Frontend](https://evaluator-hub-frnt-git-main-ayushs-projects-aa6e7693.vercel.app/)

---

## 🧑‍💻 Developer

**Ayush IX XI**  
📧 [weyayush@gmail.com](mailto:weyayush@gmail.com)  
📸 [Instagram](https://www.instagram.com/ayush_ix_xi/?next=%2F)  
🐙 [GitHub](https://github.com/9A-Ayush)

---

## 📄 License

This project is licensed under the [MIT License](LICENSE).

---

> Made with 💖 by Ayush
