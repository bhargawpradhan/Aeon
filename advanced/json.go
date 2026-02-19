package advanced

import (
	"github.com/bhargawpradhan/fasthttp"
	"github.com/bytedance/sonic"
)

// JSONResponse sends a JSON response using the high-performance Sonic library.
func JSONResponse(ctx *fasthttp.RequestCtx, statusCode int, data interface{}) error {
	ctx.SetContentType("application/json")
	ctx.SetStatusCode(statusCode)
	
	encoder := sonic.ConfigDefault.NewEncoder(ctx)
	return encoder.Encode(data)
}

// ParseJSON parses a JSON request body into the given interface using Sonic.
func ParseJSON(ctx *fasthttp.RequestCtx, v interface{}) error {
	return sonic.Unmarshal(ctx.PostBody(), v)
}

// JSONMiddleware is a middleware that ensures the response is JSON.
func JSONMiddleware(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(ctx *fasthttp.RequestCtx) {
		ctx.SetContentType("application/json")
		next(ctx)
	}
}
