import json, logging, re
from http.server import BaseHTTPRequestHandler, HTTPServer

class LocalData(object):
    stuff={
        "1": "hello",
    }

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

    def do_POST(self):
        if re.search('/api/post/*', self.path):
            id = self.path.split('/')[-1]
            length = int(self.headers['Content-Length'])
            self.response = 200
            LocalData.stuff[id] = self.rfile.read(length).decode('utf-8')
        else:
            self.response = 403
        self.respond()
        self.end_headers()

    def do_GET(self):
        if re.search('/api/get/*', self.path):
            record_id = self.path.split('/')[-1]
            if record_id in LocalData.stuff:
                print("okay")
                print(f"GET request for record ID: {record_id}")
                
                self.response = 200
                self.content = LocalData.stuff[record_id]
                
            else:
                self.response = 200
                self.content = "nice one, dude"
            self.respond()
            self.end_headers()
        
if __name__ == '__main__':
    logging.basicConfig(level=logging.INFO)
    server_address = ('', 8000)
    httpd = HTTPServer(server_address, HTTPRequestHandler)
    logging.info('Starting server on port 8000...')
    LocalData.records = {}
    try:
        httpd.serve_forever()
    except KeyboardInterrupt:
        pass
    httpd.server_close()
    logging.info('Stopping server...')