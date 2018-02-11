 #!/bin/bash
EXCLUDED_FILES="package.json|README.md|LICENSE"
MODULES=(core mvc security data devs testing)

for MODUL in "${MODULES[@]}"
do
	shopt -s extglob
	f="./lib/$MODUL/!($EXCLUDED_FILES)"
	rm -rf $f
done