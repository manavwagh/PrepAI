# AI Interview Platform - Deployment Guide

This platform is ready to be published! Below are the steps to get it live.

## 1. Database Setup (MongoDB Atlas)
1.  Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas) and create a free account.
2.  Create a new Cluster (the free "Shared" tier is fine).
3.  Go to **Database Access** and create a user with "Read and Write to any database" permissions.
4.  Go to **Network Access** and add `0.0.0.0/0` (allow access from anywhere) for the initial setup.
5.  Click **Connect** -> **Connect your application** and copy the Connection String (SRV).
6.  **Important**: Replace `<password>` in the connection string with your database user's password.

## 2. Backend Deployment (Railway or Render)
### Via Railway (Recommended)
1.  Connect your GitHub repository to [Railway.app](https://railway.app/).
2.  Add a new service from your repo, pointing to the `backend/` directory.
3.  Add the following **Variables** in the Railway dashboard:
    - `MONGODB_URI`: Your MongoDB Atlas connection string.
    - `OPENAI_API_KEY`: Your OpenAI API Key (or Gemini Key).
    - `ALLOWED_ORIGINS`: Your frontend URL (e.g., `https://your-site.vercel.app`).
    - `PORT`: `8000` (Railway will usually override this).
4.  Railway will automatically detect the `main.py` and start the server.

## 3. Frontend Deployment (Vercel or Netlify)
### Via Vercel
1.  Connect your repo to [Vercel](https://vercel.com/).
2.  Set the **Root Directory** to `frontend/`.
3.  Add the following **Environment Variable**:
    - `NEXT_PUBLIC_API_URL`: The URL of your deployed backend (e.g., `https://api-production.up.railway.app`).
4.  Click **Deploy**.

## 4. Local Testing
To test locally with environment variables, create a `.env.local` file in the `frontend` directory and a `.env` file in the `backend` directory based on the `.example` files provided.

---

Built with ❤️ for **VIT** and candidates everywhere.
