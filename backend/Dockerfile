# First stage build
FROM node:20.18.1-slim AS build
WORKDIR /app
COPY package*.json .
RUN npm install
COPY . .

# Second stage build
FROM node:20.18.1-slim
WORKDIR /app
COPY --from=build /app /app
EXPOSE 4000
ENTRYPOINT ["node", "--watch", "index.js"]
