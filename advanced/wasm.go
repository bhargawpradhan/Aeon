package advanced

import (
	"context"
	"os"

	"github.com/bhargawpradhan/fasthttp"
	"github.com/tetratelabs/wazero"
	"github.com/tetratelabs/wazero/api"
)

// WASMPlugin represents a loaded WASM plugin.
type WASMPlugin struct {
	runtime wazero.Runtime
	mod     api.Module
}

// LoadWASMPlugin loads a WASM file as a plugin.
func LoadWASMPlugin(ctx context.Context, path string) (*WASMPlugin, error) {
	data, err := os.ReadFile(path)
	if err != nil {
		return nil, err
	}

	r := wazero.NewRuntime(ctx)
	
	mod, err := r.Instantiate(ctx, data)
	if err != nil {
		return nil, err
	}

	return &WASMPlugin{runtime: r, mod: mod}, nil
}

// WASMMiddleware creates a middleware that executes a function in the WASM plugin.
// The function "authorize" in WASM is expected to return 1 for allowed, 0 for denied.
func (p *WASMPlugin) WASMMiddleware(next fasthttp.RequestHandler) fasthttp.RequestHandler {
	authFunc := p.mod.ExportedFunction("authorize")
	if authFunc == nil {
		return next // Fallback if function not found
	}

	return func(ctx *fasthttp.RequestCtx) {
		// Simple implementation: pass path length to WASM
		// A full implementation would pass the entire request data via shared memory
		res, err := authFunc.Call(context.Background(), uint64(len(ctx.Path())))
		if err != nil || len(res) == 0 || res[0] == 0 {
			ctx.Error("Denied by WASM Plugin", fasthttp.StatusForbidden)
			return
		}
		next(ctx)
	}
}

// Close releases WASM resources.
func (p *WASMPlugin) Close(ctx context.Context) error {
	return p.runtime.Close(ctx)
}
