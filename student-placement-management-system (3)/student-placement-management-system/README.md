# Student Placement Management System

A beginner-friendly full-stack placement portal where students can browse opportunities, search and filter jobs, submit applications, track application status, and maintain a profile.

The project is designed to be demonstrable in two ways: with the Spring Boot and MySQL backend connected, or in frontend Demo Mode using realistic localStorage data.

## Features

- Dashboard with personalized welcome message and live placement statistics
- Responsive sidebar navigation for Dashboard, Find Jobs, My Applications, Profile, and Add Job
- Search jobs by title, company, skill, or location
- Filter jobs by type, location, and skill
- View full job details in a modal
- Apply with client-side validation for contact details, resume URL, and cover letter
- Prevent duplicate applications for the same job
- Track applications with status filters and withdraw actions
- Edit and persist the student profile
- Add new jobs
- Registration and login for multiple students
- Student-specific profiles and application history
- Demo Mode fallback when the API or database is unavailable
- SQL schema and sample data for interviews and local database setup

## Technologies Used

- HTML5
- CSS3
- Vanilla JavaScript
- Java 17
- Spring Boot 3.3
- Spring Data JPA / Hibernate
- MySQL
- SQL

## Project Structure

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
└── README.md
```

## Project Architecture

```text
HTML/CSS/JavaScript frontend
          |
          | REST API requests
          v
Spring Boot controllers and repositories
          |
          v
MySQL database through Spring Data JPA
```

When the API is unavailable, the frontend automatically loads sample jobs, applications, and profile data. Changes made in Demo Mode are stored in browser localStorage, and the small `Demo Mode` label explains why the backend is not being used.

## Database Design

- `students` stores student profile information.
- `jobs` stores job and internship opportunities.
- `applications` stores submissions and references both `students` and `jobs` with foreign keys.
- Each student has an account email and password, and every application stores its `student_id`.
- The logged-in student's ID is used to show only that student's profile and applications.
- `database/schema.sql` includes table creation plus example SELECT, UPDATE, DELETE, and JOIN queries.
- `database/sample-data.sql` inserts an example student, twelve jobs, and five applications.

## API Endpoints

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

## How to Run With MySQL and Spring Boot

### Prerequisites

Install:

- Java 17 or later
- Maven 3.9 or later
- MySQL 8 or later

### 1. Create the database

Open MySQL and run:

```sql
SOURCE path/to/student-placement-management-system/database/schema.sql;
SOURCE path/to/student-placement-management-system/database/sample-data.sql;
```

The schema creates the `placement_db` database automatically.

### 2. Configure database credentials

Open `backend/src/main/resources/application.properties` and update these values if your MySQL setup is different:

```properties
spring.datasource.username=${DB_USERNAME:root}
spring.datasource.password=${DB_PASSWORD:root}
```

You can also set the credentials in PowerShell before starting the backend:

```powershell
$env:DB_USERNAME = 'root'
$env:DB_PASSWORD = 'your-mysql-password'
```

### 3. Start the backend

From the `backend` directory:

```bash
mvn spring-boot:run
```

The API starts at `http://localhost:8080`.

The seeded demo account is `anushka@example.com` with password `anushka123`. New users can also register from the frontend.

### 4. Open the frontend

Open `frontend/index.html` in a browser. For the most reliable local browser behavior, use VS Code Live Server or another simple static file server.

Example with Python:

```bash
cd frontend
python -m http.server 5500
```

Then open `http://localhost:5500`.

## Run in Demo Mode

The frontend does not require MySQL or Spring Boot to demonstrate the main features. Open `frontend/index.html` directly, or serve the `frontend` folder with Live Server. If `http://localhost:8080` is unavailable, the app automatically uses its sample data and localStorage fallback.

## Screenshots

Add project screenshots here after capturing the dashboard, Find Jobs page, and application modal.

```text
![Dashboard](screenshots/dashboard.png)
![Find Jobs](screenshots/find-jobs.png)
```

## Future Improvements

- Authentication and role-based access
- Resume file upload
- Email notifications
- Admin dashboard
- Interview scheduling
- Pagination and richer job recommendations

## GitHub Upload

```bash
git init
git add .
git commit -m "Build student placement management system"
git branch -M main
git remote add origin https://github.com/YOUR-USERNAME/student-placement-management-system.git
git push -u origin main
```
