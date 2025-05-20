import logging
import json
import logging
import os
import threading
import time
from http.server import BaseHTTPRequestHandler, HTTPServer
from air_server import fetch
from neon import NeonConnect


class HTTPRequestHandler(BaseHTTPRequestHandler):
    response = 404
    content_type = 'application/json'
    error_content_type = 'application/json'
    request_id = None
    content = None

    def respond(self):
        self.send_response(self.response)
        self.send_header('Content-Type', self.content_type)
        self.end_headers()
        if self.content is not None:
            print(f"Response: {self.response}")
            print(f"Content: {self.content}")
            self.wfile.write(json.dumps(self.content).encode('utf-8'))

    def do_GET(self):
        if self.path.startswith("/article/"):
            article_id = self.path.split("/article/")[1]
            neon = NeonConnect()
            article = neon.fetch_article_by_id(article_id)
            if article:
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(article).encode())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'{"error": "Article not found"}')
            return
        if self.path == "/materials":
            try:
                neon = NeonConnect()
                data = neon.fetch_all_materials()
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(data).encode())
            except Exception as e:
                self.send_response(500)
                self.end_headers()
                self.wfile.write(json.dumps({"error": str(e)}).encode())
            return
        if self.path.startswith("/material/") and self.path.endswith("/articles"):
            # /material/{name}/articles
            material_name = self.path[len(
                "/material/"):-len("/articles")].strip("/").lower()
            neon = NeonConnect()
            materials = neon.fetch_all_materials()
            material = next(
                (m for m in materials if material_name in m.get(
                    "meta", {}).get("name", "").lower()),
                None
            )
            if material and "id" in material:
                articles = neon.fetch_articles_by_material_id(material["id"])
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(articles).encode())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'{"error": "Material not found"}')
            return
        if self.path.startswith("/material/"):
            material_name = self.path[len("/material/"):].lower()
            neon = NeonConnect()
            materials = neon.fetch_all_materials()
            result = next(
                (m for m in materials if material_name in m.get(
                    "meta", {}).get("name", "").lower()),
                None
            )
            if result:
                self.send_response(200)
                self.send_header("Content-type", "application/json")
                self.end_headers()
                self.wfile.write(json.dumps(result).encode())
            else:
                self.send_response(404)
                self.end_headers()
                self.wfile.write(b'{"error": "Material not found"}')
            return
        else:
            self.send_response(404)
            self.end_headers()


def periodic_sync(interval=3600):
    while True:
        print("Syncing Airtable → Neon...")
        try:
            fetch(refresh=True)
            print("Sync complete.")
        except Exception as e:
            print(f"Sync error: {e}")
        time.sleep(interval)


if __name__ == '__main__':
    port = int(os.environ.get('PORT', 8000))  # Use PORT env var if set
    logging.basicConfig(level=logging.INFO)
    server_address = ('', port)
    httpd = HTTPServer(server_address, HTTPRequestHandler)
    logging.info(f'Starting server on port {port}...')
    # Start background sync thread
    sync_thread = threading.Thread(
        target=periodic_sync, args=(3600,), daemon=True)
    sync_thread.start()
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping server...')
