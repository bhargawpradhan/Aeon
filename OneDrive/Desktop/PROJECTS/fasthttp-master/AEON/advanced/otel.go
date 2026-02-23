package advanced

import (
	"context"

	"github.com/bhargawpradhan/fasthttp"
	"go.opentelemetry.io/otel"
	"go.opentelemetry.io/otel/attribute"
	"go.opentelemetry.io/otel/trace"
)

var tracer = otel.Tracer("fasthttp-advanced")

// OTelMiddleware adds OpenTelemetry tracing to the request.
func OTelMiddleware(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	return func(ctx *fasthttp.RequestCtx) {
		ctxName := string(ctx.Path())
		if ctxName == "" {
			ctxName = "HTTP " + string(ctx.Method())
		}

		spanCtx, span := tracer.Start(context.Background(), ctxName,
			trace.WithAttributes(
				attribute.String("http.method", string(ctx.Method())),
				attribute.String("http.url", string(ctx.RequestURI())),
				attribute.String("http.host", string(ctx.Host())),
				attribute.String("net.peer.ip", ctx.RemoteIP().String()),
			),
		)
		defer span.End()

		// Store span in UserValue for downstream access if needed
		ctx.SetUserValue("otel_span", span)
		ctx.SetUserValue("otel_context", spanCtx)

		next(ctx)

		span.SetAttributes(attribute.Int("http.status_code", ctx.Response.StatusCode()))
	}
}
