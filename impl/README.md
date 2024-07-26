# how to install npm packages before npm start
1. npm install

# How to execute application
1. npm start
2. node index.js

# How to config url and port
1. Check port inside ./index.js
2. use the same port and update port and domain/url under ./api/openapi.yaml

## docker commands
# Create docker image from docker file
step 1. docker build -t IMAGE_NAME .

# Create and run docker container
step 2. docker run -p HOST_PORT:CONTAINER_PORT -d --name CONTAINER_NAME IMAGE_NAME

# Run existing docker container
1. docker start CONTAINER_NAME
2. docker exec -it CONTAINER_NAME /bin/bash

# Remove docker image
1. docker image rm IMAGE_NAME

# Remove docker container
1. docker rm CONTAINER_NAME

## Steps to create/run docker container from GitLab/GitHub
1. git clone REPO_URL
2. docker build -t IMAGE_NAME .
3. docker run -p HOST_PORT:CONTAINER_PORT -d --name CONTAINER_NAME IMAGE_NAME