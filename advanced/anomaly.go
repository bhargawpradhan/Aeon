package advanced

import (
	"math"
	"sync"
	"time"

	"github.com/bhargawpradhan/fasthttp"
)

// AnomalyEngine handles baseline learning and risk prediction
type AnomalyEngine struct {
	sync.RWMutex
	baselineRPS  float64
	anomalyScore float64
	riskFactor   float64
	chaosFactor  float64 // Controlled via frontend

	// History for trend analysis
	history []float64
}

var GlobalAnomaly = &AnomalyEngine{
	history: make([]float64, 0, 100),
}

// Update calculates the current anomaly and risk scores
func (e *AnomalyEngine) Update(currentRPS float64, memoryPressure float64) {
	e.Lock()
	defer e.Unlock()

	// Simple EMA for baseline learning
	if e.baselineRPS == 0 {
		e.baselineRPS = currentRPS
	} else {
		e.baselineRPS = (e.baselineRPS * 0.95) + (currentRPS * 0.05)
	}

	// Calculate Anomaly Score (deviation from baseline)
	deviation := math.Abs(currentRPS - e.baselineRPS)
	e.anomalyScore = (deviation / (e.baselineRPS + 1)) * 100

	// Predictive Risk: Analysis of acceleration
	e.history = append(e.history, currentRPS)
	if len(e.history) > 10 {
		e.history = e.history[1:]
	}

	acceleration := 0.0
	if len(e.history) >= 2 {
		acceleration = e.history[len(e.history)-1] - e.history[0]
	}

	// Risk Factor is a combination of acceleration, mem pressure, and chaos
	e.riskFactor = (acceleration * 0.5) + (memoryPressure * 0.3) + (e.chaosFactor * 0.2)
	if e.riskFactor < 0 {
		e.riskFactor = 0
	}
}

// SetChaos modifies the chaos intensity
func (e *AnomalyEngine) SetChaos(factor float64) {
	e.Lock()
	e.chaosFactor = factor
	e.Unlock()
}

// GetStats returns metrics for the SSE stream
func (e *AnomalyEngine) GetStats() (float64, float64, float64) {
	e.RLock()
	defer e.RUnlock()
	return e.anomalyScore, e.riskFactor, e.chaosFactor
}

// NewChaosMiddleware injects artificial latency and errors
func NewChaosMiddleware() Middleware {
	return func(handler fasthttp.RequestHandler) fasthttp.RequestHandler {
		return func(ctx *fasthttp.RequestCtx) {
			_, _, chaos := GlobalAnomaly.GetStats()

			if chaos > 0 {
				// Inject Latency
				delay := time.Duration(chaos) * time.Millisecond
				time.Sleep(delay)

				// Inject Errors (Higher risk as chaos increases)
				if float64(time.Now().UnixNano()%100) < (chaos / 2) {
					ctx.Error("Neural Synapse Failure (Chaos Injection)", 503)
					return
				}
			}

			handler(ctx)
		}
	}
}
