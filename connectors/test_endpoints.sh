#!/bin/bash
# filepath: /Users/natto/db/test_endpoints.sh

BASE_URL="http://localhost:8000"

echo "🧪 Testing Material Cluster Endpoints..."

echo -e "\n📊 Cluster Statistics:"
curl -s "$BASE_URL/clusters/stats" | jq '.'

echo -e "\n🧱 Plastic Materials:"
curl -s "$BASE_URL/materials/cluster/plastic" | jq 'length'

echo -e "\n📄 Paper Materials:"
curl -s "$BASE_URL/materials/cluster/paper" | jq 'length'

echo -e "\n⚙️ Metal Materials:"
curl -s "$BASE_URL/materials/cluster/metal" | jq 'length'

echo -e "\n💻 Electronics Materials:"
curl -s "$BASE_URL/materials/cluster/electronics" | jq 'length'

echo -e "\n🌱 Organic Materials:"
curl -s "$BASE_URL/materials/cluster/organic" | jq 'length'

echo -e "\n✅ All tests complete!"