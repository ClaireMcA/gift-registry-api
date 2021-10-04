docker network create gift-registry
docker container run --name api --network gift-registry -e MONGODB_URI="mongodb://db:27017" -p 3000:3000 -d gift-registry-api

docker volume create gift-registry
docker container run --name db --network gift-registry -v registry-app:/data/db -d -p 27017:27017  mongo