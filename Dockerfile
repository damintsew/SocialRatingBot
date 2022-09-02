FROM node:18

WORKDIR /usr/social_rating

ADD package.json /tmp/package.json
RUN cd /tmp && npm install
RUN cp -a /tmp/node_modules /usr/social_rating
RUN cp /tmp/package.json /usr/social_rating
COPY images/* /usr/social_rating/images/


COPY tsconfig.json .
RUN mkdir src
COPY src src

RUN npm run compile

CMD ["npm", "start"]
