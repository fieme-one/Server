const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: "https://leavstyles.netlify.app" // replace with your Netlify domain
}));

// Google OAuth client
const CLIENT_ID = "934920299860-19m0i3jd9aqjg0a7cfis88ipie1nvls8.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// ✅ Verify Google token only
app.post("/verify-token", async (req, res) => {
  try {
    const { idToken } = req.body;

    // Verify with Google
    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    const { sub, email, name, picture } = payload;

    // ✅ Only send back verification result (no Supabase call here)
    res.json({
      verified: true,
      user: { id: sub, email, name, picture }
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ verified: false, error: "Invalid token" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is working! Only verification now.");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});