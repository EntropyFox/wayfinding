FROM node:12 as builder
WORKDIR /app

COPY ./package*.json /app/

RUN npm install /app

# Bundle app source
COPY ./ /app

RUN npm run build

FROM nginx:1.17-alpine as runner
COPY ./nginx/wayfinding.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=0 /app/dist /usr/share/nginx/html
