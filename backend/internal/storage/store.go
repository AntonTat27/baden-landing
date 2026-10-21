// Package storage persists listings.
package storage

import (
	_ "embed"
	"encoding/json"
	"errors"
	"os"
	"sync"

	"baden-backend/internal/model"
)

//go:embed seed.json
var seed []byte

var (
	ErrNotFound = errors.New("listing not found")
	ErrExists   = errors.New("a listing with this id already exists")
)

// Store keeps all listings in memory and writes the whole set to a JSON file on change.
// ponytail: whole-file JSON under one mutex; move to SQLite if listings reach thousands or need concurrent writers.
type Store struct {
	mu   sync.RWMutex
	path string
	list []model.Listing
}

// Open loads listings from path, seeding it with the original listings on first run.
func Open(path string) (*Store, error) {
	s := &Store{path: path}
	b, err := os.ReadFile(path)
	if errors.Is(err, os.ErrNotExist) {
		b = seed
	} else if err != nil {
		return nil, err
	}
	if err := json.Unmarshal(b, &s.list); err != nil {
		return nil, err
	}
	return s, s.save()
}

func (s *Store) List() []model.Listing {
	s.mu.RLock()
	defer s.mu.RUnlock()
	return append([]model.Listing(nil), s.list...)
}

func (s *Store) Create(l model.Listing) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	if s.index(l.ID) >= 0 {
		return ErrExists
	}
	return s.commit(append(append([]model.Listing(nil), s.list...), l))
}

// Update replaces the listing with the given id; l.ID may differ (rename).
func (s *Store) Update(id string, l model.Listing) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	i := s.index(id)
	if i < 0 {
		return ErrNotFound
	}
	if j := s.index(l.ID); j >= 0 && j != i {
		return ErrExists
	}
	next := append([]model.Listing(nil), s.list...)
	next[i] = l
	return s.commit(next)
}

func (s *Store) Delete(id string) error {
	s.mu.Lock()
	defer s.mu.Unlock()
	i := s.index(id)
	if i < 0 {
		return ErrNotFound
	}
	return s.commit(append(append([]model.Listing(nil), s.list[:i]...), s.list[i+1:]...))
}

// commit persists next and only then makes it current, so a failed write changes nothing.
func (s *Store) commit(next []model.Listing) error {
	old := s.list
	s.list = next
	if err := s.save(); err != nil {
		s.list = old
		return err
	}
	return nil
}

// save writes to a temp file then renames, so a crash mid-write can't corrupt the data.
func (s *Store) save() error {
	b, err := json.MarshalIndent(s.list, "", "  ")
	if err != nil {
		return err
	}
	tmp := s.path + ".tmp"
	if err := os.WriteFile(tmp, b, 0o644); err != nil {
		return err
	}
	return os.Rename(tmp, s.path)
}

func (s *Store) index(id string) int {
	for i, l := range s.list {
		if l.ID == id {
			return i
		}
	}
	return -1
}
