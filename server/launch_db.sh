#!/bin/bash

# see https://hub.docker.com/_/mongo/#!
docker run --rm \
           -p 27017:27017 \
		   -v "$PWD"/db:/data/db \
		   --name mongodb \
		   -itd mongo:latest
