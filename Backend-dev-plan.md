# Backend Development Plan

### 1️⃣ Executive Summary
- This document outlines the backend development plan for the Strategic Sprint application, a tool designed to help professionals refine their strategic thinking.
- The backend will be built using FastAPI (Python 3.13, async) and will use MongoDB Atlas as its database via the Motor driver and Pydantic v2 models.
- Constraints include no Docker, a single-branch (`main`) Git workflow, and mandatory manual testing after every task.
- The project will be developed in dynamic sprints (S0…Sn) to cover all frontend-visible features.

### 2️⃣ In-Scope & Success Criteria
- **In-Scope Features:**
  - User authentication via Google (Signup/Login).
  - Core Strategic Sprint workflow: A 3-step process (Unpack, Stress-Test, Finalize).
  - AI Coach interaction to challenge user ideas.
  - Generation and exporting of polished, one-page reports.
  - A "My Forge" dashboard to list all past reports.
  - A paywall modal that appears before the first report export to drive trial conversions.
- **Success Criteria:**
  - All frontend features are fully functional end-to-end, powered by the backend.
  - All task-level manual tests pass successfully via UI interactions.
  - Each sprint's code is committed and pushed to the `main` branch after successful verification.

### 3️⃣ API Design
- **Base Path:** `/api/v1`
- **Error Envelope:** `{ "error": "message" }`

- **Authentication**
  - `POST /api/v1/auth/google/login`
    - **Purpose:** Handles user signup and login using a Google auth token.
    - **Request:** `{ "token": "google_id_token" }`
    - **Response:** `{ "access_token": "jwt_token", "token_type": "bearer" }`
    - **Validation:** Validates the Google token with Google's services.
  - `GET /api/v1/auth/me`
    - **Purpose:** Fetches the current authenticated user's profile.
    - **Request:** (Requires Authorization header)
    - **Response:** `{ "id": "user_id", "email": "user_email", "name": "User Name" }`
  - `POST /api/v1/auth/logout`
    - **Purpose:** (Server-side) Invalidate the token if using a denylist, otherwise, this is a client-side action. For this plan, we'll assume client-side token clearing.
    - **Request:** (Requires Authorization header)
    - **Response:** `{ "message": "Logged out successfully" }`

- **Sprints & Reports**
  - `POST /api/v1/sprints`
    - **Purpose:** Creates a new strategic sprint.
    - **Request:** `{ "initial_dump": "User's initial text or voice transcript" }`
    - **Response:** `{ "sprint_id": "new_sprint_id", "status": "unpack", ... }`
  - `PUT /api/v1/sprints/{sprint_id}`
    - **Purpose:** Updates a sprint's content during the Unpack or Stress-Test phase.
    - **Request:** `{ "content": { ... }, "status": "stress-test" }`
    - **Response:** `{ "sprint_id": "sprint_id", "updated_at": "timestamp", ... }`
  - `POST /api/v1/sprints/{sprint_id}/coach`
    - **Purpose:** Gets a challenge from the AI Coach.
    - **Request:** `{ "current_content": { ... } }`
    - **Response:** `{ "challenge": "AI-generated question", "source": { "url": "...", "title": "..." } }`
  - `POST /api/v1/sprints/{sprint_id}/finalize`
    - **Purpose:** Finalizes a sprint and generates the report.
    - **Request:** `{}`
    - **Response:** `{ "report_id": "new_report_id", "title": "...", "summary": "...", "url": "/my-forge/report_id" }`
  - `GET /api/v1/reports`
    - **Purpose:** Fetches all reports for the authenticated user for the "My Forge" page.
    - **Request:** (Requires Authorization header)
    - **Response:** `[{ "id": "...", "title": "...", "date": "...", "summary": "..." }]`
  - `GET /api/v1/reports/{report_id}`
    - **Purpose:** Fetches the detailed content of a single report.
    - **Request:** (Requires Authorization header)
    - **Response:** `{ "id": "...", "title": "...", "date": "...", "summary": "...", "full_content": "..." }`

### 4️⃣ Data Model (MongoDB Atlas)
- **Collection: `users`**
  - `_id`: ObjectId (Primary Key)
  - `google_id`: String (Required, Indexed)
  - `email`: String (Required)
  - `name`: String
  - `created_at`: DateTime
  - **Example:** `{ "_id": ObjectId("..."), "google_id": "123...", "email": "user@example.com", "name": "John Doe", "created_at": ISODate("...") }`

- **Collection: `sprints`**
  - `_id`: ObjectId (Primary Key)
  - `user_id`: ObjectId (Reference to `users`)
  - `status`: String (Enum: "unpack", "stress-test", "finalized")
  - `content`: Object (Flexible structure for notes, sections, etc.)
  - `history`: Array (Log of user edits and AI interactions)
  - `created_at`: DateTime
  - `updated_at`: DateTime
  - **Example:** `{ "_id": ObjectId("..."), "user_id": ObjectId("..."), "status": "unpack", "content": { "notes": [...] }, "history": [], "created_at": ISODate("..."), "updated_at": ISODate("...") }`

- **Collection: `reports`**
  - `_id`: ObjectId (Primary Key)
  - `user_id`: ObjectId (Reference to `users`)
  - `sprint_id`: ObjectId (Reference to `sprints`)
  - `title`: String (Required)
  - `summary`: String (Required)
  - `full_content`: String (The polished report text)
  - `created_at`: DateTime
  - **Example:** `{ "_id": ObjectId("..."), "user_id": ObjectId("..."), "sprint_id": ObjectId("..."), "title": "Q4 Marketing Strategy", "summary": "...", "full_content": "...", "created_at": ISODate("...") }`

### 5️⃣ Frontend Audit & Feature Map
- **`LandingPage.tsx`**
  - **Purpose:** Drives users to sign up.
  - **Endpoints:** `POST /api/v1/auth/google/login`
  - **Models:** `users`
  - **Auth:** Public
- **`CoreWorkspace.tsx` / `StrategicSprint.tsx`**
  - **Purpose:** The main 3-step workflow.
  - **Endpoints:** `POST /api/v1/sprints`, `PUT /api/v1/sprints/{sprint_id}`, `POST /api/v1/sprints/{sprint_id}/coach`, `POST /api/v1/sprints/{sprint_id}/finalize`
  - **Models:** `sprints`, `reports`
  - **Auth:** Required
- **`MyForge.tsx`**
  - **Purpose:** Lists all of the user's past reports.
  - **Endpoints:** `GET /api/v1/reports`
  - **Models:** `reports`
  - **Auth:** Required
- **`ReportDetail.tsx`**
  - **Purpose:** Shows the content of a single report.
  - **Endpoints:** `GET /api/v1/reports/{report_id}`
  - **Models:** `reports`
  - **Auth:** Required
- **`PaywallModal.tsx`**
  - **Purpose:** Upsell to a trial before first report export.
  - **Endpoints:** (Frontend logic, but may call a `GET /api/v1/users/me` to check subscription status).
  - **Models:** `users`
  - **Auth:** Required

### 6️⃣ Configuration & ENV Vars (core only)
- `APP_ENV`: `development` or `production`
- `PORT`: `8000`
- `MONGODB_URI`: MongoDB Atlas connection string.
- `JWT_SECRET`: Secret key for signing JWTs.
- `JWT_EXPIRES_IN`: `3600` (in seconds, e.g., 1 hour)
- `CORS_ORIGINS`: The frontend URL (e.g., `http://localhost:5173`).
- `GOOGLE_CLIENT_ID`: Google OAuth Client ID.

### 7️⃣ Background Work (only if required)
- No background tasks are required for the MVP. Report generation can be a synchronous operation.

### 8️⃣ Integrations (only if required)
- **Google OAuth:** For user authentication. Requires `GOOGLE_CLIENT_ID` to be configured for token verification.
- **External AI Service (e.g., OpenAI/Gemini):** For the AI Coach feature. Will require an API key (`AI_API_KEY`) and an endpoint URL.

### 9️⃣ Testing Strategy (Manual via Frontend)
- All testing will be performed manually through the frontend UI to ensure end-to-end functionality.
- Every task in the sprint plan includes a specific **Manual Test Step** and a **User Test Prompt**.
- After all tasks in a sprint are completed and tested, the code will be committed and pushed to the `main` branch.
- If any test fails, the issue must be fixed and re-tested before pushing.

### 🔟 Dynamic Sprint Plan & Backlog (S0 → Sn)

---

### 🧱 S0 – Environment Setup & Frontend Connection

**Objectives:**
- Create a basic FastAPI application skeleton with `/api/v1` base path and a `/healthz` endpoint.
- Establish a connection to the MongoDB Atlas database using the `MONGODB_URI`.
- The `/healthz` endpoint should perform a simple DB ping to confirm the connection.
- Configure CORS to allow requests from the frontend application.
- Replace all dummy API URLs in the frontend with the real backend URLs.
- Initialize a Git repository at the project root, set the default branch to `main`, and create a `.gitignore` file.

**Definition of Done:**
- The FastAPI backend runs locally without errors and successfully connects to MongoDB Atlas.
- Visiting `/healthz` returns a JSON response indicating a successful DB connection.
- The frontend application successfully fetches data from the backend instead of using mock data.
- The project is pushed to a GitHub repository on the `main` branch.

**Tasks:**
- **Task 1: Setup FastAPI Project**
  - **Manual Test Step:** Run `uvicorn main:app --reload`. Open browser to `http://127.0.0.1:8000/healthz`.
  - **Expected Result:** See `{"status": "ok", "db_connection": "successful"}`.
  - **User Test Prompt:** "Start the backend server and navigate to the /healthz endpoint in your browser to confirm it's running and connected to the database."
- **Task 2: Connect Frontend to Backend**
  - **Manual Test Step:** Run the frontend dev server. Open the "My Forge" page.
  - **Expected Result:** The page should load an empty list (or real data if any exists) from the backend, not the mock data. Check the browser's Network tab to confirm the API call to `/api/v1/reports`.
  - **User Test Prompt:** "Run both the frontend and backend. Open the 'My Forge' page and verify it makes a network request to the backend to fetch reports."
- **Task 3: Git Initialization and Push**
  - **Manual Test Step:** Check the GitHub repository.
  - **Expected Result:** The initial project structure is visible on the `main` branch.
  - **User Test Prompt:** "Confirm that the initial project setup is pushed and visible in the GitHub repository on the main branch."

**Post-sprint:**
- Commit and push all S0 changes to `main`.

---

### 🧩 S1 – Basic Auth (Signup / Login / Logout)

**Objectives:**
- Implement JWT-based authentication using Google OAuth.
- Create a `users` collection in MongoDB to store user profiles.
- Protect the `/api/v1/reports` endpoints so only authenticated users can access them.
- Update the frontend to handle the login flow and store the JWT.

**User Stories:**
- As a new user, I can sign up/log in with my Google account in one click.
- As a logged-in user, my session is remembered, and I can access protected pages.
- As a logged-in user, I can log out of the application.

**Tasks:**
- **Task 1: Implement Google Login Endpoint**
  - **Manual Test Step:** On the frontend, click the "Login with Google" button. Complete the Google auth flow.
  - **Expected Result:** The user is redirected back to the app, a JWT is saved in local storage, and the user is considered logged in. The UI updates to a logged-in state.
  - **User Test Prompt:** "Log in using the Google button. Check your browser's developer tools to confirm a JWT is stored after a successful login."
- **Task 2: Protect Backend Routes**
  - **Manual Test Step:** After logging out (clearing the JWT), attempt to access the "My Forge" page, which calls `GET /api/v1/reports`.
  - **Expected Result:** The API call should fail with a 401 Unauthorized error, and the frontend should redirect to the login page.
  - **User Test Prompt:** "Log out of the application. Try to visit the 'My Forge' page and confirm you are redirected to the login page."
- **Task 3: Implement Logout**
  - **Manual Test Step:** While logged in, click the "Logout" button.
  - **Expected Result:** The JWT is cleared from local storage, and the UI returns to a logged-out state.
  - **User Test Prompt:** "Click the logout button and confirm that you are no longer able to access protected pages like 'My Forge'."

**Definition of Done:**
- The full authentication flow (login, logout, route protection) works end-to-end from the frontend.
- User data is correctly stored in the `users` collection.

**Post-sprint:**
- Commit and push all S1 changes to `main`.

---

### 🧱 S2 – Core Sprint & Report Generation

**Objectives:**
- Implement the API endpoints for creating and managing strategic sprints.
- Implement the AI Coach endpoint to provide challenges.
- Implement the report finalization and generation logic.
- Connect the `CoreWorkspace` frontend component to these new endpoints.

**User Stories:**
- As a user, I can start a new sprint by entering my initial thoughts.
- As a user, I can edit my sprint content and get challenges from an AI coach.
- As a user, I can finalize my sprint and have a report generated.

**Tasks:**
- **Task 1: Create and Update Sprints**
  - **Manual Test Step:** In the `CoreWorkspace`, type some text into the "Unpack" area and see it save.
  - **Expected Result:** A new entry is created in the `sprints` collection. Subsequent edits update the same document.
  - **User Test Prompt:** "Start a new sprint in the workspace. Verify in your MongoDB Atlas dashboard that a new document is created in the 'sprints' collection."
- **Task 2: AI Coach Integration**
  - **Manual Test Step:** In the "Stress-Test" phase, click the button to get a challenge from the AI Coach.
  - **Expected Result:** An AI-generated question appears on the screen.
  - **User Test Prompt:** "Proceed to the 'Stress-Test' step and request a challenge from the AI Coach. Confirm that a new question appears."
- **Task 3: Finalize and Generate Report**
  - **Manual Test Step:** Complete the sprint and click the "Finalize" button.
  - **Expected Result:** The user is redirected to the "My Forge" page, and the newly created report is visible at the top of the list. A new document is created in the `reports` collection.
  - **User Test Prompt:** "Complete all steps of a sprint and finalize it. Confirm that you are redirected to 'My Forge' and your new report is listed."

**Definition of Done:**
- Users can complete the entire strategic sprint workflow from the UI.
- `sprints` and `reports` are correctly created and updated in the database.

**Post-sprint:**
- Commit and push all S2 changes to `main`.