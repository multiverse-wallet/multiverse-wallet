# Dockerfile

# base image
FROM node:alpine

RUN mkdir /app

WORKDIR /app

# copy source files
COPY . .

# install dependencies
RUN yarn --ignore-scripts

# Build app
RUN yarn build

EXPOSE 3000

CMD yarn start