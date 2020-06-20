FROM node:lts-stretch-slim
WORKDIR /usr/src/app
RUN npm install pm2@latest -g
COPY package-lock.json ./
COPY package.json ./
RUN npm install
COPY . .
RUN npm run build
EXPOSE 3000
ENTRYPOINT [ "pm2-runtime", "start", "ecosystem.config.js"]
#CMD [ "node", "server.js" ]