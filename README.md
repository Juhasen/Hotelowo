# 🏨 Hotel Application – Fullstack

This repository contains a full-stack hotel booking application with two main parts:

* **🚀 Backend**: Java, Spring Boot, Maven
* **🌐 Frontend**: Next.js, React, TypeScript, Material UI, next-i18next

---

## ⚙️ Requirements

* **Node.js** >= 18.x
* **npm** >= 9.x
* **Java** 17 or newer
* **Maven** 3.8.x or newer

---

## 📦 Installation

### 📁 Backend

1. Navigate to the `backend/` directory:

   ```bash
   cd backend/
   ```
2. Build the project:

   ```bash
   mvn clean install
   ```
3. Configure environment variables in `application.yml` or via system env (e.g., database URL, credentials).
4. Run the application:

   ```bash
   mvn spring-boot:run
   ```

The backend will start on `http://localhost:8080`.

### 📁 Frontend

1. Navigate to the `frontend/` directory:

   ```bash
   cd frontend/
   ```
2. Install dependencies:

   ```bash
   npm install
   ```
3. Create `.env.local` based on `.env.example` and set API base URL (e.g., `NEXT_PUBLIC_API_URL=http://localhost:8080`).
4. Run in development mode:

   ```bash
   npm run dev
   ```

The frontend will be available at `http://localhost:3000`.

---

## 🔧 Features

* **Hotel Search**: Filter by country, date range, guest count
* **Responsive UI**: Mobile-first design with Material UI
* **Internationalization**: Multi-language support using next-i18next
* **Secure API**: JWT-based authentication for admin routes
* **Reservation Management**: Create, view, cancel bookings

---

## 👥 Authors

* `Krystian Juszczyk` - [GitHub](https://github.com/Juhasen)