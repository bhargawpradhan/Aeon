package advanced

import (
	"bufio"
	"encoding/json"
	"fmt"
	"time"

	"github.com/bhargawpradhan/fasthttp"
)

// MetricsStreamerHandler handles SSE connections for metrics streaming.
func MetricsStreamerHandler(ctx *fasthttp.RequestCtx) {
	ctx.SetContentType("text/event-stream")
	ctx.Response.Header.Set("Cache-Control", "no-cache")
	ctx.Response.Header.Set("Connection", "keep-alive")
	ctx.Response.Header.Set("Transfer-Encoding", "chunked")
	ctx.Response.Header.Set("Access-Control-Allow-Origin", "*")
	ctx.Response.Header.Set("X-Content-Type-Options", "nosniff")

	ctx.SetBodyStreamWriter(func(w *bufio.Writer) {
		ticker := time.NewTicker(250 * time.Millisecond) // Throttled for absolute stability
		defer ticker.Stop()

		for range ticker.C {
			GlobalMetrics.UpdateStats()
			data, err := json.Marshal(GlobalMetrics)
			if err != nil {
				continue
			}

			fmt.Fprintf(w, "data: %s\n\n", data)
			w.Flush() // Force immediate delivery to browser
		}
	})
}

// MetricsMiddleware tracks every request in the global metrics collector.
func MetricsMiddleware(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(ctx *fasthttp.RequestCtx) {
		GlobalMetrics.IncActive()
		start := time.Now()

		defer func() {
			duration := time.Since(start)
			isError := ctx.Response.StatusCode() >= 400
			GlobalMetrics.RecordRequest(duration, isError)
			GlobalMetrics.DecActive()
		}()

		next(ctx)
	}
}
