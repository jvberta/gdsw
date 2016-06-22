FROM mhart/alpine-node:6

WORKDIR /src
ADD . .

RUN npm install

EXPOSE 80
CMD ["node", "index.js"]
