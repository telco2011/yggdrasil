 #!/bin/bash
shopt -s extglob
rm -rf ./lib/core/!(package.json|README.md|LICENSE) && rm -rf ./lib/data/!(package.json|README.md|LICENSE) && rm -rf ./lib/devs/!(package.json|README.md|LICENSE) && rm -rf ./lib/mvc/!(package.json|README.md|LICENSE) && rm -rf ./lib/security/!(package.json|README.md|LICENSE) && rm -rf ./lib/testing/!(package.json|README.md|LICENSE)