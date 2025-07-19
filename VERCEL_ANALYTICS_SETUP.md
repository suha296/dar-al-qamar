# Vercel Analytics Setup Guide

## 🔧 **Environment Variables Setup**

To connect your custom analytics dashboard to real Vercel Analytics data, you need to configure these environment variables:

### **Required Environment Variables:**

1. **`VERCEL_TOKEN`** - Your Vercel API token
2. **`VERCEL_PROJECT_ID`** - Your Vercel project ID
3. **`VERCEL_TEAM_ID`** (optional) - Your Vercel team ID (if using team account)

## 📋 **Step-by-Step Setup**

### **Step 1: Get Your Vercel Token**

1. Go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Click on your profile picture → **Settings**
3. Go to **Tokens** tab
4. Click **Create Token**
5. Give it a name like "Analytics API Token"
6. Select **Full Account** scope
7. Copy the generated token

### **Step 2: Get Your Project ID**

1. Go to your Vercel project dashboard
2. Look at the URL: `https://vercel.com/your-team/your-project`
3. The project ID is in the URL or you can find it in:
   - Project Settings → General → Project ID

### **Step 3: Get Your Team ID (if applicable)**

1. If you're using a team account, go to team settings
2. The team ID is in the URL: `https://vercel.com/teams/your-team-id`
3. Or find it in team settings

### **Step 4: Configure Environment Variables**

#### **For Local Development:**

Create or update your `.env.local` file:

```bash
# Vercel Analytics Configuration
VERCEL_TOKEN=gmh0DwfPwBTz8lOJWZrA1fMS
VERCEL_PROJECT_ID=prj_yU7IwQVLA9N4BGSqWrFPzxsNrv8a
VERCEL_TEAM_ID=your_team_id_here  # Optional
```

#### **For Production (Vercel):**

1. Go to your Vercel project dashboard
2. Navigate to **Settings** → **Environment Variables**
3. Add each variable:
   - **Name**: `VERCEL_TOKEN`
   - **Value**: `gmh0DwfPwBTz8lOJWZrA1fMS`
   - **Environment**: Production, Preview, Development
   
   - **Name**: `VERCEL_PROJECT_ID`
   - **Value**: `prj_yU7IwQVLA9N4BGSqWrFPzxsNrv8a`
   - **Environment**: Production, Preview, Development
   
   - **Name**: `VERCEL_TEAM_ID` (if applicable)
   - **Value**: Your team ID
   - **Environment**: Production, Preview, Development

4. Click **Save**

## 🚀 **Testing the Setup**

### **1. Deploy Your Changes**

```bash
git add .
git commit -m "Add Vercel Analytics integration"
git push
```

### **2. Test the Analytics Dashboard**

1. Visit your analytics dashboard: `https://your-domain.com/analytics`
2. You should see real data instead of mock data
3. Check the browser console for any errors

### **3. Verify Data Collection**

1. Visit your main villa page
2. Perform some actions (search dates, click WhatsApp buttons)
3. Wait a few minutes for data to appear in the dashboard
4. Refresh the analytics page to see new data

## 🔍 **Troubleshooting**

### **Common Issues:**

#### **"VERCEL_TOKEN not configured"**
- Make sure you've added the `VERCEL_TOKEN` environment variable
- Verify the token is valid and has the correct permissions
- Check that the variable is deployed to production

#### **"VERCEL_PROJECT_ID not configured"**
- Verify your project ID is correct
- Make sure the environment variable is set in Vercel

#### **"Failed to fetch analytics data"**
- Check that your Vercel token has the correct permissions
- Verify the project ID matches your actual project
- Check Vercel's status page for any API issues

#### **No data showing**
- Analytics data takes time to collect
- Make sure you've had some user activity
- Check that Vercel Analytics is enabled in your project

### **Debug Steps:**

1. **Check Environment Variables:**
   ```bash
   # In your Vercel function logs
   console.log('VERCEL_TOKEN:', process.env.VERCEL_TOKEN ? 'Set' : 'Not set');
   console.log('VERCEL_PROJECT_ID:', process.env.VERCEL_PROJECT_ID);
   ```

2. **Test API Endpoint:**
   ```bash
   curl "https://your-domain.com/api/analytics?days=7"
   ```

3. **Check Vercel Analytics:**
   - Go to your Vercel project → Analytics tab
   - Verify events are being tracked

## 📊 **Data Availability**

### **Real-time vs Historical Data:**
- **Real-time**: Events appear within minutes
- **Historical**: Data from before setup won't be available
- **Granularity**: Data is aggregated by day

### **Data Retention:**
- Vercel Analytics retains data for 30 days by default
- Consider upgrading for longer retention if needed

## 🔒 **Security Notes**

### **Token Security:**
- Keep your Vercel token secure
- Don't commit it to version control
- Use environment variables for all deployments
- Rotate tokens periodically

### **Access Control:**
- The analytics dashboard is currently public
- Consider adding authentication if needed
- You can restrict access by IP or add login requirements

## 🎯 **Next Steps**

### **After Setup:**
1. **Monitor Data Collection** - Check that events are being tracked
2. **Analyze Conversion Funnel** - Review your conversion rates
3. **Optimize Based on Data** - Use insights to improve user experience
4. **Set Up Alerts** - Get notified of important metrics

### **Advanced Features:**
1. **Custom Event Tracking** - Add more specific events
2. **A/B Testing** - Test different conversion strategies
3. **Export Data** - Download data for external analysis
4. **Real-time Monitoring** - Set up live dashboards

## 📞 **Support**

If you encounter issues:

1. **Check Vercel Documentation**: [Vercel Analytics](https://vercel.com/docs/analytics)
2. **Review Environment Variables**: Ensure all are set correctly
3. **Check Function Logs**: Look for errors in Vercel function logs
4. **Contact Support**: If issues persist

---

*Once configured, your analytics dashboard will show real conversion data from your villa rental website!* 