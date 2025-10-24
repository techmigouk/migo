# Vercel Deployment Guide for Migo LMS

This guide will help you deploy your Migo LMS platform to Vercel. Since this is a monorepo with 3 separate Next.js apps, you'll need to deploy each one separately.

## 📋 Prerequisites

- GitHub account (✅ You have this - techmigouk/migo)
- Vercel account (create at https://vercel.com)
- MongoDB Atlas account for production database (https://www.mongodb.com/cloud/atlas)

---

## 🚀 Deployment Steps

### Step 1: Sign Up / Log In to Vercel

1. Go to https://vercel.com/signup
2. Click **"Continue with GitHub"**
3. Authorize Vercel to access your GitHub account

### Step 2: Import Your Repository

#### Option A: Using Vercel Dashboard (Recommended)

1. Go to https://vercel.com/new
2. Click **"Import Git Repository"**
3. Find and select **techmigouk/migo**
4. Click **"Import"**

#### Option B: Using Vercel CLI

```powershell
# Install Vercel CLI globally
npm install -g vercel

# Login to Vercel
vercel login

# Deploy (run from project root)
cd c:\Users\Lovin\migo
vercel
```

---

## 🎯 Deploy Each Application

You'll need to create **3 separate projects** on Vercel:

### 1️⃣ Deploy Student Frontend (Front)

**Project Name:** `migo-front` or `migo-student`

**Configuration:**
- **Framework Preset:** Next.js
- **Root Directory:** `front`
- **Build Command:** `cd ../.. && pnpm build --filter=front`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`

**Environment Variables:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/migo
NEXT_PUBLIC_API_URL=https://migo-front.vercel.app
NODE_ENV=production
```

**Custom Domain (Optional):**
- `migo.yourdomain.com`
- or use Vercel's: `migo-front.vercel.app`

---

### 2️⃣ Deploy Admin Dashboard

**Project Name:** `migo-admin`

**Configuration:**
- **Framework Preset:** Next.js
- **Root Directory:** `admin`
- **Build Command:** `cd ../.. && pnpm build --filter=admin`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`

**Environment Variables:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/migo
JWT_SECRET=your-super-secure-random-string-here-min-32-chars
NEXT_PUBLIC_API_URL=https://migo-admin.vercel.app
OPENAI_API_KEY=sk-your-openai-key (optional)
SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_USER=your-email@gmail.com
SMTP_PASS=your-app-password
MAX_FILE_SIZE=10485760
NODE_ENV=production
```

**Custom Domain (Optional):**
- `admin.yourdomain.com`
- or use Vercel's: `migo-admin.vercel.app`

---

### 3️⃣ Deploy User Dashboard

**Project Name:** `migo-user`

**Configuration:**
- **Framework Preset:** Next.js
- **Root Directory:** `user`
- **Build Command:** `cd ../.. && pnpm build --filter=user`
- **Output Directory:** `.next`
- **Install Command:** `pnpm install`

**Environment Variables:**
```env
MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/migo
NEXT_PUBLIC_API_URL=https://migo-user.vercel.app
NODE_ENV=production
```

**Custom Domain (Optional):**
- `dashboard.yourdomain.com`
- or use Vercel's: `migo-user.vercel.app`

---

## 🗄️ Set Up MongoDB Atlas (Production Database)

### Step 1: Create MongoDB Atlas Account

1. Go to https://www.mongodb.com/cloud/atlas/register
2. Sign up for a **FREE** M0 cluster (512MB)

### Step 2: Create a Cluster

1. Click **"Build a Database"**
2. Choose **"M0 FREE"** tier
3. Select **AWS** as provider
4. Choose region closest to your users (e.g., `us-east-1`)
5. Click **"Create Cluster"**

### Step 3: Create Database User

1. Go to **Database Access**
2. Click **"Add New Database User"**
3. Choose **"Password"** authentication
4. Username: `migouser`
5. Generate a **strong password** (save it!)
6. Database User Privileges: **Read and write to any database**
7. Click **"Add User"**

### Step 4: Whitelist IP Addresses

1. Go to **Network Access**
2. Click **"Add IP Address"**
3. Click **"Allow Access from Anywhere"** (0.0.0.0/0)
   - ⚠️ This is needed for Vercel's dynamic IPs
4. Click **"Confirm"**

### Step 5: Get Connection String

1. Go to **Database** → Click **"Connect"**
2. Choose **"Connect your application"**
3. Copy the connection string:
   ```
   mongodb+srv://migouser:<password>@cluster0.xxxxx.mongodb.net/?retryWrites=true&w=majority
   ```
4. Replace `<password>` with your actual password
5. Add database name: `mongodb+srv://migouser:password@cluster0.xxxxx.mongodb.net/migo?retryWrites=true&w=majority`

---

## 🔐 Important Security Steps

### 1. Generate Strong JWT Secret

```powershell
# Generate a secure random string (PowerShell)
-join ((48..57) + (65..90) + (97..122) | Get-Random -Count 64 | ForEach-Object {[char]$_})
```

Use this as your `JWT_SECRET` environment variable.

### 2. Set Up Environment Variables in Vercel

For **each project** (front, admin, user):

1. Go to Vercel Dashboard → Your Project
2. Click **"Settings"** → **"Environment Variables"**
3. Add each variable:
   - **Key:** Variable name (e.g., `MONGODB_URI`)
   - **Value:** Variable value
   - **Environments:** Check all (Production, Preview, Development)
4. Click **"Save"**

### 3. Never Commit Secrets

✅ Your `.gitignore` already protects:
- `.env` files
- `.env.local` files
- All environment files

---

## 🎨 Custom Domains (Optional)

### Add Custom Domain to Vercel Project

1. Go to Vercel Dashboard → Project → **Settings** → **Domains**
2. Add your domain (e.g., `migo.yourdomain.com`)
3. Follow DNS configuration instructions:

**For Namecheap/GoDaddy:**
- Type: `CNAME`
- Host: `@` or `www`
- Value: `cname.vercel-dns.com`

**For Cloudflare:**
- Type: `CNAME`
- Name: `@`
- Target: `cname.vercel-dns.com`
- Proxy status: DNS only (click orange cloud to turn off)

---

## 📝 Deployment Checklist

### Before Deploying:

- [ ] MongoDB Atlas cluster created
- [ ] Database user created with password
- [ ] Network access configured (0.0.0.0/0)
- [ ] Connection string obtained
- [ ] JWT secret generated (64+ characters)
- [ ] SMTP credentials ready (if using email features)
- [ ] OpenAI API key ready (if using AI features)

### For Each App (Front, Admin, User):

- [ ] Project created on Vercel
- [ ] Root directory set correctly
- [ ] Build command configured
- [ ] Environment variables added
- [ ] First deployment successful
- [ ] Environment variables verified
- [ ] Test the live URL

### After Deployment:

- [ ] Test user registration
- [ ] Test user login
- [ ] Test admin login
- [ ] Test database connection
- [ ] Check error logs in Vercel dashboard
- [ ] Set up custom domains (if needed)

---

## 🔄 Automatic Deployments

Vercel automatically deploys when you push to GitHub:

- **Push to `main`** → Production deployment
- **Push to other branches** → Preview deployment
- **Pull requests** → Preview deployment with URL

### Redeploy Manually:

1. Go to Vercel Dashboard → Project → **Deployments**
2. Click **"..."** → **"Redeploy"**

---

## 🐛 Troubleshooting

### Build Fails with "Module not found"

**Solution:** Make sure build command includes `pnpm install`:
```
cd ../.. && pnpm install && pnpm build --filter=front
```

### Database Connection Fails

**Solution:** Check:
- MongoDB Atlas IP whitelist includes `0.0.0.0/0`
- Connection string is correct
- Database user password is correct
- Environment variable `MONGODB_URI` is set

### API Routes Return 404

**Solution:** Verify:
- `NEXT_PUBLIC_API_URL` points to correct Vercel URL
- No trailing slash in URL
- API routes are in `app/api/` folder

### Environment Variables Not Working

**Solution:**
- Redeploy after adding variables
- Check variable names match exactly (case-sensitive)
- Ensure variables are set for correct environment (Production/Preview)

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Free)

1. Go to Project → **Analytics**
2. Enable **Web Analytics**
3. Monitor:
   - Page views
   - Performance metrics
   - Geographic distribution

### Vercel Logs

1. Go to Project → **Deployments**
2. Click on deployment → **View Function Logs**
3. Real-time logs for debugging

---

## 💰 Pricing

**Vercel Free Tier Includes:**
- ✅ Unlimited deployments
- ✅ 100GB bandwidth/month
- ✅ Automatic HTTPS
- ✅ Preview deployments
- ✅ Analytics (limited)

**If you need more:**
- **Pro Plan:** $20/month per user
  - 1TB bandwidth
  - Advanced analytics
  - Password protection
  - Team collaboration

**MongoDB Atlas Free Tier:**
- ✅ 512MB storage
- ✅ Shared cluster
- ✅ Good for development/testing

---

## 🎉 Success URLs

After deployment, your apps will be live at:

- **Student Frontend:** https://migo-front.vercel.app
- **Admin Dashboard:** https://migo-admin.vercel.app
- **User Dashboard:** https://migo-user.vercel.app

---

## 🔗 Useful Links

- **Vercel Dashboard:** https://vercel.com/dashboard
- **Vercel Docs:** https://vercel.com/docs
- **MongoDB Atlas:** https://cloud.mongodb.com
- **Your GitHub Repo:** https://github.com/techmigouk/migo

---

## 🆘 Need Help?

- Vercel Support: https://vercel.com/support
- MongoDB Support: https://www.mongodb.com/cloud/atlas/support
- GitHub Issues: https://github.com/techmigouk/migo/issues

---

**🚀 Ready to deploy? Start with Step 1 above!**
