# DEPLOY NGINX

### Docker build
```docker build . -t postgres-db```
### Docker run
```docker run --name postgres-db-container --network server-network -p 4321:5432 -d postgres-db```