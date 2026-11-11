# Sweety – Blood Glucose Tracker

Sweety is a React, Express, and PostgreSQL application for recording daily blood glucose readings and viewing daily and monthly reports.

The project is being implemented phase by phase. Installation, database setup, seeding, testing, and complete usage instructions will be added as each phase is completed.

## Database commands

Run these commands from the `backend` directory after configuring `DATABASE_URL` in `.env`:

```bash
npm run db:status
npm run db:migrate
npm run db:verify
```

To roll back the latest migration:

```bash
npm run db:rollback
```
