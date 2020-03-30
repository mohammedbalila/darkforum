FROM node:8-alpine

EXPOSE 8000

ARG NODE_ENV
ENV PORT 8000
ENV NODE_ENV production
ENV JWT_KEY bA2xcjpf8y5aSUFsNB2qN5yymUBSs6es3qHoFpGkec75RCeBb8cpKauGefw5qy4
ENV DB_URI mongodb://forum_admin:forum_admin8128@ds259268.mlab.com:59268/forum

RUN mkdir /app
WORKDIR /app
ADD package.json yarn.lock /app/
RUN yarn --pure-lockfile
RUN yarn global add pm2 
ADD . /app

CMD ["pm2-runtime", "src/server.js"]
