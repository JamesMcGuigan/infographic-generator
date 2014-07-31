#!/bin/bash
grep -rHIin "require(" ./ \
    --no-messages --include="*.js" --exclude-dir '.git' --exclude-dir '_old' --exclude-dir 'vendor' --exclude-dir 'node_modules' --exclude-dir 'bower' |
    perl -n -e 'm/require\((.*?)\)/ && print "$1\n" ' |
    sed "s/'/\"/g" | grep -v '.js' |
    perl -p -e 's/$/: "*",/' |
    sort | uniq |
    grep -v -E '"(assert|child_process|cluster|dgram|dns|domain|events|fs|https|net|path|process|querystring|readline|repl|stream|string_decoder|sys|timers|tls|tty|url|util|punycode|http|vm|crypto|console|zlib|buffer|constants|os)"'
