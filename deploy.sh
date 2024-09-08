#!/bin/bash

sudo docker build -t projection -f Dockerfile . --no-cache
if [ $? -ne 0 ]; then
    echo "Error: Docker build failed."
    exit 1
fi

sudo docker tag projection atakan1927/projection:latest
if [ $? -ne 0 ]; then
    echo "Error: Docker tag failed."
    exit 1
fi

sudo docker push atakan1927/projection:latest
if [ $? -ne 0 ]; then
    echo "Error: Docker push failed."
    exit 1
fi

wget -qO- https://api.render.com/deploy/srv-creehbij1k6c73dcp3hg?key=Q9yjGyufTO0
if [ $? -ne 0 ]; then
    echo "Error: Render deployment trigger failed."
    exit 1
fi

echo "Deployment triggered successfully on Render."