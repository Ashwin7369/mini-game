import http.server
import socketserver
import os
import sys

# Default port
PORT = 8000
DIRECTORY = os.path.dirname(os.path.abspath(__file__))

class Handler(http.server.SimpleHTTPRequestHandler):
    def __init__(self, *args, **kwargs):
        super().__init__(*args, directory=DIRECTORY, **kwargs)

    def log_message(self, format, *args):
        # Optional: Suppress or format logging here
        super().log_message(format, *args)

def run_server():
    with socketserver.TCPServer(("", PORT), Handler) as httpd:
        print(f"Server started ✨")
        print(f"Open your browser and navigate to: http://localhost:{PORT}")
        print("Press Ctrl+C to stop the server.")
        try:
            httpd.serve_forever()
        except KeyboardInterrupt:
            print("\nShutting down the server...")
        finally:
            httpd.server_close()

if __name__ == "__main__":
    run_server()
