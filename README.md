# Sweety — Blood Glucose Tracker

Sweety is a responsive web application that helps diabetes patients record daily blood glucose readings and review daily and monthly reports.

## Features

- Secure signup, login, and logout
- Password hashing with bcrypt
- Private, user-specific readings
- Add, view, edit, and delete readings
- Maximum of four readings per day
- Daily, month-to-date, and previous-month reports
- Highest, lowest, average, and total reading statistics
- Interactive glucose trend chart with time-slot filters
- Report table pagination with 20 readings per page
- Responsive Tailwind CSS interface
- Loading, error, empty, expired-session, and not-found states
- Demo user and sample data seed script
- Backend validation tests

## Prerequisites

- Node.js 20 or newer
- npm
- A PostgreSQL database, such as Neon

## Installation

Install the backend dependencies:

```bash
cd backend
npm install
```

Install the frontend dependencies in another terminal:

```bash
cd client
npm install
```

## Environment variables

Copy `backend/.env.example` to `backend/.env` and enter your own values:

```env
PORT=5000
NODE_ENV=development
CLIENT_URL=http://localhost:5173,https://your-frontend-domain.example
DATABASE_URL=your_postgresql_connection_string
TEST_DATABASE_URL=your_test_postgresql_connection_string
JWT_SECRET=your_long_random_secret
JWT_EXPIRES_IN=7d
```

When using Neon, paste the provided PostgreSQL connection string into `DATABASE_URL`.

Copy `client/.env.example` to `client/.env`.

```env
VITE_API_URL=http://localhost:5000/api
```

## Database setup

Run the migration after configuring `backend/.env`:

```bash
cd backend
npm run db:migrate
```

The migration creates the `users` and `readings` tables. Reports are calculated from the readings and do not require a separate table.

## Demo user and sample data

Create the demo user and sample readings:

```bash
cd backend
npm run db:seed
```

Use these credentials to log in:

```text
Email: demo@sweety.app
Password: Demo@123
```

The seed includes readings for the previous month and the elapsed current month. Running it again replaces only the demo user's sample readings.

## Run the application

Start the backend:

```bash
cd backend
npm run dev
```

Start the frontend in another terminal:

```bash
cd client
npm run dev
```

Open `http://localhost:5173` in the browser.

The API runs at `http://localhost:5000`. Its database connection can be checked at `http://localhost:5000/api/health`.

## Tests

Run the backend tests:

```bash
cd backend
npm test
```

## Validation rules

- A glucose value is required.
- The value must be a whole number between 40 and 600 mg/dl.
- Only one reading is allowed per time slot per date.
- No more than four readings are allowed per date.
- A reading date cannot be in the future.

## Main API routes

| Method | Route | Purpose |
| --- | --- | --- |
| `POST` | `/api/auth/register` | Register a user |
| `POST` | `/api/auth/login` | Log in |
| `POST` | `/api/auth/logout` | Log out |
| `GET` | `/api/auth/me` | Get the logged-in user |
| `GET` | `/api/readings?date=YYYY-MM-DD` | Get readings for a date |
| `POST` | `/api/readings` | Add a reading |
| `PUT` | `/api/readings/:id` | Update a reading |
| `DELETE` | `/api/readings/:id` | Delete a reading |
| `GET` | `/api/reports?type=daily&date=YYYY-MM-DD` | Get a daily report |
| `GET` | `/api/reports?type=month-to-date&date=YYYY-MM-DD` | Get a month-to-date report |
| `GET` | `/api/reports?type=previous-month&date=YYYY-MM-DD` | Get a previous-month report |

## Notes

### Assumptions

- Each account represents one patient.
- Dates are handled using the Asia/Kolkata timezone.
- The previous-month report covers the entire calendar month.
- Reports are calculated when requested instead of being stored in a separate table.
- Report pagination changes only the visible table rows. Statistics and charts use all readings in the selected range.

### Improvements with more time

- Add password reset, email verification, login rate limiting, and stronger production cookie security.
- Let patients define personal glucose target ranges and clearly highlight readings outside those targets.
- Add optional notes for meals, medication, exercise, and symptoms so readings have useful context.
- Allow users to export or share reports as CSV or PDF for medical appointments.
- Add reminders and configurable notifications for missed reading slots.
- Add structured logging, error monitoring, database backups, and health alerts for production reliability.
- Explore doctor accounts with patient consent, secure assignments, and read-only report access.

## Author

Designed and developed by **Darshan**.

## License

This project and its source code are the property of Darshan. They may not be copied, modified, distributed, or used without permission from the author.
