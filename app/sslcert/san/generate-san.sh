#!/bin/bash -x
# @link http://techbrahmana.blogspot.co.uk/2013/10/creating-wildcard-self-signed.html

# NOTE: Copies of infographic.san.key/infographic.san.crt have been copied to /puppet/modules/sslcerts/files

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
openssl genrsa -des3 -passout pass:foobar -out infographic.san.key.password 2048

##  Convert the private key to an unencrypted format
openssl rsa -passin pass:foobar -in infographic.san.key.password -out infographic.san.key

##  Create the certificate signing request
openssl req -new -key infographic.san.key -out infographic.san.csr <<EOF
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
openssl x509 -req -extensions v3_req -days 365 -in infographic.san.csr -signkey infographic.san.key -out infographic.san.crt -extfile infographic.san.conf
#    -CA ../rootCA/infographic.rootCA.crt -CAkey ../rootCA/infographic.rootCA.key -CAcreateserial

#
#openssl genrsa             -out infographic.san.key 2048
#openssl req    -new -nodes -out infographic.san.csr -config infographic.san.conf
#openssl x509   -req -CA ../rootCA/infographic.rootCA.pem -CAkey ../rootCA/infographic.rootCA.key -CAcreateserial -in infographic.san.csr -out infographic.san.crt -days 3650
##end

exit 0