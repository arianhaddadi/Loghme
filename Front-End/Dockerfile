FROM node:10-alpine as build

RUN mkdir /loghme_front_end

WORKDIR /loghme_front_end

COPY . .

RUN npm install


RUN npm run build

##############################

FROM nginx:alpine

COPY nginx.conf /etc/nginx/conf.d/default.conf

COPY --from=build /loghme_front_end/build /usr/share/nginx/html

EXPOSE 3000 80

ENTRYPOINT ["nginx", "-g", "daemon off;"]