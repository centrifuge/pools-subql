#!/bin/sh
cat > subquery-multichain.yaml <<"EOF"
specVersion: 1.0.0
query:
  name: '@subql/query'
  version: '2'
projects:
  - project-centrifuge.yaml
EOF

#CFG
merge-yaml -i ./chains-cfg/_root.yaml ./chains-cfg/${CHAIN_ID}.yaml -o ./project-centrifuge.yaml

#EVM Chains
subdirs=$(find chains-evm -mindepth 1 -maxdepth 1 -type d)
for subdir in $subdirs; do
    if [ -e "$subdir/${CHAIN_ID}.yaml" ]; then
      echo "Generating EVM config for ${subdir##*/}"
      merge-yaml -i ./$subdir/${CHAIN_ID}.yaml ./chains-evm/_root.yaml -o ./project-${subdir##*/}.yaml
      echo "  - project-${subdir##*/}.yaml" >> subquery-multichain.yaml
    fi
done

#TINLAKE
if [ -e "chains-tinlake/${CHAIN_ID}.yaml" ]; then
  echo "Generating Tinlake config for"
  merge-yaml -i ./chains-tinlake/${CHAIN_ID}.yaml -o ./project-tinlake.yaml
  echo "  - project-tinlake.yaml" >> subquery-multichain.yaml
fi