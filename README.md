# App
Wastefull is creating a tool to allow anyone in the world to look up a material or common consumer product and assess its potential for reuse, recycling, and compost potential. This tool will include state of the art techniques, experimental methods, as well as health and hazard concerns with the material and these methods. Limitations in being able to prevent the material from going to landfill will be outlined to better position future research to revisit and even overcome these limitations.  Data will be collected by volunteers and fact checked. Entries will be regularly reviewed for scientific currency and accuracy.  Biological techniques discussed include bioremediation through fungi and bacterial culturing, the use of selected invertebrate species, bioremediation horticulture, and genetic modification techniques. Regenerative soil science is the backbone of the wastefull philosophy, with the end goal for any compost or bioremediation technique to create healthy soil that can cycle and sequester carbon and other key resources.

# Development

## Development server

To start a local development server, run:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Connect to DB

Start the database service with:

```bash
sudo service postgresql start
```

Run the following command to connect to the database:

```bash
psql -U wastefull -d material_data -h localhost
```

quit the PSQL shell with:
```bash
\q
```

## DB structure

Tables:
1. materials
2. alternate_names
3. tags
4. species_tags (join table)
5. articles

```sql
CREATE TABLE materials (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE,
    description TEXT,  -- optional longform markdown summary, if needed
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE TABLE alternate_names (
    id SERIAL PRIMARY KEY,
    material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    name TEXT NOT NULL
);

CREATE TABLE tags (
    id SERIAL PRIMARY KEY,
    name TEXT NOT NULL UNIQUE
);

CREATE TABLE materials_tags (
    material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    tag_id INTEGER NOT NULL REFERENCES tags(id) ON DELETE CASCADE,
    PRIMARY KEY (material_id, tag_id)
);

CREATE TABLE articles (
    id SERIAL PRIMARY KEY,
    material_id INTEGER NOT NULL REFERENCES materials(id) ON DELETE CASCADE,
    type TEXT CHECK (type IN (‘recycle’, ‘compost’, ‘renew’, 'hazards')),
    content TEXT NOT NULL,  -- markdown content
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    UNIQUE (material_id, type)  -- ensures only one of each type per material
);

```

### Test POST
```bash
curl -X POST http://localhost:8000/api/post/thing/Crimson%20Nightcrawler -d "A nocturnal gecko engineered for low-light environments"
```
# Deployment
## Building

To build the project run:

```bash
ng build
```

This will compile your project and store the build artifacts in the `dist/` directory. By default, the production build optimizes your application for performance and speed.

## Running unit tests

To execute unit tests with the [Karma](https://karma-runner.github.io) test runner, use the following command:

```bash
ng test
```

## Running end-to-end tests

For end-to-end (e2e) testing, run:

```bash
ng e2e
```

An end-to-end testing framework has to be chosen.

# Mindset
Our dataset has to be well-formatted in order for anyone, including ourselves, to make good use of it.

To keep things consistent, we need to make sure that each entry has the same rows as any other. This can be messy when dealing with the real world, as there may be many linked considerations between any given material and all of its options for disposal, decomposition, reuse, controversy, etc., but it's critical that we keep to this format in order to provide a useful tool for households, businesses, and other scientists studying bioremediation-oriented waste management techniques.

Columns
--
The following are required fields for any entry in the database:

 1. id (integer)
 2. name (string)
 3. alt_names (string list)
 4. tags (string list)
 5. composting_article (string/markdown)
 6. recycling_article (string/markdown)
 7. reuse_article (string/markdown)
 8. health_risks_article (string/markdown)

### Definitions:
- `1` will be assigned sequentially as entries are made, starting with id 1.
- `2` will be the common name for the material or product.
- `3` will list any common alternative names, with the default value being equal to whatever `2` was.
- `4` will list tags that may aid in finding the entry during search, with the default first tag being equal to `2`
- `5`-`8` are the entire text of the associated articles, in Markdown.

### Discussion Encouraged
Shoving large bodies of text into individual rows isn't ideal, so suggestions as to how to better structure these data are highly welcome, especially earlier on when it is easiest to reformat existing data. For now we begin with the simplest solution that will let us get started.

Wastefull Inc. researches new ways to think about and manage waste materials and common consumer goods by leveraging emerging methodologies in a diverse range of disciplines, with a heavy focus on integration of waste into soil remediation using fungi and other microbiota. 

Projects include a waste lifecycle database; community-accessible approaches to PFAS/PFOA and microplastics remediation; use and limitations of arthropods for household waste management; innovative textiles made from waste; and much more. 

Wastefull encourages the participation of community members, from artists, to scientists, to creative children and their parents. Diversity is a foundational principle in both biology and complex systems, and diverse perspectives will be needed to work on the complex problem of how human communities leverage their waste to build a sustainable and robust society.
