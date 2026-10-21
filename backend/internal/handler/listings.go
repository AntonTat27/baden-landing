// Package handler holds the HTTP handlers.
package handler

import (
	"encoding/json"
	"errors"
	"net/http"

	"baden-backend/internal/model"
	"baden-backend/internal/storage"
)

type Listings struct {
	Store *storage.Store
}

// List is public; the landing page fetches it cross-origin.
func (h *Listings) List(w http.ResponseWriter, r *http.Request) {
	w.Header().Set("Access-Control-Allow-Origin", "*")
	writeJSON(w, http.StatusOK, h.Store.List())
}

func (h *Listings) Create(w http.ResponseWriter, r *http.Request) {
	l, ok := decodeListing(w, r)
	if !ok {
		return
	}
	if err := h.Store.Create(l); err != nil {
		writeStoreError(w, err)
		return
	}
	writeJSON(w, http.StatusCreated, l)
}

func (h *Listings) Update(w http.ResponseWriter, r *http.Request) {
	l, ok := decodeListing(w, r)
	if !ok {
		return
	}
	if err := h.Store.Update(r.PathValue("id"), l); err != nil {
		writeStoreError(w, err)
		return
	}
	writeJSON(w, http.StatusOK, l)
}

func (h *Listings) Delete(w http.ResponseWriter, r *http.Request) {
	if err := h.Store.Delete(r.PathValue("id")); err != nil {
		writeStoreError(w, err)
		return
	}
	w.WriteHeader(http.StatusNoContent)
}

func decodeListing(w http.ResponseWriter, r *http.Request) (model.Listing, bool) {
	var l model.Listing
	if err := json.NewDecoder(http.MaxBytesReader(w, r.Body, 1<<20)).Decode(&l); err != nil {
		http.Error(w, "invalid JSON: "+err.Error(), http.StatusBadRequest)
		return l, false
	}
	if err := l.Validate(); err != nil {
		http.Error(w, err.Error(), http.StatusBadRequest)
		return l, false
	}
	return l, true
}

func writeStoreError(w http.ResponseWriter, err error) {
	switch {
	case errors.Is(err, storage.ErrNotFound):
		http.Error(w, err.Error(), http.StatusNotFound)
	case errors.Is(err, storage.ErrExists):
		http.Error(w, err.Error(), http.StatusConflict)
	default:
		http.Error(w, err.Error(), http.StatusInternalServerError)
	}
}

func writeJSON(w http.ResponseWriter, code int, v any) {
	w.Header().Set("Content-Type", "application/json")
	w.WriteHeader(code)
	json.NewEncoder(w).Encode(v)
}
