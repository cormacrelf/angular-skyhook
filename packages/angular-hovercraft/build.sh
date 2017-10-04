rm -rf build
rm -rf dist

NGC="node node_modules/.bin/ngc"
ROLLUP="node node_modules/.bin/rollup"

$NGC -p src/tsconfig-build.json
$ROLLUP -c -o dist/angular-hovercraft.js

$NGC -p src/tsconfig-build-es5.json
$ROLLUP -c --options.input="build/angular-hovercraft.es5.js"\
  -o dist/angular-hovercraft.es5.js

rsync -a --exclude="*.js" build/ dist

cp src/package.json dist/package.json
