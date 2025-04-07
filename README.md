# CodersBlog

A full-stack blog application built with **Django (backend)** and **React.js (frontend)**. It allows users to register, login, view blog posts, and perform CRUD operations with proper authentication.

---

## Live URLs

- **Frontend**: [https://coders-blog-iota.vercel.app/](https://coders-blog-iota.vercel.app/)
- **Backend API**: [https://coders-blog-backend.onrender.com/api](https://your-backend.onrender.com/api)

---

## Project Structure

```
CodersBlog/
├── backend/  # Django project: blogapi/
└── frontend/  # React app
```

---

## Technologies Used

- **Backend**: Python, Django REST Framework, SQLite/PostgreSQL
- **Frontend**: React.js, Axios, Formik, Yup, React Router
- **Deployment**: Render

---

## Local Setup Instructions

### Prerequisites

- Python ≥ 3.8
- Node.js & npm
- Git

---

### Backend Setup (Django)

1. Navigate to the backend folder

   ```bash
   cd backend
   ```

2. Create and activate a virtual environment

   ```bash
   python -m venv venv
   source venv/bin/activate       # Windows: venv\Scripts\activate
   ```

3. Install backend dependencies

   ```bash
   pip install -r requirements.txt
   ```

4. Create a `.env` file

   Create a `.env` file in the backend directory with the following content:

   ```
   SECRET_KEY=your_django_secret_key
   DEBUG=True
   ALLOWED_HOSTS=127.0.0.1,localhost
   ```

5. Run migrations

   ```bash
   python manage.py migrate
   ```

6. Start the Django development server

   ```bash
   python manage.py runserver
   ```

   The backend will be available at `http://localhost:8000/`.

---

### Frontend Setup (React)

1. Navigate to the frontend folder

   ```bash
   cd ../frontend
   ```

2. Install frontend dependencies

   ```bash
   npm install
   ```

3. Create a `.env` file

   In the frontend directory, create a `.env` file:

   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

   Update this value to your backend’s Render URL when deploying.

4. Start the React app

   ```bash
   npm start
   ```

   The frontend will be available at `http://localhost:3000/`.

---

## Deployment Guide

### Deploy Backend on Render

1. Create a Web Service on Render.
2. Connect your GitHub repo.
3. Set the Root Directory: `backend`
4. Set the Build Command:

   ```bash
   pip install -r requirements.txt
   ```

5. Set the Start Command:

   ```bash
   gunicorn blogapi.wsgi:application
   ```

6. Add Environment Variables (SECRET_KEY, DEBUG, etc.).
7. Optionally, add `render.yaml` for better configuration.

### Deploy Frontend on Render or Vercel

**If using Render (Static Site)**

1. Create a Static Site.
2. Set the Root Directory: `frontend`.
3. Set the Build Command:

   ```bash
   npm install && npm run build
   ```

4. Set the Publish Directory: `build`.
5. In `.env`, update:

   ```
   REACT_APP_API_URL=https://your-backend.onrender.com/api
   ```

**If using Vercel**

1. Link your repo.
2. Select `frontend/` as the project root.
3. Add environment variables in the Vercel dashboard.
4. Set Build Command: `npm run build`.
5. Set Output Directory: `build`.

---

## API Endpoints

- `POST /api/token/` – Login
- `POST /api/register/` – Register
- `GET /api/posts/` – List all posts
- `POST /api/posts/` – Create a post (authentication required)
- `PUT /api/posts/:id/` – Update a post (authentication required)
- `DELETE /api/posts/:id/` – Delete a post (authentication required)
