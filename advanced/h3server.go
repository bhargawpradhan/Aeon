package advanced

import (
	"crypto/tls"
	"fmt"
	"net"
	"net/http"

	"github.com/bhargawpradhan/fasthttp"
	"github.com/quic-go/quic-go/http3"
)

// H3Server wraps fasthttp with HTTP/3 support using quic-go.
type H3Server struct {
	FasthttpServer *fasthttp.Server
	H3Server       *http3.Server
}

// handlerWrapper adapts fasthttp.RequestHandler to http.Handler
type handlerWrapper struct {
	handler fasthttp.RequestHandler
}

func (h *handlerWrapper) ServeHTTP(w http.ResponseWriter, r *http.Request) {
	// This is a minimal implementation for the demo.
	// A production-grade adapter would need to handle request/response conversions carefully.
	fmt.Fprintf(w, "HTTP/3 Response (Adapted from fasthttp)\n")
}

// ListenAndServeH3 runs the server on both TCP (HTTP/1.1) and UDP (HTTP/3).
func ListenAndServeH3(addr string, tlsConfig *tls.Config, handler fasthttp.RequestHandler) error {
	h3s := &http3.Server{
		Addr:      addr,
		Handler:   &handlerWrapper{handler: handler},
		TLSConfig: tlsConfig,
	}

	// Run H3 in background
	errChan := make(chan error, 1)
	go func() {
		errChan <- h3s.ListenAndServe()
	}()

	// Run H1 (fasthttp) in foreground
	s := &fasthttp.Server{
		Handler: handler,
	}

	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}
	tlsLn := tls.NewListener(ln, tlsConfig)

	fmt.Printf("Server listening on %s (H1/TCP and H3/UDP)\n", addr)
	
	err = s.Serve(tlsLn)
	if err != nil {
		return err
	}

	return <-errChan
}
