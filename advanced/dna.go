package advanced

import (
	"math/rand"
	"sync"
	"time"
)

// DNA represents the "genetic instructions" of the server engine
type DNA struct {
	TargetLatency   time.Duration `json:"target_latency"`
	ConcurrencyStep int32         `json:"concurrency_step"`
	ChaosThreshold  float64       `json:"chaos_threshold"`
	EvolutionRate   float64       `json:"evolution_rate"`
	FitnessScore    float64       `json:"fitness_score"`

	// Level 11 Omega Genes
	ReplicationAggression float64 `json:"replication_aggression"`
	BifurcationThreshold  float64 `json:"bifurcation_threshold"`
	ShatterThreshold      float64 `json:"shatter_threshold"`
}

type GeneticEngine struct {
	sync.RWMutex
	currentDNA DNA
	generation int
}

var GlobalDNA = &GeneticEngine{
	currentDNA: DNA{
		TargetLatency:   10 * time.Millisecond,
		ConcurrencyStep: 1,
		ChaosThreshold:  50.0,
		EvolutionRate:   0.1,
		// Omega Protocol Overrides
		ReplicationAggression: 0.5,
		BifurcationThreshold:  70.0,
		ShatterThreshold:      90.0,
	},
}

func init() {
	go GlobalDNA.EvolveLoop()
}

func (g *GeneticEngine) EvolveLoop() {
	ticker := time.NewTicker(30 * time.Second)
	for range ticker.C {
		// Level 13: Seed randomizer with real system jitter (Entropy Harvesting)
		rand.Seed(time.Now().UnixNano())
		g.Evolve()
	}
}

func (g *GeneticEngine) Evolve() {
	g.Lock()
	defer g.Unlock()

	g.generation++

	// Calculate Fitness: Lower latency and higher RPS = higher fitness
	// This is a simplified fitness function for simulation
	metrics := GlobalMetrics
	fitness := (100 / (metrics.AverageLatency + 1)) * (metrics.RequestsPerSec / 100)
	g.currentDNA.FitnessScore = fitness

	// Mutate "Genes" based on evolution rate
	if rand.Float64() < g.currentDNA.EvolutionRate {
		// Mutate Target Latency
		g.currentDNA.TargetLatency += time.Duration(rand.Intn(5)-2) * time.Millisecond
		if g.currentDNA.TargetLatency < 1*time.Millisecond {
			g.currentDNA.TargetLatency = 1 * time.Millisecond
		}

		// Mutate Chaos Threshold
		g.currentDNA.ChaosThreshold += (rand.Float64() * 10) - 5
		if g.currentDNA.ChaosThreshold < 0 {
			g.currentDNA.ChaosThreshold = 0
		}
		if g.currentDNA.ChaosThreshold > 100 {
			g.currentDNA.ChaosThreshold = 100
		}
	}
}

func (g *GeneticEngine) GetDNA() (DNA, int) {
	g.RLock()
	defer g.RUnlock()
	return g.currentDNA, g.generation
}

func (g *GeneticEngine) SetGene(key string, val float64) {
	g.Lock()
	defer g.Unlock()
	switch key {
	case "limit_step":
		g.currentDNA.ConcurrencyStep = int32(val)
	case "chaos_target":
		g.currentDNA.ChaosThreshold = val
	case "evolution":
		g.currentDNA.EvolutionRate = val
	case "replication":
		g.currentDNA.ReplicationAggression = val
	case "bifurcation":
		g.currentDNA.BifurcationThreshold = val
	case "shatter":
		g.currentDNA.ShatterThreshold = val
	}
}
