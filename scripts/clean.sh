 #!/bin/bash
shopt -s extglob
rm -rf ./lib/core/!(package.json) && rm -rf ./lib/data/!(package.json) && rm -rf ./lib/devs/!(package.json) && rm -rf ./lib/mvc/!(package.json) && rm -rf ./lib/security/!(package.json) && rm -rf ./lib/testing/!(package.json)