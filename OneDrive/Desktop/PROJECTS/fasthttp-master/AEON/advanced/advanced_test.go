package advanced

import (
	"testing"
	"github.com/bhargawpradhan/fasthttp"
)

func TestMiddlewareChain(t *testing.T) {
	var callCount int
	mw := func(next fasthttp.RequestHandler) fasthttp.RequestHandler {
		return func(ctx *fasthttp.RequestCtx) {
			callCount++
			next(ctx)
		}
	}

	chain := NewChain(mw, mw)
	handler := chain.Then(func(ctx *fasthttp.RequestCtx) {})

	handler(&fasthttp.RequestCtx{})

	if callCount != 2 {
		t.Errorf("Expected 2 middleware calls, got %d", callCount)
	}
}

func TestRateLimiter(t *testing.T) {
	rl := NewRateLimiter(10, 1) // 10 per sec, cap 1
	
	if !rl.Allow() {
		t.Error("First request should be allowed")
	}
	
	if rl.Allow() {
		t.Error("Second request should be blocked (capacity 1)")
	}
}
