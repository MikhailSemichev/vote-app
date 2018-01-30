FROM node:latest

ENV NODE_ENV=development
ENV PORT=3333

COPY . /usr/api
WORKDIR /usr/api
# VOLUME [ "/usr/api" ]

RUN npm i

EXPOSE $PORT

ENTRYPOINT ["npm", "start"]