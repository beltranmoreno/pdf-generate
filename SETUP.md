# Setup Guide

## ✅ What's Included

- **Password-protected web form** - Form is hidden until correct password is entered
- **Rich text editor** - Format text with bold, italic, lists, etc.
- **Auto-generated filenames** - PDFs named: `REPORT_PATIENT_NAME_DATE.pdf`
- **Bilingual support** - English & Spanish
- **Custom logo & signature** - Your branding included

---

## 🔐 Setting Your Password

### Local Development:
The default password is `medical2024`

To change it, edit [server.js](server.js:10):
```javascript
const ACCESS_PASSWORD = process.env.ACCESS_PASSWORD || 'YOUR_PASSWORD_HERE';
```

### Production (Railway):
1. Go to your Railway project
2. Click "Variables"
3. Add: `ACCESS_PASSWORD` = `your-secure-password`
4. Deploy!

**Your password is now set and secure!**

---

## 🌐 Custom Subdomain on Railway (FREE)

Railway allows **FREE custom subdomains** on their domain:

### Steps:

1. **Deploy to Railway** (follow [DEPLOYMENT.md](DEPLOYMENT.md))

2. **Generate Domain**:
   - In your Railway project dashboard
   - Click "Settings" → "Networking"
   - Click "Generate Domain"
   - You'll get: `https://your-app-name.up.railway.app`

3. **Customize Subdomain** (Optional):
   - Click the domain name
   - Edit the subdomain part
   - Example: `https://medical-reports.up.railway.app`

### Using Your Own Domain (Optional - Requires Domain Purchase):

If you want `pdf.yourdomain.com`:

1. **Add Custom Domain** in Railway:
   - Settings → Networking → "Custom Domain"
   - Enter: `pdf.yourdomain.com`

2. **Update DNS** (at your domain registrar):
   - Add CNAME record:
     ```
     Type: CNAME
     Name: pdf
     Value: your-app.up.railway.app
     ```

3. **Wait 5-10 minutes** for DNS propagation

4. **Done!** Your app is live at `https://pdf.yourdomain.com`

---

## 🎨 Customization

### Change Logo:
Replace [alai_logo.png](alai_logo.png) with your logo

### Change Signature:
Replace [ma_sign.png](ma_sign.png) with your signature image

### Change Colors:
Edit [public/index.html](public/index.html) line 16:
```css
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

---

## 📱 Usage

1. **Visit your URL**
2. **Enter password** (default: `medical2024`)
3. **Fill out form**:
   - Patient name
   - Date of birth
   - Report date
   - Language
   - Report text (with rich formatting)
   - Doctor info
4. **Click "Generate PDF"**
5. **Download** - File automatically named: `REPORT_PATIENT_NAME_DATE.pdf`

---

## 🔒 Security Notes

- Password is checked on server-side (secure)
- No patient data is stored (HIPAA-friendly)
- PDFs are deleted after download
- HTTPS enabled by default on Railway

---

## 💰 Cost Summary

| Item | Cost |
|------|------|
| Railway subdomain | **FREE** |
| Railway hosting (first 500 hrs) | **FREE** |
| Railway hosting (after) | $5/month |
| Custom domain (optional) | $12/year |

**Total: $0-5/month** 🎉

---

## 📞 Support

- Railway issues: [railway.app/help](https://railway.app/help)
- App deployment: See [DEPLOYMENT.md](DEPLOYMENT.md)
