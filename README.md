# App

Wastefull is creating a tool to allow anyone in the world to look up a material or common consumer product and assess its potential for reuse, recycling, and compost potential. This tool will include state of the art techniques, experimental methods, as well as health and hazard concerns with the material and these methods. Limitations in being able to prevent the material from going to landfill will be outlined to better position future research to revisit and even overcome these limitations. Data will be collected by volunteers and fact checked. Entries will be regularly reviewed for scientific currency and accuracy. Biological techniques discussed include bioremediation through fungi and bacterial culturing, the use of selected invertebrate species, bioremediation horticulture, and genetic modification techniques. Regenerative soil science is the backbone of the wastefull philosophy, with the end goal for any compost or bioremediation technique to create healthy soil that can cycle and sequester carbon and other key resources.

# Development

# Build ng app

```bash
ng build --configuration production --base-href=/
```

# Serve ng app static over :4200

```bash
npx serve -s dist/app/browser -l 4200
```

# Run API server

```bash
cd connectors
source .venv/bin/activate
python3 server.py
```
