// Package model holds the domain types shared by storage and handlers.
package model

import (
	"errors"
	"fmt"
	"regexp"
	"strings"
)

// I18n is a string in both site languages.
type I18n struct {
	Ru string `json:"ru"`
	En string `json:"en"`
}

// Listing mirrors a unit in baden-landing/src/data/units.js.
type Listing struct {
	ID        string   `json:"id"`
	Name      I18n     `json:"name"`
	Type      I18n     `json:"type"`
	Bedrooms  int      `json:"bedrooms"`
	Size      string   `json:"size"`
	Guests    string   `json:"guests"`
	Location  I18n     `json:"location"`
	Image     string   `json:"image"`
	Ownership []string `json:"ownership"`
	EntryFrom int      `json:"entryFrom"`
	Prices    []int    `json:"prices"`
	Blurb     I18n     `json:"blurb"`
}

var (
	slugRe      = regexp.MustCompile(`^[a-z0-9]+(-[a-z0-9]+)*$`)
	nonSlugRe   = regexp.MustCompile(`[^a-z0-9]+`)
	ownershipOK = map[string]bool{"full": true, "fractional": true, "timeshare": true}
)

// Validate checks required fields, deriving ID from the English name when empty.
func (l *Listing) Validate() error {
	if l.ID == "" {
		l.ID = strings.Trim(nonSlugRe.ReplaceAllString(strings.ToLower(l.Name.En), "-"), "-")
	}
	switch {
	case !slugRe.MatchString(l.ID):
		return errors.New("id must be a lowercase slug (a-z, 0-9, dashes)")
	case l.Name.En == "" || l.Name.Ru == "":
		return errors.New("name (ru and en) is required")
	case l.Image == "":
		return errors.New("image is required")
	case len(l.Ownership) == 0:
		return errors.New("at least one ownership model is required")
	case len(l.Prices) != 12:
		return errors.New("prices must have 12 monthly values")
	case l.EntryFrom <= 0:
		return errors.New("entryFrom must be positive")
	}
	for _, o := range l.Ownership {
		if !ownershipOK[o] {
			return fmt.Errorf("unknown ownership model %q", o)
		}
	}
	return nil
}
