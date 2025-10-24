# Subdomain Setup Guide for Vercel

## Your Domain Structure
- **Main Site**: https://techmigo.co.uk (Front app)
- **User Dashboard**: https://app.techmigo.co.uk (User app)
- **Admin Dashboard**: https://admin.techmigo.co.uk (Admin app)

---

## Step 1: Add Subdomains in Vercel

### For User Dashboard (app.techmigo.co.uk)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **migo-user** project
3. Click **Settings** → **Domains**
4. Click **Add Domain** button
5. Enter: `app.techmigo.co.uk`
6. Click **Add**
7. Vercel will show you DNS records to add (usually a CNAME record)

### For Admin Dashboard (admin.techmigo.co.uk)

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Select your **migo-admin** project (you may need to deploy this first if not done yet)
3. Click **Settings** → **Domains**
4. Click **Add Domain** button
5. Enter: `admin.techmigo.co.uk`
6. Click **Add**
7. Note the DNS records provided by Vercel

---

## Step 2: Configure DNS Records

### In Your Domain Registrar (where you bought techmigo.co.uk)

Add the following CNAME records:

| Type  | Name/Host | Value/Points To        | TTL  |
|-------|-----------|------------------------|------|
| CNAME | app       | cname.vercel-dns.com   | Auto |
| CNAME | admin     | cname.vercel-dns.com   | Auto |

**Note**: Vercel might provide different values. Use the exact records shown in your Vercel dashboard.

### Common Domain Registrars:

#### If using **Namecheap**:
1. Login to Namecheap
2. Go to Domain List → Manage
3. Advanced DNS tab
4. Add New Record:
   - Type: CNAME Record
   - Host: `app`
   - Value: `cname.vercel-dns.com`
   - TTL: Automatic
5. Repeat for `admin`

#### If using **GoDaddy**:
1. Login to GoDaddy
2. My Products → DNS
3. Add CNAME:
   - Name: `app`
   - Value: `cname.vercel-dns.com`
   - TTL: 1 Hour
4. Repeat for `admin`

#### If using **Cloudflare**:
1. Login to Cloudflare
2. Select techmigo.co.uk domain
3. DNS → Add record
4. Type: CNAME
5. Name: `app`
6. Target: `cname.vercel-dns.com`
7. Proxy status: DNS only (gray cloud) initially
8. Repeat for `admin`

---

## Step 3: Wait for DNS Propagation

- DNS changes can take 5 minutes to 48 hours to propagate
- Usually takes 15-30 minutes
- Check status at: https://www.whatsmydns.net/

---

## Step 4: Update Environment Variables in Vercel

### For migo-front project:
Go to Settings → Environment Variables, add:
```
NEXT_PUBLIC_FRONT_URL=https://techmigo.co.uk
NEXT_PUBLIC_APP_URL=https://techmigo.co.uk
NEXT_PUBLIC_USER_DASHBOARD_URL=https://app.techmigo.co.uk
NEXT_PUBLIC_ADMIN_URL=https://admin.techmigo.co.uk
```

### For migo-user project:
```
NEXT_PUBLIC_FRONT_URL=https://techmigo.co.uk
NEXT_PUBLIC_USER_DASHBOARD_URL=https://app.techmigo.co.uk
NEXT_PUBLIC_API_URL=https://techmigo.co.uk/api
```

### For migo-admin project:
```
NEXT_PUBLIC_ADMIN_URL=https://admin.techmigo.co.uk
NEXT_PUBLIC_FRONT_URL=https://techmigo.co.uk
NEXT_PUBLIC_API_URL=https://admin.techmigo.co.uk/api
```

---

## Step 5: Redeploy All Apps

After adding environment variables, redeploy each app:
1. Go to each project in Vercel
2. Go to Deployments tab
3. Click the "..." menu on latest deployment
4. Click **Redeploy**

Or simply push a new commit to GitHub to trigger auto-deployment.

---

## Verification Checklist

- [ ] Main site loads at https://techmigo.co.uk
- [ ] User dashboard loads at https://app.techmigo.co.uk
- [ ] Admin dashboard loads at https://admin.techmigo.co.uk
- [ ] Login from main site redirects to app.techmigo.co.uk
- [ ] Logout from app redirects back to techmigo.co.uk/login
- [ ] All API calls work correctly
- [ ] No console errors about CORS or mixed content

---

## Troubleshooting

### "Domain is not configured correctly"
- Wait longer for DNS propagation
- Check DNS records are exact matches
- Remove any existing A records for the subdomain

### SSL Certificate Issues
- Vercel automatically provisions SSL
- Can take a few minutes after DNS is configured
- Certificate will show "Pending" → "Valid"

### Subdomain shows 404
- Make sure you added the domain to the correct Vercel project
- Check that the project is deployed
- Try redeploying the project

### Redirects not working
- Check environment variables are set in Vercel
- Make sure you redeployed after adding env vars
- Clear browser cache and try incognito mode

---

## Quick Reference Commands

Check if subdomain is pointing correctly:
```bash
nslookup app.techmigo.co.uk
nslookup admin.techmigo.co.uk
```

Test if subdomain is reachable:
```bash
curl -I https://app.techmigo.co.uk
curl -I https://admin.techmigo.co.uk
```

---

## Need Help?

- Vercel Docs: https://vercel.com/docs/concepts/projects/domains
- DNS Checker: https://www.whatsmydns.net/
- Vercel Support: https://vercel.com/support
