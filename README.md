# 🏫 School Management & Portal Template (Multi-School / SaaS)

A full-stack, customizable school website and management portal designed to be deployed for individual schools as a **bespoke solution** or **multi-tenant template**.

Every school gets its own branded identity—school name, acronym, logo, tagline, contact information, currency, and role-based portals for **Administrators**, **Teachers**, and **Students**.

---

## 🌟 Key Features

- **Public School Website**: Landing page with Hero, About, Programs, Admissions, Contact Form, and dynamic branding.
- **Dynamic School Branding**: Change school name, logo, address, phone, email, and motto via the **Admin Portal UI** or via CLI—no code changes required.
- **Role-Based Portals**:
  - **Administrator**: User accounts, Students, Teachers, Classes & Subjects, Attendance Registers, Exams & Grades, School Fees & Debtor tracking, and School Branding Settings.
  - **Teacher**: Assigned classes & students, attendance marking, assessment and score management.
  - **Student**: Profile & subject enrollment, attendance history, grades & report cards, fee breakdown & online payment.
- **Online Fees Payment**: Built-in Paystack payment gateway integration.
- **Production-Ready**: PostgreSQL support (`psycopg`), Whitenoise static file serving, JWT authentication, and Gunicorn WSGI.

---

## 🏗️ Project Architecture

```
school_fullstack/
├── setup_new_school.sh     # Interactive wizard to spin up/brand a new school
├── README.md               # Complete documentation
│
├── schoolbackend/          # Django 5 / Django REST Framework
│   ├── administrator/      # Auth, User accounts, SchoolConfig model & views
│   ├── academics/          # Classes, Subjects, Sessions, Enrollments
│   ├── student/            # Student profiles
│   ├── teacher/            # Teacher profiles
│   ├── attendance/         # Attendance registers & tracking
│   ├── exams/              # Assessments, Tests, Exams & Scores
│   ├── fees/               # Fee structures, Payments, Online Paystack
│   ├── api/                # Django project settings & URL routing
│   ├── build.sh            # Production build & migration script
│   ├── railway.json        # Railway deployment configuration
│   ├── render.yaml         # Render blueprint configuration
│   ├── Procfile            # Process file for Render / Heroku / Railway
│   └── requirements.txt    # Python dependencies
│
└── schoolfrontend/         # React 19 + Vite + Tailwind CSS + Bootstrap
    ├── src/
    │   ├── components/     # Public school website components (Hero, Header, Footer...)
    │   ├── portal/
    │   │   ├── auth/       # AuthProvider, SchoolConfigContext, Guards
    │   │   ├── layouts/    # Branded PortalLayout
    │   │   └── pages/      # Dashboards for Admin, Teacher, Student
    │   └── App.jsx         # Routing & role boundaries
    ├── netlify.toml        # Netlify SPA configuration
    └── vercel.json         # Vercel SPA configuration
```

---

## 🚀 Quick Start: Spin Up a New School in 2 Minutes

Run the automated setup wizard:

```bash
chmod +x setup_new_school.sh
./setup_new_school.sh
```

The script will prompt you for:
1. School Name (e.g. *St. Jude High School*)
2. Acronym (e.g. *SJH*)
3. Motto / Tagline
4. Contact phone, email, and physical address
5. Administrator credentials

It automatically generates a secure `SECRET_KEY`, writes `.env` files, runs database migrations, and initializes the school branding.

---

## 💻 Manual Local Development Setup

### 1. Backend Setup (Django)

```bash
cd schoolbackend

# Create and activate virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt

# Copy environment template
cp .env.example .env

# Apply migrations
python manage.py migrate

# Initialize school branding and create admin account
python manage.py setup_school

# Start development server
python manage.py runserver
```

The backend API will run at `http://127.0.0.1:8000`.

### 2. Frontend Setup (React + Vite)

```bash
cd schoolfrontend

# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Start Vite dev server
npm run dev
```

The frontend will run at `http://localhost:5173`.

---

## 🎨 How Customization Works

### 1. In-App Customization (Recommended)
1. Log in to the school portal at `/login` using the administrator account.
2. In the Admin Dashboard, click on **⚙️ School Settings**.
3. Update any of the following:
   - **School Name** (reflects on the header, hero, footer, and page title)
   - **Short Name / Acronym** (reflects on the navigation bar)
   - **Motto / Tagline**
   - **Logo Image URL** (hosted link from Cloudinary, Imgur, or your website)
   - **Contact Email & Phone Number**
   - **Physical Address & Office Hours**
   - **Currency Code & Symbol** (e.g. NGN ₦, USD $, GBP £, GHS ₵)
4. Click **Save Customization**. The entire frontend will immediately refresh with the new branding!

### 2. CLI Customization
You can also re-run the setup command anytime:
```bash
python manage.py setup_school --name "New Academy" --short-name "NA" --non-interactive
```

### 3. API Endpoint
- Public endpoint: `GET /api/school-config/` (no authentication required)
- Admin update: `PATCH /api/school-config/` (requires Admin JWT bearer token)

---

## ☁️ Deployment Guide

### Option A: Railway (Recommended for Best Experience)

1. **Push your code to GitHub**.
2. Go to [railway.app](https://railway.app) and create a **New Project** → **Deploy from GitHub repo**.
3. **Add PostgreSQL**:
   - In the same Railway project, click **+ New** → **Database** → **Add PostgreSQL**.
   - Railway will automatically provision a database and link the `DATABASE_URL` variable.
4. **Deploy Backend**:
   - Choose the `schoolbackend` root directory in service settings.
   - Set the following Environment Variables in Railway:
     - `SECRET_KEY`: (generate a random 50-character string)
     - `DEBUG`: `False`
     - `ALLOWED_HOSTS`: `*` (or your custom domain)
     - `CORS_ALLOWED_ORIGINS`: `https://your-frontend.netlify.app`
     - `RAILWAY_PUBLIC_DOMAIN`: `${{RAILWAY_PUBLIC_DOMAIN}}`
   - Railway automatically uses `railway.json` and runs `build.sh`.
5. **Initialize First Admin on Railway**:
   - Open the Railway service web terminal or use Railway CLI:
     ```bash
     python manage.py setup_school
     ```

---

### Option B: Render

1. Go to [render.com](https://render.com) and click **New +** → **Blueprint**.
2. Connect your GitHub repository. Render will automatically detect `schoolbackend/render.yaml`.
3. It will automatically create:
   - A PostgreSQL database instance (`school-db`)
   - A Python Web Service (`school-backend`) running `build.sh` and `gunicorn`
4. Set `CORS_ALLOWED_ORIGINS` to your frontend URL.

---

### Deploying the Frontend (Netlify / Vercel)

1. Connect your repository to **Netlify** or **Vercel**.
2. Configure build settings:
   - **Base directory**: `schoolfrontend`
   - **Build command**: `npm run build`
   - **Publish directory**: `schoolfrontend/dist`
3. Add Environment Variable:
   - `VITE_API_URL`: Your deployed backend URL (e.g., `https://school-backend.up.railway.app`)
   - `VITE_SCHOOL_NAME`: Your School Name
4. Deploy! The included `netlify.toml` / `vercel.json` ensures client-side routing works for `/login`, `/admin`, `/teacher`, `/student`.

---

## 🔐 Environment Variables Reference

### Backend (`schoolbackend/.env`)

| Variable | Description | Default |
|---|---|---|
| `SECRET_KEY` | Django cryptographic secret key | *Required in production* |
| `DEBUG` | Enable/disable debug mode | `False` |
| `DATABASE_URL` | PostgreSQL or SQLite connection URI | `sqlite:///db.sqlite3` |
| `ALLOWED_HOSTS` | Comma-separated list of allowed hostnames | `localhost,127.0.0.1` |
| `CORS_ALLOWED_ORIGINS` | Comma-separated list of allowed frontend origins | `http://localhost:5173` |
| `CORS_ALLOW_ALL_ORIGINS`| Allow all origins (use carefully) | `False` |
| `SCHOOL_NAME` | Initial school name fallback | `School Management Portal` |
| `PAYSTACK_SECRET_KEY` | Paystack secret key for school fees | Optional |
| `PAYSTACK_CALLBACK_URL`| Paystack redirect callback URL | Optional |

### Frontend (`schoolfrontend/.env`)

| Variable | Description | Default |
|---|---|---|
| `VITE_API_URL` | Base URL of the backend API | `http://127.0.0.1:8000` |
| `VITE_SCHOOL_NAME` | Default school name fallback | `School Management Portal` |

---

## 👥 User Roles & Default Workflow

1. **Admin logs in**: Configures school sessions, terms, classes, subjects, and teachers.
2. **Admin creates Teacher & Student accounts**: User accounts are created under **User Accounts**, generating their portal logins.
3. **Enrollment**: Students are enrolled into their respective classes.
4. **Teachers log in**: Mark daily class attendance and enter continuous assessment / exam scores.
5. **Students log in**: View their attendance rate, see published report card scores, and pay outstanding school fees.
