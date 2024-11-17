FROM node:22.11.0-bullseye

WORKDIR /app

COPY package.json package-lock.json ./

RUN npm install

COPY build/*.js ./

# Start the bash shell
ENTRYPOINT [ "/bin/bash" ]
