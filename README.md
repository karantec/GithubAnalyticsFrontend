# 🔍 GitHub Explorer

A full-stack web application that integrates with the **GitHub REST API** to search public repositories, view repository details, and save favourites.

# 🔍 GitHub Explorer

A full-stack web application that integrates with the **GitHub REST API** to search public repositories, view repository details, and save favourites.

> **Live demo:** _add your deployed URL here_ (e.g. `https://github-analytics-frontend-bhzd.vercel.app/`)
> **API:** _add your deployed backend URL here_ (e.g. `https://githubanalyticsdashboard12.onrender.com`)

---

## 📦 Deliverables

- [x] Complete GitHub source code repository (this repo)
- [x] Working frontend (`/frontend`) and backend (`/backend`)
- [x] MongoDB integration (saved repositories)
- [x] README with setup instructions (this file)
- [x] `.env.example` files for both apps
- [ ] Deployed demo URL (optional, see [Deployment](#-deployment))

---

## ✨ Features

**Repository search**

- Search public repositories by keyword
- Shows name, description, stars, forks and language
- Pagination (10 per page)
- Sort by best match, most stars, or recently updated

**Repository details**

- Repository information, topics and open issues count
- Latest 5 commits
- Top 5 contributors

**Favourites**

- Save and remove favourite repositories
- Stored in MongoDB, shown on a separate **Saved** page
- Duplicate saves are prevented (unique database index)

**Backend**

- All GitHub requests go through the Node.js backend
- Search results cached for 5 minutes
- GitHub rate-limit handling
- Credentials kept in environment variables

---

## 🛠 Tech Stack

| Layer           | Technology                                           |
| --------------- | ---------------------------------------------------- |
| Frontend        | React 18 (Vite), React Router, Axios                 |
| Styling         | Tailwind CSS v4                                      |
| Backend         | Node.js, Express.js                                  |
| Database        | MongoDB (Mongoose)                                   |
| Third-party API | GitHub REST API                                      |
| Other           | node-cache, helmet, cors, express-rate-limit, morgan |

---

## 📁 Project Structure

```
github-explorer/
├── README.md
├── backend/
│   ├── app.js
│   ├── .env.example
│   ├── config/db.js
│   ├── models/Favorite.js
│   ├── services/github.service.js
│   ├── controllers/
│   │   ├── repo.controller.js
│   │   └── favorite.controller.js
│   ├── routes/
│   │   ├── repo.routes.js
│   │   └── favorite.routes.js
│   ├── middleware/
│   │   ├── validate.js
│   │   └── errorHandler.js
│   └── utils/ (AppError, asyncHandler, cache)
└── frontend/
    ├── .env.example
    ├── vite.config.js
    └── src/
        ├── api/client.js
        ├── context/FavoritesContext.jsx
        ├── components/
        └── pages/ (SearchPage, RepoDetailsPage, SavedPage)
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js **18+**
- MongoDB (local install **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A GitHub personal access token (see below)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/github-explorer.git
cd github-explorer
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in the values
npm run dev
```

The API runs on **http://localhost:5000**. On success you will see:

```
✅ MongoDB connected: ...
🚀 Server running on http://localhost:5000
```

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs on **http://localhost:3000**. In development, Vite proxies `/api` requests to the backend, so no extra configuration is needed.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable            | Description                   | Example                                     |
| ------------------- | ----------------------------- | ------------------------------------------- |
| `PORT`              | Port the API listens on       | `5000`                                      |
| `NODE_ENV`          | `development` or `production` | `development`                               |
| `MONGO_URI`         | MongoDB connection string     | `mongodb://127.0.0.1:27017/github_explorer` |
| `CLIENT_URL`        | Frontend origin (for CORS)    | `http://localhost:3000`                     |
| `GITHUB_TOKEN`      | GitHub personal access token  | `github_pat_...`                            |
| `GITHUB_API_URL`    | GitHub API base URL           | `https://api.github.com`                    |
| `CACHE_TTL_SECONDS` | Search cache lifetime         | `300`                                       |

### Frontend (`frontend/.env`)

| Variable       | Description                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | Backend URL. Leave empty in development; set it in production (e.g. `https://your-api.onrender.com/api`) |

### How to get the values

**GitHub token**

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. Set an expiry, choose **Public repositories (read-only)**, leave permissions empty
3. Copy the token into `GITHUB_TOKEN`

Without a token GitHub allows 60 requests/hour; with one it allows 5,000/hour.

**MongoDB**

- _Local:_ `mongodb://127.0.0.1:27017/github_explorer`
- _Atlas:_ create a free cluster, add a database user, allow your IP under Network Access, then copy the connection string from **Connect → Drivers**

> ⚠️ Never commit `.env` or share your token. Both `.env` files are git-ignored.

---

## 📡 API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint                                                  | Description                                                             |
| ------ | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| GET    | `/health`                                                 | Health check                                                            |
| GET    | `/api/repos/search?q=react&page=1&per_page=10&sort=stars` | Search repositories (`sort`: `stars` or `updated`; omit for best match) |
| GET    | `/api/repos/:owner/:repo`                                 | Repository details, 5 commits, 5 contributors                           |
| GET    | `/api/favorites`                                          | List saved repositories                                                 |
| POST   | `/api/favorites`                                          | Save a repository                                                       |
| DELETE | `/api/favorites/:repoId`                                  | Remove a saved repository                                               |

Favourites are scoped per user via an optional `x-user-id` header. The frontend generates an anonymous id and stores it in `localStorage`.

**Example: save a repository**

```http
POST /api/favorites
Content-Type: application/json
x-user-id: my-browser-id

{
  "repoId": 10270250,
  "name": "react",
  "fullName": "facebook/react",
  "owner": "facebook",
  "description": "The library for web and native user interfaces.",
  "stars": 230000,
  "forks": 47000,
  "language": "JavaScript",
  "htmlUrl": "https://github.com/facebook/react"
}
```

A Postman collection is included: `GitHub-Explorer.postman_collection.json`.

---

## 🧪 Handling the Mandatory Challenges

| Challenge                       | How it is handled                                                                                                                                                             |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub API error or unavailable | Network failures and timeouts return 503/504; GitHub 5xx returns 502. The frontend shows an error message with a **Try again** button.                                        |
| Invalid or deleted repository   | GitHub's 404 becomes a clear 404 response. Owner/repo params are validated first.                                                                                             |
| Empty search results            | Returns `200` with `data: []`; the UI shows a "No repositories found" state.                                                                                                  |
| Duplicate saved repositories    | Checked in the controller and enforced by a unique MongoDB index on `userId + repoId`. Returns `409`; the UI shows "Already saved".                                           |
| API rate-limit errors           | Detected from `403/429` and `x-ratelimit-*` headers. Returns `429` with `Retry-After`, `retryAfter` and `resetAt`. The server does not crash and the UI shows the retry time. |

Additional safeguards: input validation on all query and body fields, a central error handler, a global `unhandledRejection` handler, and a rate limiter on the API itself.

---

## ✅ Manual Testing Checklist

1. Search `react`, then change sorting and pages
2. Search the same term again within 5 minutes and check `"cached": true` in the Network tab
3. Open a repository and confirm 5 commits, 5 contributors and the open issues count
4. Save a repository, refresh, and confirm it is still saved
5. Save the same repository again and confirm it is not duplicated
6. Remove a saved repository
7. Search `zzqxqxjkwpvv9876543` and confirm the empty state
8. Visit `/repo/facebook/not-a-real-repo-123` and confirm the error message
9. Stop the backend and search, then confirm the error with the retry button

---

## ☁️ Deployment

| Part     | Suggested host          | Notes                                                                                                                       |
| -------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Database | MongoDB Atlas (free M0) | Allow the host's IP (or `0.0.0.0/0`) under Network Access                                                                   |
| Backend  | Render / Railway        | Root directory `backend`, start command `npm start`; add all backend env vars; set `CLIENT_URL` to the frontend URL         |
| Frontend | Vercel / Netlify        | Root directory `frontend`, build command `npm run build`, output `dist`; set `VITE_API_URL` to `https://<backend-host>/api` |

For single-page routing, add a rewrite so all paths serve `index.html` (on Vercel: a `vercel.json` with `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`).

---

## 📄 License

MIT


---

## 📦 Deliverables

- [x] Complete GitHub source code repository (this repo)
- [x] Working frontend (`/frontend`) and backend (`/backend`)
- [x] MongoDB integration (saved repositories)
- [x] README with setup instructions (this file)
- [x] `.env.example` files for both apps
- [ ] Deployed demo URL (optional, see [Deployment](#-deployment))

---

## ✨ Features

**Repository search**

- Search public repositories by keyword
- Shows name, description, stars, forks and language
- Pagination (10 per page)
- Sort by best match, most stars, or recently updated

**Repository details**

- Repository information, topics and open issues count
- Latest 5 commits
- Top 5 contributors

**Favourites**

- Save and remove favourite repositories
- Stored in MongoDB, shown on a separate **Saved** page
- Duplicate saves are prevented (unique database index)

**Backend**

- All GitHub requests go through the Node.js backend
- Search results cached for 5 minutes
- GitHub rate-limit handling
- Credentials kept in environment variables

---

## 🛠 Tech Stack

| Layer           | Technology                                           |
| --------------- | ---------------------------------------------------- |
| Frontend        | React 18 (Vite), React Router, Axios                 |
| Styling         | Tailwind CSS v4                                      |
| Backend         | Node.js, Express.js                                  |
| Database        | MongoDB (Mongoose)                                   |
| Third-party API | GitHub REST API                                      |
| Other           | node-cache, helmet, cors, express-rate-limit, morgan |

---

## 📁 Project Structure

```
github-explorer/
├── README.md
├── backend/
│   ├── app.js
│   ├── .env.example
│   ├── config/db.js
│   ├── models/Favorite.js
│   ├── services/github.service.js
│   ├── controllers/
│   │   ├── repo.controller.js
│   │   └── favorite.controller.js
│   ├── routes/
│   │   ├── repo.routes.js
│   │   └── favorite.routes.js
│   ├── middleware/
│   │   ├── validate.js
│   │   └── errorHandler.js
│   └── utils/ (AppError, asyncHandler, cache)
└── frontend/
    ├── .env.example
    ├── vite.config.js
    └── src/
        ├── api/client.js
        ├── context/FavoritesContext.jsx
        ├── components/
        └── pages/ (SearchPage, RepoDetailsPage, SavedPage)
```

---

## 🚀 Setup Instructions

### Prerequisites

- Node.js **18+**
- MongoDB (local install **or** a free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster)
- A GitHub personal access token (see below)

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/github-explorer.git
cd github-explorer
```

### 2. Backend

```bash
cd backend
npm install
cp .env.example .env      # then fill in the values
npm run dev
```

The API runs on **http://localhost:5000**. On success you will see:

```
✅ MongoDB connected: ...
🚀 Server running on http://localhost:5000
```

### 3. Frontend

Open a second terminal:

```bash
cd frontend
npm install
npm run dev
```

The app runs on **http://localhost:3000**. In development, Vite proxies `/api` requests to the backend, so no extra configuration is needed.

---

## 🔐 Environment Variables

### Backend (`backend/.env`)

| Variable            | Description                   | Example                                     |
| ------------------- | ----------------------------- | ------------------------------------------- |
| `PORT`              | Port the API listens on       | `5000`                                      |
| `NODE_ENV`          | `development` or `production` | `development`                               |
| `MONGO_URI`         | MongoDB connection string     | `mongodb://127.0.0.1:27017/github_explorer` |
| `CLIENT_URL`        | Frontend origin (for CORS)    | `http://localhost:3000`                     |
| `GITHUB_TOKEN`      | GitHub personal access token  | `github_pat_...`                            |
| `GITHUB_API_URL`    | GitHub API base URL           | `https://api.github.com`                    |
| `CACHE_TTL_SECONDS` | Search cache lifetime         | `300`                                       |

### Frontend (`frontend/.env`)

| Variable       | Description                                                                                              |
| -------------- | -------------------------------------------------------------------------------------------------------- |
| `VITE_API_URL` | Backend URL. Leave empty in development; set it in production (e.g. `https://your-api.onrender.com/api`) |

### How to get the values

**GitHub token**

1. GitHub → **Settings** → **Developer settings** → **Personal access tokens** → **Fine-grained tokens** → **Generate new token**
2. Set an expiry, choose **Public repositories (read-only)**, leave permissions empty
3. Copy the token into `GITHUB_TOKEN`

Without a token GitHub allows 60 requests/hour; with one it allows 5,000/hour.

**MongoDB**

- _Local:_ `mongodb://127.0.0.1:27017/github_explorer`
- _Atlas:_ create a free cluster, add a database user, allow your IP under Network Access, then copy the connection string from **Connect → Drivers**

> ⚠️ Never commit `.env` or share your token. Both `.env` files are git-ignored.

---

## 📡 API Reference

Base URL: `http://localhost:5000`

| Method | Endpoint                                                  | Description                                                             |
| ------ | --------------------------------------------------------- | ----------------------------------------------------------------------- |
| GET    | `/health`                                                 | Health check                                                            |
| GET    | `/api/repos/search?q=react&page=1&per_page=10&sort=stars` | Search repositories (`sort`: `stars` or `updated`; omit for best match) |
| GET    | `/api/repos/:owner/:repo`                                 | Repository details, 5 commits, 5 contributors                           |
| GET    | `/api/favorites`                                          | List saved repositories                                                 |
| POST   | `/api/favorites`                                          | Save a repository                                                       |
| DELETE | `/api/favorites/:repoId`                                  | Remove a saved repository                                               |

Favourites are scoped per user via an optional `x-user-id` header. The frontend generates an anonymous id and stores it in `localStorage`.

**Example: save a repository**

```http
POST /api/favorites
Content-Type: application/json
x-user-id: my-browser-id

{
  "repoId": 10270250,
  "name": "react",
  "fullName": "facebook/react",
  "owner": "facebook",
  "description": "The library for web and native user interfaces.",
  "stars": 230000,
  "forks": 47000,
  "language": "JavaScript",
  "htmlUrl": "https://github.com/facebook/react"
}
```

A Postman collection is included: `GitHub-Explorer.postman_collection.json`.

---

## 🧪 Handling the Mandatory Challenges

| Challenge                       | How it is handled                                                                                                                                                             |
| ------------------------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| GitHub API error or unavailable | Network failures and timeouts return 503/504; GitHub 5xx returns 502. The frontend shows an error message with a **Try again** button.                                        |
| Invalid or deleted repository   | GitHub's 404 becomes a clear 404 response. Owner/repo params are validated first.                                                                                             |
| Empty search results            | Returns `200` with `data: []`; the UI shows a "No repositories found" state.                                                                                                  |
| Duplicate saved repositories    | Checked in the controller and enforced by a unique MongoDB index on `userId + repoId`. Returns `409`; the UI shows "Already saved".                                           |
| API rate-limit errors           | Detected from `403/429` and `x-ratelimit-*` headers. Returns `429` with `Retry-After`, `retryAfter` and `resetAt`. The server does not crash and the UI shows the retry time. |

Additional safeguards: input validation on all query and body fields, a central error handler, a global `unhandledRejection` handler, and a rate limiter on the API itself.

---

## ✅ Manual Testing Checklist

1. Search `react`, then change sorting and pages
2. Search the same term again within 5 minutes and check `"cached": true` in the Network tab
3. Open a repository and confirm 5 commits, 5 contributors and the open issues count
4. Save a repository, refresh, and confirm it is still saved
5. Save the same repository again and confirm it is not duplicated
6. Remove a saved repository
7. Search `zzqxqxjkwpvv9876543` and confirm the empty state
8. Visit `/repo/facebook/not-a-real-repo-123` and confirm the error message
9. Stop the backend and search, then confirm the error with the retry button

---

## ☁️ Deployment

| Part     | Suggested host          | Notes                                                                                                                       |
| -------- | ----------------------- | --------------------------------------------------------------------------------------------------------------------------- |
| Database | MongoDB Atlas (free M0) | Allow the host's IP (or `0.0.0.0/0`) under Network Access                                                                   |
| Backend  | Render / Railway        | Root directory `backend`, start command `npm start`; add all backend env vars; set `CLIENT_URL` to the frontend URL         |
| Frontend | Vercel / Netlify        | Root directory `frontend`, build command `npm run build`, output `dist`; set `VITE_API_URL` to `https://<backend-host>/api` |

For single-page routing, add a rewrite so all paths serve `index.html` (on Vercel: a `vercel.json` with `{ "rewrites": [{ "source": "/(.*)", "destination": "/" }] }`).

---

## 📄 License

MIT
