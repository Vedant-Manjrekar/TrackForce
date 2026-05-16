# Field Operations Task and Visit Management System

A full-stack system built with Django REST Framework and React for managing field operations, tasks, and visits with Role-Based Access Control (RBAC) and Mock AI insights.

## Tech Stack
- **Backend:** Django, Django REST Framework, SimpleJWT (Auth)
- **Frontend:** React, Vite, Axios, Lucide React
- **Database:** SQLite (default)

## Features
- **RBAC (Role Based Access Control):** 5 Roles (Admin, Regional Manager, Team Lead, Field Agent, Auditor).
- **Scoped Visibility:**
  - Regional Managers see data only in their region.
  - Team Leads see data only for their team.
  - Field Agents see only their assigned tasks/visits.
- **Task Management:** Create, Assign, Update status.
- **Visit Tracking:** Start/Complete visits with notes.
- **Mock AI Service:** Automatically generates summaries, recommendations, and risk flags from visit notes.
- **Activity Logging:** Tracks all major actions.
- **Dashboard & Reporting:** Scoped metrics and SQL-based reports.

## Setup Instructions

### Backend
1. Navigate to the `backend` directory.
2. Create and activate a virtual environment:
   ```bash
   python -m venv venv
   source venv/bin/activate  # On Windows: venv\Scripts\activate
   ```
3. Install dependencies:
   ```bash
   pip install -r requirements.txt
   ```
   *(Note: Requirements are already installed in the provided environment)*
4. Run migrations:
   ```bash
   python manage.py migrate
   ```
5. Seed initial data (Roles, Regions, Teams, Users, Tasks):
   ```bash
   python seed_data.py
   ```
6. Start the server:
   ```bash
   python manage.py runserver
   ```

### Frontend
1. Navigate to the `frontend` directory.
2. Install dependencies:
   ```bash
   npm install
   ```
3. Start the development server:
   ```bash
   npm run dev
   ```
4. Access the app at `http://localhost:3000`.

## Demo Accounts
All accounts use the password: `password123`
- `admin` (Full access)
- `rm_north` (Regional Manager - North)
- `tl_alpha` (Team Lead - North/Alpha)
- `agent_1` (Field Agent - North/Alpha)
- `auditor` (Read-only access)

## API Documentation
Once the backend is running, visit:
- Swagger UI: `http://localhost:8000/api/docs/`
- Redoc: `http://localhost:8000/api/schema/`
