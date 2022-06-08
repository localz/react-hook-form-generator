ARG IMAGE_TAG=node-14-alpine
FROM localz/locker:$IMAGE_TAG

ARG NPM_TOKEN
ENV NPM_TOKEN $NPM_TOKEN

RUN echo "//registry.npmjs.org/:_authToken=$NPM_TOKEN" > ~/.npmrc \
    && echo "scope=localz" >> ~/.npmrc \
    && echo "@localz=https://registry.npmjs.org/" >> ~/.npmrc

RUN apk --no-cache add ca-certificates wget yarn

ADD ./ /src

ADD package.json /tmp/package.json

RUN cd /tmp && yarn install

RUN mkdir -p /src && cp -a /tmp/node_modules /src

WORKDIR /src

# Node Logging
RUN mkdir -p /var/log/nodejs