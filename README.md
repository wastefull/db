# App

Wastefull is creating a tool to allow anyone in the world to look up a material or common consumer product and assess its potential for reuse, recycling, and compost potential. This tool will include state of the art techniques, experimental methods, as well as health and hazard concerns with the material and these methods. Limitations in being able to prevent the material from going to landfill will be outlined to better position future research to revisit and even overcome these limitations. Data will be collected by volunteers and fact checked. Entries will be regularly reviewed for scientific currency and accuracy. Biological techniques discussed include bioremediation through fungi and bacterial culturing, the use of selected invertebrate species, bioremediation horticulture, and genetic modification techniques. Regenerative soil science is the backbone of the wastefull philosophy, with the end goal for any compost or bioremediation technique to create healthy soil that can cycle and sequester carbon and other key resources.

# Development

## First time setup

Install npm packages

```bash
npm install
```

## Development server

To start a local development server, run the following from /app:

```bash
ng serve
```

Once the server is running, open your browser and navigate to `http://localhost:4200/`. The application will automatically reload whenever you modify any of the source files.

## Connect to DB

Start the database service with:

```bash
sudo service postgresql start
```

on Mac:

```bash
brew services start postgresql@14
```

Run the following command to connect to the database:

```bash
psql -U wastefull -d material_data -h localhost
```

quit the PSQL shell with:

```bash
\q
```

# Deployment

## Building

To build the project run the following while authenticated and in the /connectors directory:

```bash
gcloud run deploy wdb-middleware \
    --image us-docker.pkg.dev/wastefull-db/my-repo/wdb-middleware \
    --platform managed \
    --region us-central1 \
    --allow-unauthenticated \
    --update-secrets AIRTABLE_API_KEY=projects/251769284793/secrets/AIRTABLE_API_KEY:latest \
    --set-env-vars AIRTABLE_BASE_ID=app35YvKXrBhupoeN,AIRTABLE_TABLE=Materials \
    --update-secrets POSTGRES_URI=projects/251769284793/secrets/POSTGRES_URI:latest
```

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

## Columns

The following are required fields for any entry in the database:

1.  id (integer)
2.  name (string)
3.  alt_names (string list)
4.  tags (string list)
5.  composting_article (string/markdown)
6.  recycling_article (string/markdown)
7.  reuse_article (string/markdown)
8.  health_risks_article (string/markdown)

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
