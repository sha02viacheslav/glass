FROM node:19.7.0-alpine AS BASE
WORKDIR /src

COPY package* ./

RUN npm install

FROM BASE AS BUILD

WORKDIR /src

COPY . .

RUN npm run build  

FROM nginx:1.23.3-alpine 

COPY --from=BUILD /src/build /usr/share/nginx/html







