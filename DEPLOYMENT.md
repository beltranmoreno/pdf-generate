# Deployment Guide

## 🚀 Quick Start (Local Testing)

```bash
npm start
```

Visit: `http://localhost:3000`

---

## Option 1: Railway (Recommended - Easiest)

### Cost: FREE (500 hrs/month) → $5/month after

### Steps:

1. **Push to GitHub**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git branch -M main
   git remote add origin https://github.com/YOUR_USERNAME/pdf-generator.git
   git push -u origin main
   ```

2. **Deploy to Railway**
   - Go to [railway.app](https://railway.app)
   - Click "Start a New Project"
   - Select "Deploy from GitHub repo"
   - Authorize GitHub access
   - Select your `pdf-generator` repository
   - Railway will auto-detect Node.js and deploy!

3. **Get Your URL**
   - Click "Generate Domain"
   - Your app will be live at: `https://your-app.up.railway.app`

4. **Done!** 🎉

### Auto-Deployments:
- Every `git push` automatically deploys
- Zero configuration needed

---

## Option 2: Render

### Cost: FREE tier available → $7/month for always-on

### Steps:

1. **Push to GitHub** (same as above)

2. **Deploy to Render**
   - Go to [render.com](https://render.com)
   - Click "New +" → "Web Service"
   - Connect your GitHub repository
   - Configure:
     - **Name**: pdf-generator
     - **Build Command**: `npm install`
     - **Start Command**: `npm start`
   - Click "Create Web Service"

3. **Your URL**: `https://pdf-generator.onrender.com`

**Note**: Free tier spins down after 15 mins of inactivity (first request takes ~30s)

---

## Option 3: Vercel (Serverless)

### Cost: FREE

### Steps:

1. **Install Vercel CLI**
   ```bash
   npm install -g vercel
   ```

2. **Deploy**
   ```bash
   vercel
   ```

3. **Follow prompts** → Done!

**Limitation**: Puppeteer cold starts are slower (~3-5 seconds)

---

## Option 4: Your Own Server (VPS)

### Cost: $5-10/month (DigitalOcean, Linode, etc.)

### Steps:

1. **SSH into your server**
   ```bash
   ssh user@your-server-ip
   ```

2. **Install Node.js**
   ```bash
   curl -fsSL https://deb.nodesource.com/setup_20.x | sudo -E bash -
   sudo apt-get install -y nodejs
   ```

3. **Clone and run**
   ```bash
   git clone https://github.com/YOUR_USERNAME/pdf-generator.git
   cd pdf-generator
   npm install
   npm start
   ```

4. **Keep it running with PM2**
   ```bash
   npm install -g pm2
   pm2 start server.js --name pdf-generator
   pm2 startup
   pm2 save
   ```

5. **Setup Nginx reverse proxy**
   ```nginx
   server {
       listen 80;
       server_name yourdomain.com;

       location / {
           proxy_pass http://localhost:3000;
           proxy_http_version 1.1;
           proxy_set_header Upgrade $http_upgrade;
           proxy_set_header Connection 'upgrade';
           proxy_set_header Host $host;
           proxy_cache_bypass $http_upgrade;
       }
   }
   ```

---

## Environment Variables

No environment variables needed for basic setup!

Optional (if you add authentication later):
```bash
PORT=3000
NODE_ENV=production
```

---

## Troubleshooting

### Puppeteer Issues on Deployment

If Puppeteer fails on Railway/Render, it's usually due to missing dependencies.

**Railway**: Usually works out of the box ✅

**Render**: Add this to `render.yaml`:
```yaml
services:
  - type: web
    name: pdf-generator
    env: node
    buildCommand: npm install
    startCommand: npm start
```

### Port Issues

The app automatically uses `process.env.PORT` (Railway/Render set this automatically)

---

## Custom Domain

### Railway:
1. Go to your project settings
2. Click "Custom Domain"
3. Add your domain (e.g., `pdf.yourdomain.com`)
4. Update your DNS with the provided CNAME

### Render:
1. Go to "Settings" → "Custom Domain"
2. Add your domain
3. Update DNS records

---

## Monitoring

Check your app status:
- **Railway**: Dashboard shows logs and metrics
- **Render**: Real-time logs in dashboard
- **Health check**: Visit `/health` endpoint

---

## Updating Your App

```bash
git add .
git commit -m "Update description"
git push
```

Railway/Render will automatically redeploy! 🚀

---

## Security Tips

1. **Add rate limiting** (prevent abuse)
2. **Add authentication** (if needed)
3. **Use HTTPS** (Railway/Render provide this free)
4. **Monitor usage** (check dashboard regularly)

---

## Need Help?

- Railway: [railway.app/help](https://railway.app/help)
- Render: [render.com/docs](https://render.com/docs)
- This project: [Create an issue](https://github.com/YOUR_USERNAME/pdf-generator/issues)
