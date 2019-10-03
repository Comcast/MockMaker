FROM node:carbon

# Create app directory
WORKDIR /usr/src/app

COPY ./src/package*.json ./

RUN npm install
RUN npm install minimist

COPY ./src/mock-maker.js .

# add the docs directory
ADD ./site public/

ADD ./LICENSE public/

EXPOSE 80

CMD [ "npm", "start"]
