#creating volumes and networks

source .env.network 
source .env.volume

if [ "$(docker volume ls -q --filter name=$VOLUME_NAME)" ]; then
    echo "Volume $VOLUME_NAME already exists."
else
    docker volume create $VOLUME_NAME
    echo "Volume $VOLUME_NAME created."
fi

if [ "$(docker network ls -q --filter name=$NETWORK_NAME)" ]; then
    echo "network $NETWORK_NAME already exists."
else
    docker network create $NETWORK_NAME
    echo "network $NETWORK_NAME created."
fi