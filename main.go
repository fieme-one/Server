package main

import (
	"context"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"

	"github.com/joho/godotenv"
	"github.com/nedpals/supabase-go"
	"google.golang.org/api/idtoken"
)

type VerifyRequest struct {
	IdToken string `json:"idToken"`
}

type User struct {
	GoogleID string `json:"google_id"`
	Email    string `json:"email"`
	Name     string `json:"name"`
	Picture  string `json:"picture"`
}

func main() {
	// Load env vars from .env if exists
	_ = godotenv.Load()

	PORT := os.Getenv("PORT")
	if PORT == "" {
		PORT = "3000"
	}

	CLIENT_ID := "934920299860-19m0i3jd9aqjg0a7cfis88ipie1nvls8.apps.googleusercontent.com"
	SUPABASE_URL := "https://twqiguaoperbqdzevzes.supabase.co"
	SUPABASE_KEY := "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InR3cWlndWFvcGVyYnFkemV2emVzIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTU3NTUwNDQsImV4cCI6MjA3MTMzMTA0NH0.hCXJ-TLFPfKn8ueHO-GPtKi1DZatdmkxN1RhRdlXCAA"

	// Init Supabase client
	supa := supabase.CreateClient(SUPABASE_URL, SUPABASE_KEY)

	http.HandleFunc("/", func(w http.ResponseWriter, r *http.Request) {
		fmt.Fprintln(w, "Backend is working! (Go version 🚀)")
	})

	http.HandleFunc("/verify-token", func(w http.ResponseWriter, r *http.Request) {
		if r.Method != "POST" {
			http.Error(w, "Only POST allowed", http.StatusMethodNotAllowed)
			return
		}

		var req VerifyRequest
		if err := json.NewDecoder(r.Body).Decode(&req); err != nil {
			http.Error(w, "Invalid request", http.StatusBadRequest)
			return
		}

		// Verify Google token
		payload, err := idtoken.Validate(context.Background(), req.IdToken, CLIENT_ID)
		if err != nil {
			http.Error(w, "Invalid token", http.StatusUnauthorized)
			return
		}

		// Extract user info
		sub := payload.Claims["sub"].(string)
		email := payload.Claims["email"].(string)
		name := payload.Claims["name"].(string)
		picture := payload.Claims["picture"].(string)

		user := User{
			GoogleID: sub,
			Email:    email,
			Name:     name,
			Picture:  picture,
		}

		// Upsert into Supabase
		_, err = supa.DB.From("users").Upsert(user, "google_id", "", "").Execute()
		if err != nil {
			http.Error(w, "Supabase error: "+err.Error(), http.StatusInternalServerError)
			return
		}

		// Return success JSON
		resp := map[string]interface{}{
			"verified": true,
			"user":     user,
		}
		json.NewEncoder(w).Encode(resp)
	})

	log.Printf("Server running on port %s", PORT)
	log.Fatal(http.ListenAndServe(":"+PORT, nil))
}