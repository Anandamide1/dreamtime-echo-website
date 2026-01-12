# DNS Setup Instructions for dreamtimeecho.shop on Hostinger

## Step 1: Access Your Hostinger DNS Management

1. Log in to your **Hostinger** account
2. Go to **Domains** section
3. Find **dreamtimeecho.shop** and click **Manage**
4. Click on **DNS / Nameservers** tab

## Step 2: Add These DNS Records

**Delete any existing A records first, then add:**

### A Records (IPv4)
```
Type: A
Name: @ (or leave blank for root domain)
Value: 185.199.108.153
TTL: 3600

Type: A  
Name: www
Value: 185.199.108.153
TTL: 3600
```

### CNAME Record (Alternative method)
If A records don't work, try this CNAME instead:
```
Type: CNAME
Name: @
Value: vgh0i1c38xv6.manus.space
TTL: 3600

Type: CNAME
Name: www  
Value: vgh0i1c38xv6.manus.space
TTL: 3600
```

## Step 3: Save and Wait

1. **Save** all DNS changes
2. **Wait 15-30 minutes** for DNS propagation
3. Test by visiting: `https://dreamtimeecho.shop`

## Your Website Details

- **Live Website URL:** https://vgh0i1c38xv6.manus.space (temporary)
- **Your Domain:** https://dreamtimeecho.shop (after DNS setup)
- **Total Products:** 9 digital products
- **Revenue Potential:** $263.93 AUD total catalog value
- **Payment System:** Live Stripe integration ready

## Troubleshooting

If the domain doesn't work after 30 minutes:
1. Check if DNS records were saved correctly
2. Try using CNAME records instead of A records
3. Contact me for alternative deployment options

## Next Steps After DNS Setup

Once your domain is live:
1. Test all product purchases
2. Verify Stripe payments are working
3. Share your store link to start generating sales
4. I'll continue managing and updating your website as needed

Your expanded Dreamtime Echo store is ready to start generating income!
