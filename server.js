const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const { OAuth2Client } = require("google-auth-library");
const { createClient } = require("@supabase/supabase-js");

const app = express();
app.use(bodyParser.json());

app.use(cors({
  origin: "https://leavstyles.netlify.app" // replace with your Netlify domain
}));

// Google OAuth client
const CLIENT_ID = "934920299860-19m0i3jd9aqjg0a7cfis88ipie1nvls8.apps.googleusercontent.com";
const client = new OAuth2Client(CLIENT_ID);

// Supabase client
const SUPABASE_URL = "https://twqiguaoperbqdzevzes.supabase.co";
const SUPABASE_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3cWlndWFvcGVyYnFkemV2emVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTUwNDQsImV4cCI6MjA3MTMzMTA0NH0.hCXJ-TLFPfKn8ueHO-GPtKi1DZatdmkxN1RhRdlXCAA";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

// Verify Google token + store user
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

    // Insert or update user in Supabase
    const { data, error } = await supabase
      .from("users")
      .upsert(
        [
          {
            google_id: sub,
            email,
            name,
            picture
          }
        ],
        { onConflict: "google_id" }
      )
      .select(); // return inserted/updated row

    if (error) throw error;

    // ✅ Send back verified status to frontend
    res.json({
      verified: true,
      user: {
        id: sub,
        email,
        name,
        picture
      }
    });

  } catch (err) {
    console.error(err);
    res.status(400).json({ verified: false, error: "Invalid token or Supabase error" });
  }
});

app.get("/", (req, res) => {
  res.send("Backend is working! dont worry");
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});