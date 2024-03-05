# DEPLOY NGINX

### Docker build
```docker build . -t server-project```
### Docker run
```docker run --name server-project-container --network server-network  -p 3000:3000 -d server-project```