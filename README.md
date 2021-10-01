docker network create gift-registry
docker container run --name ui --network gift-registry -p 80:80 -d gift-registry-ui
docker container run --name api --network gift-registry -e MONGODB_URI="mongodb://db:27017" -d gift-registry-api

docker volume create gift-registry
docker container run --name db --network gift-registry -v registry-app:/data/db -d  mongo:alpine