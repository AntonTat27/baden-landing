package handler

import (
	"bytes"
	"crypto/rand"
	"encoding/hex"
	"io"
	"net/http"
	"os"
	"path/filepath"
)

const maxUploadBytes = 15 << 20

var imageExt = map[string]string{"image/jpeg": ".jpg", "image/png": ".png", "image/webp": ".webp", "image/gif": ".gif"}

type Uploads struct {
	Dir string
}

// Create stores an image under a random name and returns its server-relative URL.
func (h *Uploads) Create(w http.ResponseWriter, r *http.Request) {
	r.Body = http.MaxBytesReader(w, r.Body, maxUploadBytes)
	f, _, err := r.FormFile("file")
	if err != nil {
		http.Error(w, "file is required (max 15 MB)", http.StatusBadRequest)
		return
	}
	defer f.Close()

	// Trust the bytes, not the client's filename or Content-Type.
	head := make([]byte, 512)
	n, _ := io.ReadFull(f, head)
	ext, ok := imageExt[http.DetectContentType(head[:n])]
	if !ok {
		http.Error(w, "only JPEG, PNG, WebP or GIF images", http.StatusBadRequest)
		return
	}

	rnd := make([]byte, 12)
	rand.Read(rnd)
	name := hex.EncodeToString(rnd) + ext
	out, err := os.Create(filepath.Join(h.Dir, name))
	if err != nil {
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	defer out.Close()
	if _, err := io.Copy(out, io.MultiReader(bytes.NewReader(head[:n]), f)); err != nil {
		os.Remove(out.Name())
		http.Error(w, err.Error(), http.StatusInternalServerError)
		return
	}
	writeJSON(w, http.StatusCreated, map[string]string{"url": "/uploads/" + name})
}
