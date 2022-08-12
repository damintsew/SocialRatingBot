FROM node:18

WORKDIR /usr/social_rating

COPY package.json .
COPY tsconfig.json .

RUN mkdir src
COPY src src

# зарефакторить нахер
RUN npm install
RUN npm run compile

CMD ["npm", "start"]
