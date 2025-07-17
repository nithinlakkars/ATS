import express from "express";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();

const router = express.Router();

router.post("/exchange-token", async (req, res) => {
  const { code } = req.body;

  if (!code) {
    return res.status(400).json({ error: "Missing authorization code" });
  }

  try {
    // Exchange authorization code for tokens
    const tokenRes = await axios.post("https://accounts.zoho.com/oauth/v2/token", null, {
      params: {
        grant_type: "authorization_code",
        client_id: process.env.ZOHO_CLIENT_ID,
        client_secret: process.env.ZOHO_CLIENT_SECRET,
        redirect_uri: process.env.ZOHO_REDIRECT_URI,
        code,
      },
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    });

    const { access_token, refresh_token, expires_in, api_domain } = tokenRes.data;

    // Fetch user info from Zoho
   const userInfoRes = await axios.get(`${api_domain}/crm/v2/users?type=CurrentUser`, {
  headers: {
    Authorization: `Zoho-oauthtoken ${access_token}`,
  },
});

    const user = userInfoRes.data?.users?.[0];
    const userEmail = user?.email;
    const userName = user?.full_name;

    console.log("👤 Zoho User Email:", userEmail);

    // Simple role assignment logic (you can replace with DB logic)
    let userRole = "recruiter";
    if (userEmail === "admin@example.com") userRole = "admin";
    else if (userEmail === "lead@example.com") userRole = "leads";

    res.status(200).json({
      message: "Tokens and user info retrieved",
      access_token,
      refresh_token,
      expires_in,
      api_domain,
      userEmail,
      userName,
      userRole,
    });
  } catch (error) {
    console.error("❌ Zoho OAuth Error:", error.response?.data || error.message);
    res.status(500).json({
      error: "Failed to exchange token or fetch user info",
      details: error.response?.data || error.message,
    });
  }
});

export default router;
