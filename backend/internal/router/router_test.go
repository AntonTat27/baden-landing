package router

import (
	"encoding/json"
	"net/http/httptest"
	"path/filepath"
	"strings"
	"testing"

	"baden-backend/internal/model"
	"baden-backend/internal/storage"
)

func TestListingsCRUD(t *testing.T) {
	dir := t.TempDir()
	path := filepath.Join(dir, "listings.json")
	store, err := storage.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	h := New(Config{Store: store, UploadDir: dir, AdminUser: "admin", AdminPass: "pw"})

	do := func(method, url, body string, authed bool) *httptest.ResponseRecorder {
		r := httptest.NewRequest(method, url, strings.NewReader(body))
		if authed {
			r.SetBasicAuth("admin", "pw")
		}
		w := httptest.NewRecorder()
		h.ServeHTTP(w, r)
		return w
	}
	count := func() int {
		var l []model.Listing
		json.Unmarshal(do("GET", "/api/listings", "", false).Body.Bytes(), &l)
		return len(l)
	}

	seeded := count()
	if seeded != 5 {
		t.Fatalf("seed: got %d listings, want 5", seeded)
	}

	body := `{"name":{"en":"Sea House","ru":"Морской дом"},"image":"x.jpg","ownership":["full"],"entryFrom":1000,"prices":[1,1,1,1,1,1,1,1,1,1,1,1]}`
	if c := do("POST", "/api/listings", body, false).Code; c != 401 {
		t.Fatalf("unauthed create: %d, want 401", c)
	}
	if c := do("POST", "/api/listings", strings.Replace(body, `"full"`, `"rent"`, 1), true).Code; c != 400 {
		t.Fatalf("bad ownership: %d, want 400", c)
	}
	if c := do("POST", "/api/listings", body, true).Code; c != 201 {
		t.Fatalf("create: %d", c)
	}
	if c := do("POST", "/api/listings", body, true).Code; c != 409 {
		t.Fatalf("duplicate id: %d, want 409", c)
	}
	if count() != seeded+1 {
		t.Fatal("created listing not listed")
	}
	if c := do("PUT", "/api/listings/sea-house", strings.Replace(body, "1000", "2000", 1), true).Code; c != 200 {
		t.Fatalf("update: %d", c)
	}

	// Data survives a restart.
	reopened, err := storage.Open(path)
	if err != nil {
		t.Fatal(err)
	}
	list := reopened.List()
	if got := list[len(list)-1]; got.ID != "sea-house" || got.EntryFrom != 2000 {
		t.Fatalf("persisted listing = %s/%d, want sea-house/2000", got.ID, got.EntryFrom)
	}

	if c := do("DELETE", "/api/listings/sea-house", "", true).Code; c != 204 {
		t.Fatalf("delete: %d", c)
	}
	if c := do("DELETE", "/api/listings/sea-house", "", true).Code; c != 404 {
		t.Fatalf("delete missing: %d, want 404", c)
	}
	if count() != seeded {
		t.Fatal("deleted listing still listed")
	}
	if c := do("GET", "/admin", "", false).Code; c != 401 {
		t.Fatalf("admin page unauthed: %d, want 401", c)
	}
}
