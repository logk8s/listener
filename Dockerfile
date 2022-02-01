FROM node:current-buster

WORKDIR /app

## Enabled on developmet mode
COPY . .

## Enabled on production mode
# COPY ./nest/package.json package.json
# COPY ./nest/tsconfig.json tsconfig.json
# COPY ./nest/tsconfig.build.json tsconfig.build.json
# COPY ./nest/src src

RUN ["npm","install","global","@nestjs/cli"]
RUN ["npm", "install"]

## Enabled on production mode
# RUN ["npm", "run", "build"]

EXPOSE 3010

## Enabled on development mode
ENTRYPOINT ["npm","run","start:dev"]

## Enabled on production mode
# ENTRYPOINT ["npm","run","start:prod"]
