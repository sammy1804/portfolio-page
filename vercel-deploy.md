# Deploying to Vercel

This document outlines the steps to deploy this portfolio website to Vercel.

## 1. Setup Vercel Account
If you haven't already, sign up for a free account at [Vercel](https://vercel.com/signup) using your GitHub account.

## 2. Deploy from GitHub (Recommended)
The easiest way to deploy to Vercel is by importing your GitHub repository.

1. Once your code is pushed to your GitHub repository (`https://github.com/sammy1804/portfolio-page`), go to the Vercel dashboard: [https://vercel.com/dashboard](https://vercel.com/dashboard).
2. Click the **"Add New..."** button and select **"Project"**.
3. Under the **"Import Git Repository"** section, find your repository (`sammy1804/portfolio-page`) and click **"Import"**.
   - *Note: If you don't see it, you may need to adjust your Vercel GitHub App permissions to grant access to the specific repository.*
4. **Configure Project:**
   - **Project Name:** You can leave this as the default or name it `portfolio-page`.
   - **Framework Preset:** Vercel should automatically detect **Vite**. Keep this as Vite.
   - **Root Directory:** Leave this as `./`.
   - **Build and Output Settings:** Vercel should auto-detect Vite's default settings:
     - Build Command: `npm run build` or `npm run vercel-build`
     - Output Directory: `dist`
     - Install Command: `npm install`
5. Click **Deploy**.
6. Wait a few moments for Vercel to build and deploy your project. Once complete, you will be provided with a live deployment URL.

## 3. Custom Domain (Optional)
If you have a custom domain (e.g., `samridhi.com`):
1. Go to your project's dashboard on Vercel.
2. Click on **Settings** > **Domains**.
3. Enter your custom domain and click **Add**.
4. Follow the provided instructions to configure your DNS records (adding A records or CNAME records) on your domain registrar.

## Useful Links
- [Vercel Deployment Documentation](https://vercel.com/docs/deployments/overview)
- [Vite Deployment Guide](https://vitejs.dev/guide/static-deploy.html#vercel)
