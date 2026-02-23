package advanced

import (
	"sync"
)

// SpatialInfluence stores the mouse-linked force field parameters
type SpatialInfluence struct {
	sync.RWMutex
	MouseX  float64 `json:"x"`
	MouseY  float64 `json:"y"`
	Gravity float64 `json:"gravity"`
}

var GlobalSpatial = &SpatialInfluence{
	Gravity: 1.0,
}

// UpdateInfluence sets the current spatial coordinates
func (s *SpatialInfluence) UpdateInfluence(x, y float64) {
	s.Lock()
	defer s.Unlock()
	s.MouseX = x
	s.MouseY = y
}

// GetInfluence returns the spatial data for scheduling weights
func (s *SpatialInfluence) GetInfluence() (float64, float64, float64) {
	s.RLock()
	defer s.RUnlock()
	return s.MouseX, s.MouseY, s.Gravity
}
