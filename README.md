docker network create gift-registry

sudo docker container run --name api --network gift-registry -v /etc/letsencrypt:/etc/letsencrypt -e CERT_PATH="/etc/letsencrypt/live/garrard.net.au" -e EMAIL_USER="" -e EMAIL_PASS="" -e APP_KEY="" -e MONGODB_URI="mongodb://db:27017" -p 443:4000 -p 80:3000 -d gift-registry-api 

docker volume create gift-registry
docker container run --name db --network gift-registry -v gift-registry:/data/db -d -p 27017:27017  mongo --bind-ip-all

Remove port and bind ip all if you're not exposing the db for adding items, also you'll need to open up a firewall for port 27017 to allow access

