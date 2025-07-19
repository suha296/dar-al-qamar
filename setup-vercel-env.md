# Manual Vercel Environment Variables Setup

## 🚨 **URGENT: Environment Variables Not Set**

The debug logs show that your environment variables are not configured in Vercel. Follow these steps to fix this:

## 📋 **Step-by-Step Setup**

### **Step 1: Go to Vercel Dashboard**

1. Open your browser and go to [Vercel Dashboard](https://vercel.com/dashboard)
2. Find and click on your project (`dar-al-qamar` or similar)

### **Step 2: Navigate to Environment Variables**

1. In your project dashboard, click on **Settings** tab
2. In the left sidebar, click on **Environment Variables**

### **Step 3: Add the Required Variables**

Add these **3 environment variables** one by one:

#### **Variable 1: VERCEL_TOKEN**
- **Name**: `VERCEL_TOKEN`
- **Value**: `gmh0DwfPwBTz8lOJWZrA1fMS`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### **Variable 2: VERCEL_PROJECT_ID**
- **Name**: `VERCEL_PROJECT_ID`
- **Value**: `prj_yU7IwQVLA9N4BGSqWrFPzxsNrv8a`
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

#### **Variable 3: VERCEL_TEAM_ID (Optional)**
- **Name**: `VERCEL_TEAM_ID`
- **Value**: Leave empty or add your team ID if you have one
- **Environment**: ✅ Production, ✅ Preview, ✅ Development
- Click **Save**

### **Step 4: Redeploy Your Project**

1. Go back to the **Deployments** tab
2. Find your latest deployment
3. Click the **⋮** (three dots) menu
4. Select **Redeploy**

### **Step 5: Test the Analytics Dashboard**

1. Wait for the redeploy to complete
2. Visit your analytics dashboard: `https://your-domain.com/analytics`
3. You should now see real data instead of the error message

## 🔍 **Verify Setup**

After setting the environment variables, you should see:

### **In the Analytics Dashboard:**
- Real data instead of "Make sure environment variables are configured"
- Data source showing "Vercel Analytics"
- Actual numbers for page views, searches, etc.

### **In Browser Console:**
- Debug logs showing "Set" instead of "Not set"
- API calls to Vercel Analytics
- Response data from the analytics API

## 🚨 **Common Issues & Solutions**

### **Issue: Still showing "Not set"**
**Solution**: 
1. Make sure you selected all environments (Production, Preview, Development)
2. Redeploy your project after adding variables
3. Wait a few minutes for the changes to take effect

### **Issue: "Failed to fetch analytics data"**
**Solution**:
1. Check that your Vercel token is valid
2. Verify the project ID matches your actual project
3. Make sure Vercel Analytics is enabled in your project

### **Issue: No data showing**
**Solution**:
1. Analytics data takes time to collect
2. Make sure you've had some user activity on your site
3. Check that Vercel Analytics is enabled

## 📞 **Need Help?**

If you're still having issues:

1. **Check Vercel Function Logs**:
   - Go to your project → Functions tab
   - Look for `/api/analytics` function
   - Check the logs for detailed error messages

2. **Verify Vercel Analytics is Enabled**:
   - Go to your project → Analytics tab
   - Make sure it's enabled and tracking events

3. **Test with a Simple Event**:
   - Visit your main villa page
   - Click some buttons
   - Wait a few minutes
   - Check the analytics dashboard again

---

**Once you've completed these steps, your analytics dashboard will show real conversion data from your villa rental website!** 