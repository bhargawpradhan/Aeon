package advanced

import (
	"github.com/bhargawpradhan/fasthttp"
)

// Middleware is a function that wraps a fasthttp.RequestHandler.
type Middleware func(fasthttp.RequestHandler) fasthttp.RequestHandler

// Chain represents a pre-compiled middleware chain.
type Chain struct {
	middlewares []Middleware
}

// NewChain creates a new middleware chain.
func NewChain(m ...Middleware) Chain {
	return Chain{middlewares: m}
}

// Then wraps the final handler with the middleware chain.
// It pre-compiles the chain to maximize performance during request handling.
func (c Chain) Then(handler fasthttp.RequestHandler) fasthttp.RequestHandler {
	if handler == nil {
		handler = func(ctx *fasthttp.RequestCtx) {}
	}

	for i := len(c.middlewares) - 1; i >= 0; i-- {
		handler = c.middlewares[i](handler)
	}

	return handler
}

// Append returns a new chain with the given middlewares appended.
func (c Chain) Append(m ...Middleware) Chain {
	newMWs := make([]Middleware, 0, len(c.middlewares)+len(m))
	newMWs = append(newMWs, c.middlewares...)
	newMWs = append(newMWs, m...)
	return Chain{middlewares: newMWs}
}
