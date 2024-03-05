# DEPLOY NGINX

### Docker build
```docker build . -t server-user```
### Docker run
```docker run --name server-user-container --network server-network  -p 3000:3000 -d server-user```