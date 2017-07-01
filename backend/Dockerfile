FROM mhart/alpine-node:latest

RUN \
 apk add --no-cache mongodb && \
 rm /usr/bin/mongoperf

ADD ./application/package.json /tmp/package.json
RUN cd /tmp && \
 npm install && \
 mkdir -p /opt/app && \
 cp -a /tmp/node_modules /opt/app/

WORKDIR /opt/app
ADD ./application /opt/app

VOLUME /data/db

EXPOSE 3000
CMD [ "mongod" ]
