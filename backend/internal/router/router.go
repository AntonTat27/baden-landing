// Package router wires URLs to handlers.
package router

import (
	"net/http"

	"baden-backend/internal/handler"
	"baden-backend/internal/middleware"
	"baden-backend/internal/storage"
)

type Config struct {
	Store     *storage.Store
	UploadDir string
	AdminUser string
	AdminPass string
}

func New(cfg Config) http.Handler {
	listings := &handler.Listings{Store: cfg.Store}
	uploads := &handler.Uploads{Dir: cfg.UploadDir}
	admin := middleware.BasicAuth(cfg.AdminUser, cfg.AdminPass)

	mux := http.NewServeMux()

	// Public
	mux.HandleFunc("GET /api/listings", listings.List)
	mux.Handle("GET /uploads/", http.StripPrefix("/uploads/", http.FileServer(http.Dir(cfg.UploadDir))))

	// Admin
	mux.Handle("GET /admin", admin(http.HandlerFunc(handler.Admin)))
	mux.Handle("POST /api/listings", admin(http.HandlerFunc(listings.Create)))
	mux.Handle("PUT /api/listings/{id}", admin(http.HandlerFunc(listings.Update)))
	mux.Handle("DELETE /api/listings/{id}", admin(http.HandlerFunc(listings.Delete)))
	mux.Handle("POST /api/uploads", admin(http.HandlerFunc(uploads.Create)))

	return mux
}
