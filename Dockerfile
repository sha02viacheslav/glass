FROM node:19.7.0-alpine AS base

WORKDIR /src

COPY package* ./

RUN npm install

FROM base AS build

RUN apk add --no-cache git

WORKDIR /src

COPY . .

ARG GH_TOKEN \
    GH_USERNAME \
    GH_REPO \
    SOURCE_ENV

RUN git clone https://$GH_TOKEN@github.com/$GH_USERNAME/$GH_REPO.git tmp_env

RUN mv tmp_env/.env.$SOURCE_ENV .env

RUN rm -rf tmp_env

RUN npm run build

FROM nginx:1.23.3-alpine

COPY --from=build /src/build /usr/share/nginx/html

COPY default.conf /etc/nginx/conf.d/default.conf







