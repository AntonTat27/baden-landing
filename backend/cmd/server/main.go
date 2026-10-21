// Command server runs the Baden listings API and admin panel.
//
//	ADMIN_PASSWORD=secret go run ./cmd/server
package main

import (
	"log"
	"net/http"
	"os"
	"path/filepath"

	"baden-backend/internal/router"
	"baden-backend/internal/storage"
)

func main() {
	pass := os.Getenv("ADMIN_PASSWORD")
	if pass == "" {
		log.Fatal("ADMIN_PASSWORD must be set")
	}
	dataDir := env("DATA_DIR", "data")
	uploadDir := filepath.Join(dataDir, "uploads")
	if err := os.MkdirAll(uploadDir, 0o755); err != nil {
		log.Fatal(err)
	}

	store, err := storage.Open(filepath.Join(dataDir, "listings.json"))
	if err != nil {
		log.Fatal(err)
	}

	h := router.New(router.Config{
		Store:     store,
		UploadDir: uploadDir,
		AdminUser: env("ADMIN_USER", "admin"),
		AdminPass: pass,
	})

	addr := env("ADDR", ":8080")
	log.Printf("listening on %s, admin at /admin", addr)
	log.Fatal(http.ListenAndServe(addr, h))
}

func env(key, def string) string {
	if v := os.Getenv(key); v != "" {
		return v
	}
	return def
}
