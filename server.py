import json, logging, re
from http.server import BaseHTTPRequestHandler, HTTPServer
from urllib.parse import unquote
# DB SERVER:
import psycopg2

# read in password from private.txt
with open('private.txt', 'r') as f:
    password = f.read()    

class Database:
    def __init__(self):
        self.conn = psycopg2.connect(
            dbname="material_data",
            user="wastefull",
            password=password,
            host="localhost"
        )
        self.conn.autocommit = True

    def search_materials(self, query):
        with self.conn.cursor() as cur:
            # Search by name, alternate name, or tag
            cur.execute("""
                SELECT DISTINCT m.id, m.name, m.description
                FROM materials m
                LEFT JOIN alternate_names an ON m.id = an.material_id
                LEFT JOIN materials_tags mt ON m.id = mt.material_id
                LEFT JOIN tags t ON mt.tag_id = t.id
                WHERE LOWER(m.name) = LOWER(%s)
                   OR LOWER(an.name) = LOWER(%s)
                   OR LOWER(t.name) = LOWER(%s)
            """, (query, query, query))
            return cur.fetchone()

    def get_articles(self, material_id):
        with self.conn.cursor() as cur:
            cur.execute("""
                SELECT type, content FROM articles
                WHERE material_id = %s
            """, (material_id,))
            return {row[0]: row[1] for row in cur.fetchall()}
    def add_material(self, name, description):
        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO materials (name, description)
                VALUES (%s, %s) RETURNING id
            """, (name, description))
            return cur.fetchone()[0]  # Return the new species ID

    def insert_article(self, material_id, article_type, content):
        with self.conn.cursor() as cur:
            cur.execute("""
                INSERT INTO articles (material_id, type, content)
                VALUES (%s, %s, %s)
            """, (material_id, article_type, content))

# API SERVER:
class HTTPRequestHandler(BaseHTTPRequestHandler):
    response = 404
    content_type = 'application/json'
    error_content_type = 'application/json'
    request_id = None
    content = None
    db = Database()
    
    def respond(self):
        self.send_response(self.response)
        self.send_header('Content-Type', self.content_type)
        self.end_headers()
        if self.content is not None:
            print(f"Response: {self.response}")
            print(f"Content: {self.content}")
            self.wfile.write(json.dumps(self.content).encode('utf-8'))

    # def do_POST(self):
    #     if re.search('/api/post/*', self.path):
    #         id = self.path.split('/')[-1]
    #         length = int(self.headers['Content-Length'])
    #         self.response = 200
    #         LocalData.stuff[id] = self.rfile.read(length).decode('utf-8')
    #     else:
    #         self.response = 403
    #     self.respond()
    #     self.end_headers()
    def do_POST(self):
        if re.search('/api/post/thing/', self.path):
            name = self.path.split('/')[-1]
            length = int(self.headers['Content-Length'])
            body = self.rfile.read(length).decode('utf-8')
            description = body  # Assuming description comes from the request body
            try:
                material_id = self.db.add_material(name, description)
                self.response = 201
                self.content = {"message": "Material created", "id": material_id}
            except Exception as e:
                self.response = 500
                self.content = {"error": str(e)}
        elif re.search('/api/post/article/', self.path):
            # Example POST to add an article to a species
            material_id = self.path.split('/')[-2]
            article_type = self.path.split('/')[-1]
            length = int(self.headers['Content-Length'])
            body = self.rfile.read(length).decode('utf-8')
            try:
                self.db.insert_article(material_id, article_type, body)
                self.response = 201
                self.content = {"message": f"{article_type.capitalize()} article created"}
            except Exception as e:
                self.response = 500
                self.content = {"error": str(e)}
        else:
            self.response = 403
            self.content = {"error": "Invalid endpoint"}
        self.respond()

    def do_GET(self):
        if self.path.startswith("/api/get/"):
            search_term = self.path.split("/")[-1]
            materials = self.db.search_materials(search_term)
            if materials:
                material_id, name, desc = materials
                articles = self.db.get_articles(material_id)
                self.response = 200
                self.content = {
                    "id": material_id,
                    "name": name,
                    "description": desc,
                    "articles": articles
                }
            else:
                self.response = 404
                self.content = {"error": "Material not found"}
        else:
            self.response = 403
            self.content = {"error": "Invalid endpoint"}
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