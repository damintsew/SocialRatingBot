FROM node:18

WORKDIR /usr/social_rating

COPY package.json .
COPY tsconfig.json .
RUN npm install

RUN mkdir src
COPY src src

RUN npm run compile

CMD ["npm", "start"]
