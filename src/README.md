Pastebin-Lite

A minimal Pastebin-style web application where users can create text pastes and share a link to view them. Pastes can optionally expire after a time limit or after a maximum number of views.

🚀 Running the App Locally
1. Clone the Repository
git clone https://github.com/YOUR_USERNAME/pastebin-lite.git
cd pastebin-lite

2. Install Dependencies
npm install

3. Set Up Environment Variables

Create a .env file in the root directory:

DATABASE_URL=your_neon_postgres_connection_string
TEST_MODE=0
PORT=3000


⚠️ Do not commit .env to version control.

4. Create the Database Table

Run this SQL in your Neon SQL editor:

CREATE TABLE IF NOT EXISTS pastes (
    id TEXT PRIMARY KEY,
    content TEXT NOT NULL,
    created_at TIMESTAMP NOT NULL DEFAULT NOW(),
    expires_at TIMESTAMP NULL,
    max_views INT NULL,
    views INT NOT NULL DEFAULT 0
);

5. Start the Development Server
npm run dev


The server will start at:

http://localhost:3000

🗄 Persistence Layer

This project uses Neon PostgreSQL, a serverless Postgres database.

Reasons for choosing Neon:

Persistent storage required for serverless environments

Works well with Vercel deployments

Standard PostgreSQL compatibility

Supports connection over SSL securely

The app connects using the pg Node.js driver with a small connection pool optimized for serverless environments.

🧠 Important Design Decisions
1. Serverless-Friendly Architecture

The app is built with Express but wrapped using serverless-http so it can run on Vercel’s serverless platform without a long-running server process.

2. Deterministic Expiry for Testing

To support automated testing of TTL expiration:

When TEST_MODE=1

The header x-test-now-ms overrides the current time for expiry logic

This allows tests to simulate future timestamps reliably.

3. Constraint Handling Logic

A paste becomes unavailable when either:

Its TTL expires, or

Its view limit is exceeded

Whichever happens first makes the paste return 404 Not Found, as required.

4. Safe Content Rendering

Paste content is rendered inside <pre> tags with HTML escaping to prevent script injection or XSS attacks.

5. No In-Memory State

All paste data (views, expiry, content) is stored in PostgreSQL. This ensures correctness across multiple serverless function invocations.

6. View Counting

Each successful fetch via:

GET /api/pastes/:id

GET /p/:id

increments the view counter atomically in the database.

📌 Main Endpoints
Method	Endpoint	Description
GET	/api/healthz	Health check
POST	/api/pastes	Create a new paste
GET	/api/pastes/:id	Fetch paste as JSON
GET	/p/:id	View paste as HTML
