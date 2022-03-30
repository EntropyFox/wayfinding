FROM node:12 as builder
WORKDIR /app

COPY ./services/library/package*.json /app/library/
COPY ./services/tracker/src/artracker-ts/package*.json /app/viewer/

RUN npm install --prefix /app/library
RUN npm install --prefix /app/viewer

# Bundle app source
COPY ./services/tracker/src/artracker-ts /app/viewer
# Bundle library
COPY ./services/library /app/library

COPY ./config/tsconfig.json /config/tsconfig.json

ARG BUILD 

RUN npm run build --prefix /app/library
RUN npm run ${BUILD} --prefix /app/viewer

FROM nginx:1.17-alpine as runner
COPY ./services/tracker/src/artracker-ts/nginx/tracker.conf /etc/nginx/conf.d/
RUN rm /etc/nginx/conf.d/default.conf
COPY --from=0 /app/viewer/dist /usr/share/nginx/html
