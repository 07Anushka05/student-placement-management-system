<div align="center">

# 🎓 Student Placement Management System

A full-stack placement portal where students can browse job and internship opportunities, search and filter listings, apply with validated forms, and track their application status — all the way from Applied to Selected.

![HTML5](https://img.shields.io/badge/HTML5-E34F26?style=flat&logo=html5&logoColor=white)
![CSS3](https://img.shields.io/badge/CSS3-1572B6?style=flat&logo=css3&logoColor=white)
![JavaScript](https://img.shields.io/badge/JavaScript-F7DF1E?style=flat&logo=javascript&logoColor=black)
![Java](https://img.shields.io/badge/Java%2017-ED8B00?style=flat&logo=openjdk&logoColor=white)
![Spring Boot](https://img.shields.io/badge/Spring%20Boot%203.3-6DB33F?style=flat&logo=springboot&logoColor=white)
![MySQL](https://img.shields.io/badge/MySQL-4479A1?style=flat&logo=mysql&logoColor=white)

</div>

---

## 📌 About the Project

This is a beginner-friendly but genuinely full-stack placement portal, built to demonstrate frontend, backend, and database skills together in one working application.

It's designed to be demonstrable in **two ways**:
- **Full stack** — connected to a real Spring Boot + MySQL backend
- **Demo Mode** — the frontend automatically falls back to realistic sample data in `localStorage` if the backend isn't running, so the whole app still works standalone

## ✨ Features

- 📊 Dashboard with personalized welcome message and live placement statistics
- 📱 Responsive sidebar navigation — Dashboard, Find Jobs, My Applications, Profile, Add Job
- 🔍 Search jobs by title, company, skill, or location
- 🧰 Filter jobs by type, location, and skill
- 📄 Full job details in a modal
- ✅ Apply with client-side validation for contact details, resume URL, and cover letter
- 🚫 Duplicate-application prevention for the same job
- 📈 Track applications with status filters and withdraw actions
- 👤 Editable, persisted student profile
- ➕ Add new job listings
- 🔐 Registration and login for multiple students
- 🟢 Demo Mode fallback when the API or database is unavailable
- 🗄️ SQL schema and sample data, ready to explain in interviews

## 🛠️ Technologies Used

| Layer | Stack |
|---|---|
| Frontend | HTML5, CSS3, Vanilla JavaScript |
| Backend | Java 17, Spring Boot 3.3, Spring Data JPA / Hibernate |
| Database | MySQL |

## 📸 Screenshots

<div align="center">

| Dashboard | Find Jobs |
|---|---|
| ![Dashboard](screenshots/dashboard.png) | ![Find Jobs](screenshots/find-jobs.png) |

| Apply Modal | My Applications |
|---|---|
| ![Apply Modal](screenshots/apply-modal.png) | ![My Applications](screenshots/my-applications.png) |

</div>

> Screenshots above will render automatically once you add matching images to the `screenshots/` folder — see [Adding Screenshots](#-adding-screenshots) below.

## 📁 Project Structure

```text
student-placement-management-system/
├── frontend/
│   ├── index.html
│   ├── style.css
│   └── script.js
├── backend/
│   ├── pom.xml
│   └── src/main/
│       ├── java/com/placement/
│       │   ├── PlacementApplication.java
│       │   ├── config/CorsConfig.java
│       │   ├── controller/
│       │   ├── model/
│       │   └── repository/
│       └── resources/application.properties
├── database/
│   ├── schema.sql
│   └── sample-data.sql
├── screenshots/
└── README.md
```

## 🏗️ Architecture

```text
HTML/CSS/JavaScript frontend
          │
          │  REST API requests
          ▼
Spring Boot controllers and repositories
          │
          ▼
MySQL database via Spring Data JPA
```

When the API is unavailable, the frontend automatically loads sample jobs, applications, and profile data. Changes made in Demo Mode are stored in browser `localStorage`, and a small **Demo Mode** badge explains why the backend isn't being used.

## 🗄️ Database Design

- `students` — student profile and account information
- `jobs` — job and internship opportunities
- `applications` — submissions, referencing both `students` and `jobs` via foreign keys
- Each student has an account email/password; every application stores its `student_id`
- `database/schema.sql` — table creation plus example `SELECT`, `UPDATE`, `DELETE`, and `JOIN` queries
- `database/sample-data.sql` — seeds one student, twelve jobs, and five applications

## 🔌 API Endpoints

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/api/jobs` | List available jobs |
| GET | `/api/jobs/{id}` | Get one job |
| POST | `/api/jobs` | Add a job |
| GET | `/api/applications` | List applications |
| POST | `/api/applications` | Submit an application |
| PUT | `/api/applications/{id}` | Update application status |
| DELETE | `/api/applications/{id}` | Withdraw an application |
| POST | `/api/auth/register` | Create a student account |
| POST | `/api/auth/login` | Log in with email and password |
| GET | `/api/students/{id}` | Get a student profile |
| PUT | `/api/students/{id}` | Update a student profile |

## 🚀 How to Run

### Prerequisites

- Java 17 or later
- Maven 3.9 or later
- MySQL 8 or later

### 1. Create the database

```sql
SOURCE path/to/student-placement-management-system/database/schema.sql;
SOURCE path/to/student-placement-management-system/database/sample-data.sql;
```

The schema creates the `placement_db` database automatically.

### 2. Configure database credentials

Open `backend/src/main/resources/application.properties` and update if needed:

```properties
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
```

Or set them as environment variables before starting the backend:

```powershell
$env:DB_USERNAME = 'root'
$env:DB_PASSWORD = 'your-mysql-password'
```

### 3. Start the backend

```bash
cd backend
mvn spring-boot:run
```

API runs at `http://localhost:8080`. Seeded demo account: `anushka@example.com` / `anushka123`.

### 4. Open the frontend

```bash
cd frontend
python -m http.server 5500
```

Then open `http://localhost:5500`.

### ⚡ Demo Mode (no backend required)

Just open `frontend/index.html` directly, or serve it with Live Server. If `http://localhost:8080` isn't reachable, the app automatically switches to sample data and `localStorage` — no setup needed.

## 📷 Adding Screenshots

<img width="981" height="915" alt="image" src="https://github.com/user-attachments/assets/82650132-6013-4cfc-ad38-15a0fded75df" />

<img width="1917" height="830" alt="image" src="https://github.com/user-attachments/assets/2fb21d59-f38c-4a06-b65d-503fb856e92a" />

<img width="1112" height="751" alt="image" src="https://github.com/user-attachments/assets/3b760dea-930f-431c-a583-302060bb54dc" />

<img width="1891" height="802" alt="image" src="https://github.com/user-attachments/assets/96a0cff9-6b44-4b77-9429-042d919525a4" />


## 🔮 Future Improvements

- Role-based access control
- Resume file upload
- Email notifications
- Admin dashboard
- Interview scheduling
- Pagination and richer job recommendations

---

<div align="center">
Built as a full-stack portfolio project.
</div>
