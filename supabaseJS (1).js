// supabaseClient.js
// supabaseClient.js
// Make sure this file is included as <script type="module" src="supabaseClient.js"></script>

const { createClient } = await import(
  "https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2/+esm"
);

const supabaseUrl = "https://jtimdeudmkeffendjczz.supabase.co";
const supabaseKey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Imp0aW1kZXVkbWtlZmZlbmRqY3p6Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjMzMTYxNzQsImV4cCI6MjA3ODg5MjE3NH0.6cqsAzO8DvnjIvg4Urb6Ld1W2xe3FBI8s2yvFMdwox8";

export const supabase = createClient(supabaseUrl, supabaseKey);