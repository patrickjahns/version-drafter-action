FROM node:18.16.1-alpine
ENV NODE_ENV=production
LABEL "repository"="https://github.com/patrickjahns/version-drafter-action" \
      "homepage"="https://github.com/patrickjahns/version-drafter-action" \
      "maintainer"="Patrick Jahns" \
      "com.github.actions.name"="Version Drafter" \
      "com.github.actions.description"="Determines the next semantic version based on github labels of merged pull requests." \
      "com.github.actions.icon"="trending-up" \
      "com.github.actions.color"="orange"
WORKDIR /app
COPY . .
RUN apk --no-cache add git && \
    yarn --frozen-lockfile && \
    rm -rf /var/cache/apk/* && \
    rm -rf /root/.cache/
ENTRYPOINT [ "/app/node_modules/.bin/probot", "receive", "/app/index.js" ]
