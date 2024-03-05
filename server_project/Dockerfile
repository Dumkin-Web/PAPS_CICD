FROM node:16-alpine
WORKDIR /app

COPY package.json .
RUN npm install

COPY . ./

ENV PORT 3001
ENV JWT_SECRET_KEY Secret
ENV DB_NAME tundra
ENV DB_USER postgres
ENV DB_PASSWORD postgres
ENV DB_HOST postgres-db-container
ENV DB_PORT 5432

EXPOSE 3001
CMD ["node", "index.js"]