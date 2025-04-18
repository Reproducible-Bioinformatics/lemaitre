FROM denoland/deno:alpine-1.44.4

ARG GIT_REVISION
ENV DENO_DEPLOYMENT_ID=${GIT_REVISION}

WORKDIR /app
COPY . .
RUN deno cache main.ts
RUN deno task build

EXPOSE 8000

CMD ["run", "-A", "main.ts"]
