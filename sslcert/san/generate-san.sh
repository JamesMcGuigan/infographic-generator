#!/bin/bash -x
# @link http://techbrahmana.blogspot.co.uk/2013/10/creating-wildcard-self-signed.html

# NOTE: Copies of infographic-generator.san.key/infographic-generator.san.crt have been copied to /puppet/modules/sslcerts/files

cd    "$(dirname "$0")"

# Set Params
Country=GB
State=London
City=London
Organization="Crystalline Technologies"
Section=""
FQDN=infographic.jamesmcguigan.com
Email=james.mcguigan@gmail.com


## Generate Private Key
openssl genrsa -des3 -passout pass:foobar -out infographic-generator.san.key.password 2048

##  Convert the private key to an unencrypted format
openssl rsa -passin pass:foobar -in infographic-generator.san.key.password -out infographic-generator.san.key

##  Create the certificate signing request
openssl req -new -key infographic-generator.san.key -out infographic-generator.san.csr <<EOF
$Country
$State
$City
$Organization
$Section
$FQDN
$Email
.
.
EOF

## Sign the certificate with extensions
openssl x509 -req -extensions v3_req -days 365 -in infographic-generator.san.csr -signkey infographic-generator.san.key -out infographic-generator.san.crt -extfile generate.san.conf
#    -CA ../rootCA/infographic.rootCA.crt -CAkey ../rootCA/infographic.rootCA.key -CAcreateserial

#
#openssl genrsa             -out infographic-generator.san.key 2048
#openssl req    -new -nodes -out infographic-generator.san.csr -config infographic-generator.san.conf
#openssl x509   -req -CA ../rootCA/infographic.rootCA.pem -CAkey ../rootCA/infographic.rootCA.key -CAcreateserial -in infographic-generator.san.csr -out infographic-generator.san.crt -days 3650
##end

exit 0