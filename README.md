docker network create gift-registry
docker container run --name api --network gift-registry -e MONGODB_URI="mongodb://db:27017" -p 3000:3000 -d gift-registry-api -v /etc/letsencrypt:/etc/letsencrypt -e CERT_PATH="/etc/letsencrypt/live/garrard.net.au"

docker volume create gift-registry
docker container run --name db --network gift-registry -v gift-registry:/data/db -d -p 27017:27017  mongo