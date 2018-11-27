#!/bin/bash

usage () {
  echo "usage: $0 [--full] [--fast] [--serve] [--serve-only] [--no-examples] [--port <default is 8080>]"
}

fail () {
    echo "failed on: $@"
    echo "exiting"
    exit 1
}

serve() {
    echo "serving ./out-docs/ on http://localhost:$PORT"
    (cd ./out-docs && python3 -m http.server $PORT)
    exit
}

SERVE=0
SERVE_ONLY=0
PORT=8080
NO_EXAMPLES=0

if [ -n "$TRAVIS" ]; then
    SERVE=0
    SERVE_ONLY=0
else
    while [ "$1" != "" ]; do
        case $1 in
            -h | --help)
                usage
                exit
                ;;
            --full)
                TRAVIS_BRANCH=master
                TRAVIS_PULL_REQUEST=false
                ;;
            --fast)
                TRAVIS_BRANCH="fast"
                TRAVIS_PULL_REQUEST="fast"
                ;;
            --serve)
                SERVE=1
                ;;
            --serve-only)
                SERVE_ONLY=1
                ;;
            --no-examples)
                NO_EXAMPLES=1
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
fi

if [ $SERVE_ONLY -eq 1 ]; then
    serve
fi

DIR=$(dirname "$0")
output="$DIR/out-docs"
core="$DIR/packages/core"
sortable="$DIR/packages/sortable"
multi_backend="$DIR/packages/multi-backend"
examples="$DIR/packages/examples"

EXAMPLES_TASK="local-docs"
if [ "$TRAVIS" == "true" ]; then
  EXAMPLES_TASK="gh-pages"
fi

# Now, if we're running travis, we only want to build docs on master proper.
# Anything less (e.g. PRs to master) and we can go faster by building in dev mode
# and ignoring the docs (which never fail basically).
# This saves about 1-2 minutes per non-master build.

if [ "$TRAVIS" == "true" ] && ([ "$TRAVIS_BRANCH" != "master" ] || [ "$TRAVIS_PULL_REQUEST" != "false" ]); then
    echo "travis-ing $TRAVIS $TRAVIS_BRANCH $TRAVIS_PULL_REQUEST"
    (cd "$examples" && yarn run fast)
    exit $?
fi

build() {
    set -euxo pipefail

    rm -rf out-docs
    rm -rf "$core/documentation"

    (cd "$core" && yarn run docs)

    # move main docs into output
    (mv "$core/documentation" "$output")

    # build sortable docs
    (cd "$sortable" && yarn run docs)

    # move multi-backend into output
    (mv "$sortable/documentation" "$output/sortable")

    # build multi-backend docs
    (cd "$multi_backend" && yarn run docs)

    # move multi-backend into output
    (mv "$multi_backend/documentation" "$output/multi-backend")

    # build examples
    [ $NO_EXAMPLES -ne 1 ] && (cd "$examples" && yarn run $EXAMPLES_TASK)

    # move examples into output
    [ $NO_EXAMPLES -ne 1 ] && (mv "$examples/dist/examples" "$output/examples")

    : "built successfully"
}

if [ $SERVE -eq 1 ]; then
    build
    serve
else
    build
fi

