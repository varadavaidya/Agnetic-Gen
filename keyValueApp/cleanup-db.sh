# stop and remove the MongoDB container
source .env.network
source .env.db
source .env.volume

if [ "$(docker ps -aq -f name=$MONGODB_CONTAINER_NAME)" ]; then
    echo "removing MongoDB container with name $MONGODB_CONTAINER_NAME..."
    docker kill $MONGODB_CONTAINER_NAME
else
    echo "No MongoDB container with name $MONGODB_CONTAINER_NAME does not exist."
fi

if [[ "$(docker volume ls -q --filter name=$VOLUME_NAME)" ]]; then
    docker volume rm $VOLUME_NAME
    echo "Volume $VOLUME_NAME removed."
else
    echo "Volume $VOLUME_NAME does not exist."
fi

if [[ "$(docker network ls -q --filter name=$NETWORK_NAME)" ]]; then
    docker network rm $NETWORK_NAME
    echo "Network $NETWORK_NAME removed."
else
    echo "Network $NETWORK_NAME does not exist."
fi
