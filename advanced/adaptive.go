package advanced

import (
	"sync/atomic"
	"time"

	"github.com/bhargawpradhan/fasthttp"
)

// AdaptiveLimiter implements a concurrency limiter that adjusts based on latency.
type AdaptiveLimiter struct {
	limit       int32
	inflight    int32
	minLimit    int32
	maxLimit    int32
	targetDelay time.Duration
}

// NewAdaptiveLimiter creates a new adaptive concurrency limiter.
func NewAdaptiveLimiter(min, max int32, targetDelay time.Duration) *AdaptiveLimiter {
	return &AdaptiveLimiter{
		limit:       min,
		minLimit:    min,
		maxLimit:    max,
		targetDelay: targetDelay,
	}
}

// Acquire attempts to acquire a slot in the concurrency limiter.
func (al *AdaptiveLimiter) Acquire() bool {
	inflight := atomic.AddInt32(&al.inflight, 1)
	if inflight > atomic.LoadInt32(&al.limit) {
		atomic.AddInt32(&al.inflight, -1)
		return false
	}
	return true
}

// Release releases a slot and updates the limit based on observed latency.
func (al *AdaptiveLimiter) Release(duration time.Duration) {
	atomic.AddInt32(&al.inflight, -1)

	// Simple AIMD-like logic for limit adjustment
	currentLimit := atomic.LoadInt32(&al.limit)
	newLimit := currentLimit
	if duration <= al.targetDelay {
		if currentLimit < al.maxLimit {
			newLimit = currentLimit + 1
			atomic.CompareAndSwapInt32(&al.limit, currentLimit, newLimit)
		}
	} else {
		if currentLimit > al.minLimit {
			newLimit = currentLimit - 1
			atomic.CompareAndSwapInt32(&al.limit, currentLimit, newLimit)
		}
	}
	atomic.StoreInt32(&GlobalMetrics.ConcurrencyLimit, newLimit)
}

// AdaptiveMiddleware wraps a handler with adaptive concurrency limiting.
func AdaptiveMiddleware(al *AdaptiveLimiter) Middleware {
	return func(next fasthttp.RequestHandler) fasthttp.RequestHandler {
		return func(ctx *fasthttp.RequestCtx) {
			if !al.Acquire() {
				ctx.Error("Service Unavailable - Too Busy", fasthttp.StatusServiceUnavailable)
				return
			}
			start := time.Now()
			defer func() {
				al.Release(time.Since(start))
			}()
			next(ctx)
		}
	}
}
