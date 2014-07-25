#!/bin/bash

JSL='/usr/local/bin/jsl'
if [[ -f ./jsl.conf ]]; then CONF=./jsl.conf; else CONF='/Users/jamie/.jsl.conf'; fi;

if [[ $1 ]]; then DIR=$1; else DIR="./"; fi; 
echo "--- Validating code with JavaScript Lint"
ANYERRORS=''
for FILE in `find $DIR -name '*.js' -not -path '*vendor*' -not -path '*node_modules*' -not -path '*bower*' -not -path '*/_old/*'`; do
	ERROR=`($JSL -nologo -process $FILE) | grep '[1-9] error\|ECMA'`;
	if [[ $ERROR != '' ]]; then
		ANYERRORS=1
		echo
		echo -n 'ERROR: '
		$JSL -nologo -conf $CONF -process $FILE | sed /^\s*$/d
		echo
	fi
done;

if [[ $ANYERRORS ]]; then
	echo "*** CODEBASE HAS ERRORS - aborting ***";
else
	echo "--- SUCCESS: No Errors Found ---";
fi;
