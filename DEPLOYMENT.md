# 🚀 Deployment Guide: AI Interview Platform

Follow these steps to take your project from local development to a live production environment.

## Phase 1: GitHub Preparation

1.  **Create a Repository**: Create a new private or public repository on GitHub.
2.  **Push your Code**:
    ```bash
    git init
    git add .
    git commit -m "Ready for production"
    git branch -M main
    git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
    git push -u origin main
    ```

---

## Phase 2: Backend Deployment (Render)

1.  Log in to [Render.com](https://render.com).
2.  Click **New +** and select **Blueprint**.
3.  Connect your GitHub repository.
4.  Render will automatically detect the `render.yaml` file in the `backend/` folder.
5.  **Environment Variables**: In the Render dashboard, go to your Web Service -> **Environment** and add the following keys from your `.env`:
    - `OPENAI_API_KEY`, `GOOGLE_API_KEY`, `DEEPGRAM_API_KEY`, `ELEVEN_LABS_API_KEY`, `HUME_API_KEY`
    - `MONGODB_URI`, `PINECONE_API_KEY`, `RESEND_API_KEY`, `AFFINDA_API_KEY`, `FIRECRAWL_API_KEY`
    - `ALLOWED_ORIGINS`: Set this to your **Frontend URL** (e.g., `https://your-app.vercel.app`) after the frontend is deployed.

---

## Phase 3: Frontend Deployment (Vercel)

1.  Log in to [Vercel.com](https://vercel.com).
2.  Click **Add New...** -> **Project**.
3.  Import your GitHub repository.
4.  **Framework Preset**: Select **Next.js**.
5.  **Root Directory**: Click "Edit" and select the `frontend/` folder.
6.  **Environment Variables**: Add the following:
    - `NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY`: From your Clerk Dashboard.
    - `CLERK_SECRET_KEY`: From your Clerk Dashboard.
    - `NEXT_PUBLIC_API_URL`: Set this to your **Render Backend URL** (e.g., `https://prepai-backend.onrender.com`).
7.  Click **Deploy**.

---

## Phase 4: Final Verification

1.  **Health Check**: Visit `https://your-backend.onrender.com/health`. It should return `{"status": "healthy"}`.
2.  **CORS Update**: Go back to Render, and update `ALLOWED_ORIGINS` to match your new Vercel URL.
3.  **End-to-End Test**: Log in via Clerk on your live URL and generate a mock roadmap.

### 💡 Pro Tip
Always use **Environment Variables** in the dashboard settings of Vercel/Render. NEVER push your actual `.env` file to GitHub for security reasons.
