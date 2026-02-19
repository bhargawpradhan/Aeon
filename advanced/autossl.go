package advanced

import (
	"crypto/tls"
	"net"

	"github.com/bhargawpradhan/fasthttp"
	"golang.org/x/crypto/acme/autocert"
)

// ListenAndServeAutoSSL provides a one-line way to run a server with Let's Encrypt support.
func ListenAndServeAutoSSL(addr string, domains []string, handler fasthttp.RequestHandler) error {
	m := &autocert.Manager{
		Prompt:     autocert.AcceptTOS,
		HostPolicy: autocert.HostWhitelist(domains...),
		Cache:      autocert.DirCache("./certs"),
	}

	ln, err := net.Listen("tcp", addr)
	if err != nil {
		return err
	}

	tlsConfig := m.TLSConfig()
	tlsLn := tls.NewListener(ln, tlsConfig)

	return fasthttp.Serve(tlsLn, handler)
}
