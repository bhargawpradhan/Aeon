package advanced

import (
	"math"
	"runtime"
	"sync/atomic"
	"time"
)

// ServerMetrics stores real-time statistics about the server.
type ServerMetrics struct {
	TotalRequests  uint64  `json:"total_requests"`
	SuccessCount   uint64  `json:"success_count"`
	ErrorCount     uint64  `json:"error_count"`
	ActiveRequests int32   `json:"active_requests"`
	AverageLatency float64 `json:"average_latency"` // in milliseconds
	RequestsPerSec float64 `json:"requests_per_sec"`
	UptimeSeconds  float64 `json:"uptime_seconds"`
	HealthStatus   string  `json:"health_status"`

	// Extreme Advancement: System Metrics
	CPUPct           float64 `json:"cpu_pct"`
	MemoryMB         float64 `json:"memory_mb"`
	Goroutines       int     `json:"goroutines"`
	ConcurrencyLimit int32   `json:"concurrency_limit"`

	// v6.0 Singularity Stats
	AnomalyScore float64 `json:"anomaly_score"`
	RiskScore    float64 `json:"risk_score"`
	ChaosLevel   float64 `json:"chaos_level"`
	SignalPulse  float64 `json:"signal_pulse"` // Artificial pulse for mesh sync

	// v13.0 Aeon Protocol (Kernel-Depth)
	HeapObjects uint64 `json:"heap_objects"`
	StackUsage  uint64 `json:"stack_usage"`
	GCCount     uint32 `json:"gc_count"`
	NumCPUs     int    `json:"num_cpus"`

	// v10.0 Absolute Singularity
	FractalDepth int32   `json:"fractal_depth"`
	DNAHealth    float64 `json:"dna_health"`
	Generation   int     `json:"generation"`
	SystemTemp   float64 `json:"system_temp"`

	// v9.0 Transcendent Omni-Engine
	Cluster []*ClusterNode    `json:"cluster"`
	Spatial InfluenceSnapshot `json:"spatial"`

	// v11.0 Omega Protocol
	ShatterState  bool `json:"shatter_state"`
	OverloadState bool `json:"overload_state"`
	EvolveState   bool `json:"evolve_state"`
	BlackoutState bool `json:"blackout_state"`

	// Internal tracking
	startTime        time.Time
	lastRequestCount uint64
	lastCheckTime    time.Time
}

type InfluenceSnapshot struct {
	X       float64 `json:"x"`
	Y       float64 `json:"y"`
	Gravity float64 `json:"gravity"`
}

var (
	GlobalMetrics = &ServerMetrics{
		startTime:     time.Now(),
		lastCheckTime: time.Now(),
	}
	totalDuration uint64 // total duration in microseconds
)

// RecordRequest tracks a completed request.
func (m *ServerMetrics) RecordRequest(duration time.Duration, isError bool) {
	atomic.AddUint64(&m.TotalRequests, 1)
	if isError {
		atomic.AddUint64(&m.ErrorCount, 1)
	} else {
		atomic.AddUint64(&m.SuccessCount, 1)
	}
	atomic.AddUint64(&totalDuration, uint64(duration.Microseconds()))
}

// UpdateStats calculates rates and averages (to be called periodically).
func (m *ServerMetrics) UpdateStats() {
	now := time.Now()
	elapsed := now.Sub(m.lastCheckTime).Seconds()
	if elapsed <= 0 {
		return
	}

	total := atomic.LoadUint64(&m.TotalRequests)
	diff := total - m.lastRequestCount
	m.RequestsPerSec = float64(diff) / elapsed

	if total > 0 {
		m.AverageLatency = float64(atomic.LoadUint64(&totalDuration)) / float64(total) / 1000.0
	}

	m.UptimeSeconds = now.Sub(m.startTime).Seconds()

	// Capture System Stats
	var ms runtime.MemStats
	runtime.ReadMemStats(&ms)
	m.MemoryMB = float64(ms.Alloc) / 1024 / 1024
	m.Goroutines = runtime.NumGoroutine()

	// Aeon Level 13 Kernel Sync
	m.HeapObjects = ms.HeapObjects
	m.StackUsage = ms.StackInuse
	m.GCCount = ms.NumGC
	m.NumCPUs = runtime.NumCPU()

	// Simulated CPU based on RPS for demo purposes (real CPU requires OS-specific calls or external library)
	m.CPUPct = (m.RequestsPerSec * 0.5) + (float64(m.Goroutines) * 0.1)
	if m.CPUPct > 100 {
		m.CPUPct = 99.9
	}

	// Determine health status
	m.HealthStatus = "HEALTHY"
	if m.AverageLatency > 150 || m.CPUPct > 80 {
		m.HealthStatus = "DEGRADED"
	}
	if m.RequestsPerSec > 0 && float64(atomic.LoadUint64(&m.ErrorCount))/float64(total) > 0.1 {
		m.HealthStatus = "CRITICAL"
	}

	m.lastRequestCount = total
	m.lastCheckTime = now

	// Trigger Anomaly Engine
	GlobalAnomaly.Update(m.RequestsPerSec, m.MemoryMB/100) // normalize mem
	m.AnomalyScore, m.RiskScore, m.ChaosLevel = GlobalAnomaly.GetStats()
	m.SignalPulse = math.Sin(float64(now.UnixNano()) / 1e9)

	// Level 10 System Triggering
	GlobalFractal.Update(m.RequestsPerSec, m.AnomalyScore)
	_, m.FractalDepth = GlobalFractal.GetState()

	dna, gen := GlobalDNA.GetDNA()
	m.DNAHealth = dna.FitnessScore
	m.Generation = gen

	// System Temp maps to Anomaly + RPS Pressure
	m.SystemTemp = (m.AnomalyScore * 0.7) + (m.RequestsPerSec / 50)
	if m.SystemTemp > 100 {
		m.SystemTemp = 100
	}

	m.Cluster = GlobalCluster.GetStatus()
	sx, sy, sg := GlobalSpatial.GetInfluence()
	m.Spatial = InfluenceSnapshot{X: sx, Y: sy, Gravity: sg}

	m.ShatterState = GlobalOmega.Shattered
	m.OverloadState = GlobalOmega.Overload
	m.EvolveState = GlobalOmega.Evolve
	m.BlackoutState = GlobalOmega.Blackout

	// Capture temporal snapshot
	GlobalTemporal.Push(*m)
}

// IncActive increments active request count.
func (m *ServerMetrics) IncActive() {
	atomic.AddInt32(&m.ActiveRequests, 1)
}

// DecActive decrements active request count.
func (m *ServerMetrics) DecActive() {
	atomic.AddInt32(&m.ActiveRequests, -1)
}
