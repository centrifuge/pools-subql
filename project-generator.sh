#!/bin/sh
cat > subquery-multichain.yaml <<"EOF"
specVersion: 1.0.0
query:
  name: '@subql/query'
  version: '2'
projects:
  - project-centrifuge.yaml
EOF

yq ". *=d load(\"chains-cfg/${CHAIN_ID}.yaml\")" chains-cfg/_root.yaml > project-centrifuge.yaml

subdirs=$(find chains-evm -mindepth 1 -maxdepth 1 -type d)
for subdir in $subdirs; do
    if [ -e "$subdir/${CHAIN_ID}.yaml" ]; then
      echo "Generating EVM config for ${subdir##*/}"
      yq ". *=d load(\"$subdir/${CHAIN_ID}.yaml\")" chains-evm/_root.yaml > project-${subdir##*/}.yaml
      echo "  - project-${subdir##*/}.yaml" >> subquery-multichain.yaml
    fi
done