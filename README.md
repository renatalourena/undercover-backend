### Backend express server
Simple example of backend server using node, express and redis. Created based on the article: https://codeforgeek.com/manage-session-using-node-js-express-4/

## Prerequisites
- node
- docker

## Running

- Install dependencies
```
npm install
```

- Running redis dependencies
```
docker run --name some-redis -d -p 127.0.0.1:6379:6379 redis 
```

- Runnind the server
```
npm start
```