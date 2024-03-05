# DEPLOY NGINX

### Docker build
```docker build . -t nginx-server```
### Docker run
```docker run --name nginx-server-container --network server-network -p 80:80 -d nginx-server ```