package handler

import (
	_ "embed"
	"net/http"
)

//go:embed admin.html
var adminHTML []byte

// Admin serves the single-page admin panel.
func Admin(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Content-Type", "text/html; charset=utf-8")
	w.Write(adminHTML)
}
