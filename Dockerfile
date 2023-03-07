FROM node:19.7.0-alpine AS base
WORKDIR /src

COPY package* ./

RUN npm install

FROM base AS build

WORKDIR /src

COPY . .

RUN npm run build  

FROM nginx:1.23.3-alpine 

COPY --from=build /src/build /usr/share/nginx/html
COPY --from=build /src/build /usr/share/nginx/html/react








