RUN_ENTR=$1

COMMAND="yarn run typedoc --out ../../out-docs --exclude '**/{internal,utils,node_modules}/**/*' --options typedoc.json --theme ../custom-typedoc-theme/bin/default --includes ../../docs --readme ../../README.md --tsconfig ./tsconfig.json ./src/"

if [[ "$RUN_ENTR" == "--watch" ]]; then
  rg --files docs packages/angular-hovercraft/src | entr $COMMAND
else
  $COMMAND
fi


