FROM node:18-alpine

ARG gh_token

LABEL author="Dawn Sheedy (dawn@dawnsheedy.com)"
LABEL version="1.0"

WORKDIR /usr/src/app

COPY package.json ./

COPY yarn.lock ./

RUN echo $'@dawnsheedy:registry=https://npm.pkg.github.com/ \n\
//npm.pkg.github.com/:_authToken=${gh_token}' > .npmrc

COPY .npmr[c] .npmrc

RUN yarn

RUN rm .npmrc

COPY jest.config.js ./

COPY src/ ./src/

COPY tsconfig.json ./

RUN yarn build

EXPOSE 8000

CMD ["node", "build/index.js"]