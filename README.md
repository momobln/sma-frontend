Frontend client for the **Shift Ledger**  a Next.js 15 + TypeScript project that allows security guards to manage and save their work shifts.


##  Overview

This frontend connects to an existing REST API and provides a simple interface to:
- Register and log in.
- Add, edit, and delete work shifts.
- View total working hours.
- Redirect users automatically based on authentication state.

##  Tech Stack

| Layer | Technology |
| Framework | Next.js 15 (App Router) |
| Language | TypeScript |
| UI | TailwindCSS |
| HTTP Client | Axios |
| Auth | JWT (stored in localStorage) |


## Authentication Flow
On login, the app receives a JWT from the backend.
The token is saved in localStorage.
On page load (app/page.tsx), if a token exists → redirect to /shifts;
otherwise → /login.

