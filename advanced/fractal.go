package advanced

import (
	"sync"
	"sync/atomic"
)

// FractalNode represents a virtual sharded handler node
type FractalNode struct {
	ID     int     `json:"id"`
	Depth  int     `json:"depth"`
	Health float64 `json:"health"`
	Load   float64 `json:"load"`
	Active bool    `json:"active"`
}

type FractalEngine struct {
	sync.RWMutex
	nodes []FractalNode
	depth int32
}

var GlobalFractal = &FractalEngine{
	nodes: make([]FractalNode, 0, 16),
}

func (f *FractalEngine) Update(rps float64, anomaly float64) {
	f.Lock()
	defer f.Unlock()

	// Calculate Depth: High load and anomaly causes bifurcation
	newDepth := int32(0)
	if rps > 100 || anomaly > 40 {
		newDepth = 1
	}
	if rps > 500 || anomaly > 70 {
		newDepth = 2
	}
	if rps > 2000 {
		newDepth = 3
	}

	atomic.StoreInt32(&f.depth, newDepth)

	// Rebuild Node Topology based on depth
	nodeCount := 1 << uint(newDepth) // 1, 2, 4, 8
	f.nodes = make([]FractalNode, nodeCount)
	for i := 0; i < nodeCount; i++ {
		f.nodes[i] = FractalNode{
			ID:     i,
			Depth:  int(newDepth),
			Health: 100 - (anomaly * (1.0 + float64(i)*0.05)),
			Load:   rps / float64(nodeCount),
			Active: true,
		}
	}
}

func (f *FractalEngine) GetState() ([]FractalNode, int32) {
	f.RLock()
	defer f.RUnlock()
	return f.nodes, atomic.LoadInt32(&f.depth)
}
