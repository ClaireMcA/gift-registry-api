docker network create gift-registry

sudo docker container run --name api --network gift-registry -v /etc/letsencrypt:/etc/letsencrypt -e CERT_PATH="/etc/letsencrypt/live/garrard.net.au" -e EMAIL_USER="" -e EMAIL_PASS="" -e MONGODB_URI="mongodb://db:27017" -p 443:4000 -p 80:3000 -d gift-registry-api 

docker volume create gift-registry
docker container run --name db --network gift-registry -v gift-registry:/data/db -d -p 27017:27017  mongo
