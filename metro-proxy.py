#!/usr/bin/env python3
"""
Metro Proxy: Buffers Metro HTTP responses and sends them with Content-Length
instead of Transfer-Encoding: chunked. This fixes OkHttp "unexpected end of stream"
errors through the ADB reverse tunnel on WSL2/Windows.

Usage:
  Start Metro on port 8082:  npx expo start --dev-client --port 8082
  Run this proxy on port 8081: python3 metro-proxy.py
  ADB reverse: adb reverse tcp:8081 tcp:8081 (already set)
"""

import http.server
import urllib.request
import urllib.error
import sys

METRO_PORT = 8082

class MetroProxy(http.server.BaseHTTPRequestHandler):
    def proxy_request(self, method, body=None):
        url = f'http://127.0.0.1:{METRO_PORT}{self.path}'
        headers = {k: v for k, v in self.headers.items()
                   if k.lower() not in ('host', 'content-length')}
        if body:
            headers['Content-Length'] = str(len(body))

        try:
            req = urllib.request.Request(url, data=body, headers=headers, method=method)
            with urllib.request.urlopen(req, timeout=60) as resp:
                data = resp.read()
                status = resp.status
                resp_headers = {k: v for k, v in resp.headers.items()
                                if k.lower() not in ('transfer-encoding', 'content-length', 'connection', 'keep-alive')}

                self.send_response(status)
                for k, v in resp_headers.items():
                    self.send_header(k, v)
                self.send_header('Content-Length', str(len(data)))
                self.send_header('Connection', 'close')
                self.end_headers()
                self.wfile.write(data)
        except urllib.error.HTTPError as e:
            data = e.read()
            self.send_response(e.code)
            self.send_header('Content-Length', str(len(data)))
            self.send_header('Connection', 'close')
            self.end_headers()
            self.wfile.write(data)
        except Exception as e:
            msg = str(e).encode()
            self.send_response(502)
            self.send_header('Content-Length', str(len(msg)))
            self.send_header('Connection', 'close')
            self.end_headers()
            self.wfile.write(msg)

    def do_GET(self):
        self.proxy_request('GET')

    def do_POST(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length) if length else None
        self.proxy_request('POST', body)

    def do_PUT(self):
        length = int(self.headers.get('Content-Length', 0))
        body = self.rfile.read(length) if length else None
        self.proxy_request('PUT', body)

    def do_DELETE(self):
        self.proxy_request('DELETE')

    def log_message(self, format, *args):
        print(f'[proxy] {self.path} → {args[1] if len(args) > 1 else "?"}')

if __name__ == '__main__':
    port = int(sys.argv[1]) if len(sys.argv) > 1 else 8081
    print(f'Metro proxy listening on :{port} → Metro on :{METRO_PORT}')
    with http.server.HTTPServer(('', port), MetroProxy) as server:
        server.serve_forever()
