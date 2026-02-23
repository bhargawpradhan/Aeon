package advanced

import (
	"github.com/bhargawpradhan/fasthttp"
)

// CORSMiddleware handles Cross-Origin Resource Sharing.
func CORSMiddleware(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(ctx *fasthttp.RequestCtx) {
		ctx.Response.Header.Set("Access-Control-Allow-Origin", "*")
		ctx.Response.Header.Set("Access-Control-Allow-Methods", "GET, POST, PUT, DELETE, OPTIONS")
		ctx.Response.Header.Set("Access-Control-Allow-Headers", "Content-Type, Authorization")
		ctx.Response.Header.Set("Access-Control-Max-Age", "3600")

		if ctx.IsOptions() {
			ctx.SetStatusCode(fasthttp.StatusNoContent)
			return
		}

		next(ctx)
	}
}
