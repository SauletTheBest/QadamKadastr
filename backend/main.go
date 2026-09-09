package main

import (
	"database/sql"
	"encoding/json"
	"fmt"
	"log"
	"net/http"
	"os"
	"strings"

	"github.com/joho/godotenv"
	_ "github.com/lib/pq"
	"qadamkadastr/models"
)

var db *sql.DB

func initDB() (*sql.DB, error) {
	_ = godotenv.Load()

	// Prevent lib/pq error on unsupported PGCHANNELBINDING
	os.Unsetenv("PGCHANNELBINDING")

	connStr := os.Getenv("DATABASE_URL")
	if connStr == "" {
		host := os.Getenv("PGHOST")
		user := os.Getenv("PGUSER")
		password := os.Getenv("PGPASSWORD")
		dbname := os.Getenv("PGDATABASE")
		sslmode := os.Getenv("PGSSLMODE")
		if sslmode == "" {
			sslmode = "require"
		}
		connStr = fmt.Sprintf("host=%s user=%s password=%s dbname=%s sslmode=%s",
			host, user, password, dbname, sslmode)
	}

	database, err := sql.Open("postgres", connStr)
	if err != nil {
		return nil, fmt.Errorf("error opening database: %w", err)
	}

	if err := database.Ping(); err != nil {
		return nil, fmt.Errorf("cannot ping database: %w", err)
	}

	// Read and execute seed.sql to ensure table and 20 bilingual records exist
	seedSQL, err := os.ReadFile("data/seed.sql")
	if err == nil {
		if _, err := database.Exec(string(seedSQL)); err != nil {
			log.Printf("⚠️ Note executing seed.sql: %v", err)
		} else {
			fmt.Println("🌱 Database schema and 20 parcels synchronized successfully!")
		}
	} else {
		log.Printf("⚠️ seed.sql not found at data/seed.sql: %v", err)
	}

	return database, nil
}

func corsMiddleware(next http.Handler) http.Handler {
	return http.HandlerFunc(func(w http.ResponseWriter, r *http.Request) {
		w.Header().Set("Access-Control-Allow-Origin", "*")
		w.Header().Set("Access-Control-Allow-Methods", "GET, POST, OPTIONS")
		w.Header().Set("Access-Control-Allow-Headers", "Content-Type")

		if r.Method == http.MethodOptions {
			w.WriteHeader(http.StatusOK)
			return
		}

		next.ServeHTTP(w, r)
	})
}

func handleGetParcels(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "application/json")

	queryParam := strings.ToLower(strings.TrimSpace(r.URL.Query().Get("q")))

	var rows *sql.Rows
	var err error

	if queryParam != "" {
		searchPattern := "%" + queryParam + "%"
		rows, err = db.Query(`
			SELECT id, cadastral_number, address_kz, address_ru, area, purpose_kz, purpose_ru, status_kz, status_ru, coordinates 
			FROM parcels 
			WHERE LOWER(cadastral_number) LIKE $1 
			   OR LOWER(address_kz) LIKE $1 
			   OR LOWER(address_ru) LIKE $1
			ORDER BY id ASC;
		`, searchPattern)
	} else {
		rows, err = db.Query(`
			SELECT id, cadastral_number, address_kz, address_ru, area, purpose_kz, purpose_ru, status_kz, status_ru, coordinates 
			FROM parcels 
			ORDER BY id ASC;
		`)
	}

	if err != nil {
		http.Error(w, `{"error":"Database query failed"}`, http.StatusInternalServerError)
		log.Printf("Query error: %v", err)
		return
	}
	defer rows.Close()

	parcels := []models.Parcel{}
	for rows.Next() {
		var p models.Parcel
		var coordsRaw []byte

		if err := rows.Scan(
			&p.ID,
			&p.CadastralNumber,
			&p.AddressKZ,
			&p.AddressRU,
			&p.Area,
			&p.PurposeKZ,
			&p.PurposeRU,
			&p.StatusKZ,
			&p.StatusRU,
			&coordsRaw,
		); err != nil {
			log.Printf("Scan error: %v", err)
			continue
		}

		_ = json.Unmarshal(coordsRaw, &p.Coordinates)
		parcels = append(parcels, p)
	}

	json.NewEncoder(w).Encode(parcels)
}

func main() {
	var err error
	db, err = initDB()
	if err != nil {
		log.Fatalf("❌ Database connection error: %v", err)
	}
	defer db.Close()

	fmt.Println("✅ Successfully connected to Neon PostgreSQL!")

	mux := http.NewServeMux()
	mux.HandleFunc("GET /api/parcels", handleGetParcels)
	mux.HandleFunc("GET /api/health", func(w http.ResponseWriter, r *http.Request) {
		w.WriteHeader(http.StatusOK)
		w.Write([]byte(`{"status":"healthy","database":"connected"}`))
	})

	handler := corsMiddleware(mux)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Printf("🚀 Server running on http://localhost:%s\n", port)
	log.Fatal(http.ListenAndServe(":"+port, handler))
}
