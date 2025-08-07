MONGODB_IMAGE="mongodb/mongodb-community-server"
MONGODB_TAG="7.0-ubuntu2204" 
source .env.db 

#Root credentials 

ROOT_USER="root-user"
ROOT_PASSWORD="root-password"

#Key value credentials
KEY_VALUE_DB="key-value-db"
KEY_VALUE_USER="key-value-user"
KEY_VALUE_PASSWORD="key-value-password"

#connectivity 
source .env.network
LOCALHOST=27017
CONTAINER_PORT=27017
NETWORK_NAME="key-value-net"


#storage

source .env.volume
VOLUME_NAME="key-value-data"
VOLUME_CONTAINER_PATH="/data/db"

source setup.sh

if [ "$(docker ps -q -f name=$MONGODB_CONTAINER_NAME)" ]; then
    echo "MongoDB container with name $MONGODB_CONTAINER_NAME already exists."
    echo "the container will be removed when stopped"
    echo "To stop the container, run: docker kill $MONGODB_CONTAINER_NAME"
    exit 1
fi


docker run --rm -d --name $MONGODB_CONTAINER_NAME \
    -e MONGODB_INITDB_ROOT_USERNAME=$ROOT_USER \
    -e MONGODB_INITDB_ROOT_PASSWORD=$ROOT_PASSWORD \
    -e KEY_VALUE_DB=$KEY_VALUE_DB \
    -e KEY_VALUE_USER=$KEY_VALUE_USER \
    -e KEY_VALUE_PASSWORD=$KEY_VALUE_PASSWORD \
    -p $LOCALHOST:$CONTAINER_PORT \
    -v $VOLUME_NAME:$VOLUME_CONTAINER_PATH \
    --network $NETWORK_NAME \
    -v ./db-config/mongo-init.js:/docker-entrypoint-initdb.d/mongo-init.js:ro \
    $MONGODB_IMAGE:$MONGODB_TAG