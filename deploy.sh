#!/bin/bash
docker build -t mustafabalila44/forum .
docker push mustafabalila44/forum

ssh forum@$DEPLOY_SERVER << EOF
docker pull mustafabalila44/forum
docker stop forum-api || true
docker rm forum-api || true
docker rmi mustafabalila44/forum:current || true
docker tag mustafabalila44/forum:latest mustafabalila44/forum:current
docker run -d --restart always --name forum-api -p 8000:8000 mustafabalila44/forum:current
EOF
