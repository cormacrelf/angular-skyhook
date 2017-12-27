pkg="angular-hovercraft"

function usage () {
  echo "usage: $0 [--serve] [--serve-only] [--no-examples] [--port <default is 8080>]"
}

SERVE=0
SERVE_ONLY=0
EXAMPLES=1
PORT=8080

while [ "$1" != "" ]; do
    case $1 in
        -h | --help)
            usage
            exit
            ;;
        --serve)
            SERVE=1
            ;;
        --serve-only)
            SERVE_ONLY=1
            ;;
        --no-examples)
            EXAMPLES=0
            ;;
        --port)
            PORT=$2
            shift
            ;;
        *)
            echo "ERROR: unknown parameter \"$1\""
            usage
            exit 1
            ;;
    esac
    shift
done


function grunt_nohoist () {
  echo "moving stuff"
  mkdir -p ./packages/custom-typedoc-theme/node_modules/
  find "node_modules/" -maxdepth 1 -type d -name "grunt*" \
    -exec mv {} ./packages/custom-typedoc-theme/node_modules \; # 1>&2 2>/dev/null
  return 0
}

function make_examples_md () {
  # massive hack
  # - delete before and after the lines on which <body> and </body> appear
  # - then delete all but between the tags
  < packages/examples/dist/index.html \
    sed -n '/<body>/,/<\/body>/p' \
    | sed -e '1s/.*<body>//' -e '$s/<\/body>.*//' \
    > docs/Examples.md
}

if [[ $SERVE_ONLY == "1" ]]; then
  echo "serving ./out-docs/ on http://localhost:$PORT"
  (cd out-docs && python -m http.server $PORT)
  exit
fi

PLACEHOLDER=$(cat <<EOF
### placeholder, will be replaced by examples app if run without \`--no-examples\`
EOF
)

if [[ $EXAMPLES == 1 ]]; then
  yarn \
  && grunt_nohoist \
  && rm -rf out-docs \
  && (cd packages/custom-typedoc-theme && yarn run build) \
  && (cd packages/examples && yarn run docs) \
  && make_examples_md \
  && (cd packages/$pkg && yarn run docs) \
  && mv packages/$pkg/out-docs . \
  && mv packages/examples/dist ./out-docs/examples \
  && echo "built successfully"
else
  yarn \
  && grunt_nohoist \
  && rm -rf out-docs \
  && (cd packages/custom-typedoc-theme && yarn run build) \
  && echo "$PLACEHOLDER" > docs/Examples.md \
  && (cd packages/$pkg && yarn run docs) \
  && mv packages/$pkg/out-docs . \
  && echo "built successfully"
fi

if [[ $? ]]; then
  if [[ $SERVE == "1" ]]; then
    echo "serving ./out-docs/ on http://localhost:$PORT"
    (cd out-docs && python -m http.server $PORT)
  fi
else
  echo "failed :("
fi

