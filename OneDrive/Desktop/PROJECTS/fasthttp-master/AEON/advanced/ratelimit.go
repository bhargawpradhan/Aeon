package advanced

import (
	"sync"
	"time"

	"github.com/bhargawpradhan/fasthttp"
)

// RateLimiter implements a token bucket rate limiting algorithm.
type RateLimiter struct {
	rate       float64
	capacity   float64
	tokens     float64
	lastUpdate time.Time
	mu         sync.Mutex
}

// NewRateLimiter creates a new rate limiter.
// rate is tokens per second, capacity is the maximum burst size.
func NewRateLimiter(rate, capacity float64) *RateLimiter {
	return &RateLimiter{
		rate:       rate,
		capacity:   capacity,
		tokens:     capacity,
		lastUpdate: time.Now(),
	}
}

// Allow checks if a request is allowed by the rate limiter.
func (rl *RateLimiter) Allow() bool {
	rl.mu.Lock()
	defer rl.mu.Unlock()

	now := time.Now()
	elapsed := now.Sub(rl.lastUpdate).Seconds()
	rl.tokens += elapsed * rl.rate
	if rl.tokens > rl.capacity {
		rl.tokens = rl.capacity
	}
	rl.lastUpdate = now

	if rl.tokens >= 1 {
		rl.tokens--
		return true
	}
	return false
}

// RateLimitMiddleware creates a middleware that limits requests.
func RateLimitMiddleware(rl *RateLimiter) Middleware {
	return func(next fasthttp.RequestHandler) fasthttp.RequestHandler {
		return func(ctx *fasthttp.RequestCtx) {
			if !rl.Allow() {
				ctx.Error("Too Many Requests", fasthttp.StatusTooManyRequests)
				return
			}
			next(ctx)
		}
	}
}
