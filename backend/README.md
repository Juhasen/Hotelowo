# ☕ Backend – Spring Boot

This directory contains the backend for the hotel booking application, built using **Java**, **Spring Boot**, and **Maven**.

---

## ⚙️ Requirements

* **Java** 17 or newer
* **Maven** 3.8.x or newer
* (Optional) **PostgreSQL** or another relational DBMS

---

## 📦 Installation & Running

### 1. Clone the Repository

```bash
cd backend/
```

### 2. Configure Environment

Edit the file `src/main/resources/application.yml` or use environment variables to set:

* `spring.datasource.url`
* `spring.datasource.username`
* `spring.datasource.password`
* `jwt.secret`

### 3. Build the Application

```bash
mvn clean install
```

### 4. Run the Application

```bash
mvn spring-boot:run
```

Backend will be available at: [http://localhost:8080](http://localhost:8080)

---

## 🗂️ Project Structure

```
backend/
├── src/
│   ├── main/
│   │   ├── java/         # Java source code
│   │   └── resources/    # Config files and templates
├── target/               # Compiled output (after build)
└── pom.xml               # Maven configuration
```

---

## 🔒 Security

* JWT Authentication for secured endpoints
* Role-based access (e.g., user/admin)

---

## 📄 API Overview

| Method | Endpoint        | Description             |
| ------ | --------------- | ----------------------- |
| GET    | `/hotels`       | List all hotels         |
| POST   | `/reservations` | Create a reservation    |
| GET    | `/reservations` | Get user's reservations |
| POST   | `/auth/login`   | Login and get JWT token |
| POST   | `/auth/register` | Register a new user     |

> ⚠️ Note: Secured endpoints require Authorization header with Bearer token.
> 📍 For full interactive documentation, visit the Swagger UI at 
> [Swagger](http://localhost:8080/swagger-ui/index.html#/) after running the application.
---

## 📤 Deployment

Build the executable JAR file:

```bash
mvn package
```

Then deploy `target/backend-*.jar` to your server or containerize it with Docker.

---

## 📚 Technologies Used

* Java 17
* Spring Boot
* Spring Data JPA
* Spring Security
* PostgreSQL
* JWT (JSON Web Tokens)
* Maven

---

## 👨‍💻 Author

* 'Krystian Juszczyk' - [GitHub](https://github.com/Juhasen)