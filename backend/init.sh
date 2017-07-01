#!/usr/bin/env bash
docker-compose build
docker-compose up -d
CONTAINER=$(docker ps -aqf "name=build_passwordmanager")
docker exec -itd ${CONTAINER} npm run production

echo "Thanks for using the PasswordManager. The installation has finished successfully and you are now able to use it on. Please visit http://localhost:3000/install to create your user account"

OP_SYSTEM=$(uname -s)
if [ "${OP_SYSTEM}" == "Darwin" ]; then
    sleep 1
    open "http://localhost:3000/install"
fi
