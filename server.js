const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");

const app = express();
app.use(bodyParser.json());

// allow Netlify frontend to access backend
app.use(cors({
  origin: "https://your-frontend.netlify.app" // replace with your Netlify URL
}));

const CLIENT_ID = "934920299860-19m0i3jd9aqjg0a7cfis88ipie1nvls8.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

app.post("/verify-token", async (req, res) => {
  try {
    const { idToken } = req.body;

    const ticket = await client.verifyIdToken({
      idToken,
      audience: CLIENT_ID
    });

    const payload = ticket.getPayload();
    res.json(payload);
  } catch (err) {
    console.error(err);
    res.status(400).json({ error: "Invalid token" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is working!");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});