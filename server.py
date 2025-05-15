import json
import logging
import re
from http.server import BaseHTTPRequestHandler, HTTPServer
from time import sleep
from urllib.parse import unquote
from air_server import fetch
from helpers import read_json

# read in password from private.txt
with open('./private.txt', 'r') as f:
    password = f.read()

# API SERVER:


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
        if self.path.startswith("/material/"):
            search_term = self.path.split("/")[-1]  # ignore for now
            fetch(refresh=True)
            materials = read_json("data.json")
            if materials:
                self.response = 200
                self.content = materials
            else:
                self.response = 404
                self.content = {"error": "Material not found"}
        else:
            self.response = 403
            self.content = {"error": f"Invalid endpoint: {self.path}"}
        self.respond()


if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, HTTPRequestHandler)
    logging.info('Starting server on port 8000...')
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping server...')
