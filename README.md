# MediCare — Medical Appointment System (MERN)

A full-stack medical appointment platform built with **MongoDB, Express, React, Node.js**.

> ⚠️ **Medical Disclaimer:** The Symptom Checker and report summaries in this app
> are for general, educational purposes only. They are **not medical advice**,
> a diagnosis, or a substitute for professional care. Always consult a
> licensed healthcare provider for any health concern, and contact emergency
> services in urgent situations.

## Features

- 🔐 Auth (JWT) — patient & doctor roles
- 👨‍⚕️ Doctor directory with search & specialization filter
- 📅 Book / confirm / complete / cancel appointments (with double-booking protection)
- 🩺 Symptom Checker — rule-based possible-condition suggestions, always shown with a disclaimer
- 📄 Medical Reports — doctors record diagnosis/medicines/notes; an auto-generated summary is created for every report
- ⏰ Medicine Reminders — patients schedule dose reminders with start/end dates and times
- 📱 Fully responsive UI (mobile, tablet, desktop)

## Project Structure

```
medical-appointment-system/
├── backend/          # Node + Express + MongoDB API
│   ├── config/       # DB connection
│   ├── models/       # Mongoose schemas
│   ├── controllers/  # Route handlers
│   ├── routes/       # Express routers
│   ├── middleware/    # Auth + error handling
│   ├── utils/         # Symptom matcher, summary generator, JWT helper
│   └── server.js
└── frontend/          # React (Vite) SPA
    └── src/
        ├── api/        # Axios instance
        ├── context/    # Auth context
        ├── components/ # Navbar, Footer, ProtectedRoute, DisclaimerBanner
        ├── pages/       # Home, Login, Register, Dashboard, Doctors, Book, Appointments, SymptomChecker, Reports, Reminders
        └── styles/      # Responsive CSS
```

## Prerequisites

- Node.js 18+
- MongoDB running locally, or a MongoDB Atlas connection string

## Setup

### 1. Backend

```bash
cd backend
cp .env.example .env     # edit MONGO_URI / JWT_SECRET as needed
npm install
npm run dev               # starts on http://localhost:5000
```

### 2. Frontend

```bash
cd frontend
cp .env.example .env      # points to the backend API URL
npm install
npm run dev                # starts on http://localhost:5173
```

Open **http://localhost:5173** in your browser.

## Using the App

1. **Register** as either a Patient or a Doctor.
2. As a **Doctor**, set your specialization and (optionally via API) your weekly `availability` slots.
3. As a **Patient**, browse **Doctors**, book an appointment, try the **Symptom Checker**, and set up **Medicine Reminders**.
4. Doctors can create a **Report** for a patient (paste the patient's user `_id`, visible via `/api/auth/me` or your DB) — a summary is generated automatically.

## Key API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| POST | `/api/auth/register` | Register patient/doctor |
| POST | `/api/auth/login` | Login |
| GET | `/api/doctors` | List doctors (search/specialization) |
| POST | `/api/appointments` | Book appointment (patient) |
| GET | `/api/appointments` | List my appointments |
| PUT | `/api/appointments/:id/status` | Confirm/complete/cancel |
| POST | `/api/symptom-checker` | Get possible conditions (with disclaimer) |
| POST | `/api/reports` | Create report + auto summary (doctor) |
| GET | `/api/reports` | List my reports |
| POST | `/api/reminders` | Create medicine reminder (patient) |
| GET | `/api/reminders` | List my reminders |

## Notes on the "AI" Features

- **Symptom Checker**: uses a transparent, keyword-overlap rule engine (`backend/utils/symptomData.js`) rather than a black-box model, so results are explainable. It always returns a disclaimer field that the frontend displays prominently.
- **Report Summary**: uses a deterministic template/extractive summarizer (`backend/utils/reportSummary.js`) that works fully offline. If you want richer natural-language summaries, you can swap this function for a call to the Anthropic API (or another LLM provider) using the report's structured fields as the prompt input — just keep the same disclaimer language.

## Suggested Next Steps

- Add email/SMS push notifications for reminders (e.g. node-cron + a mail/SMS provider)
- Add doctor availability management UI
- Add file uploads for lab reports (e.g. multer + PDF viewer)
- Add pagination and rate limiting for production use
