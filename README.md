# What is MailHero ?

MailHero is a project that helps you bootstrap your emailing services using modern technologies.

# Requirements

To run this project, you need the following tools installed:
- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Bun](https://bun.sh/)

# Quickstart

To run the development environment, run the following command:
```sh
bun run dev
```

To test emails being sent, open this following url in your browser:
- [http://localhost:3000/mail/welcome](http://localhost:3000/mail/welcome)

You should see an email being sent to `test@example.com` from `noreply@mailhero.com` in the [Mailhog](https://github.com/mailhog/MailHog) mailcatcher at the following address:
- [http://localhost:8025](http://localhost:8025)

# Technical stack

This project is based on the following stack:
- [React Email](https://react.email/)
- [Nodemailer](https://www.nodemailer.com/)
- [Mailhog](https://github.com/mailhog/MailHog)
- [Docker](https://docs.docker.com/get-started/get-docker/)
- [Bun](https://bun.sh/)

# Project details

## Project structure

The main directories are the following:
- `src/mail`: contains all the React Email templates
- `src/routes`: contains all the HTTP routes, mainly the mail ones under mail.routes.tsx
- `src/conf`: contains environnement schema validation with zod and transporter config from Nodemailer
- `docker`: containers Dockerfiles for building debian distroless and bun slim image.
- `env`: contains dev and production environments

## Runnning the dev environment

To run the dev environment, you simply need to run the following command:
```sh
bun run dev
```

This command does the following:
- Run an instance of a docker service of [Mailhog](https://github.com/mailhog/MailHog) to catch emails locally for testing purposes.
- Run the dev environment for the [Bun.serve](https://bun.sh/docs/api/http#bun-serve) HHTP-server.

You can go to the following link to check the sent emails:
- [http://localhost:8025](http://localhost:8025)

You can test that the mails are sent properly by sending a POST request with the following body to `http://localhost:3000/mail/welcome`:
```json
{
  "to": "angelo@mailhero.com"
}
```

Or by running the following [curl](https://github.com/curl/curl) command:
```sh
curl -X POST http://localhost:3000/mail/welcome -H "Content-Type: application/json" -d '{"to": "angelo@mailhero.com"}'
```

You should see an email being sent to `angelo@mailhero.com` from `noreply@mailhero.com` in the [Mailhog](https://github.com/mailhog/MailHog) mailcatcher at the following address:
- [http://localhost:8025](http://localhost:8025)

## Stopping the dev environment

If you ran the command above, to stop the running container for mailoh, run the following command:
```sh
bun run stop
```

## Mail dev environment

To check how your emails look and test them out with [React Email](https://react.email/), use the following command:
```sh
bun run email
```

# Building for production

## Requirements

Once docker installed, you need to pull the SlimtoolKit image.
This image is used to reduce the final image size.
Run the following image to pull dslim/slim:
```sh
docker pull dslim/slim
```

## Build bun:slim and slimmed version

To build the bun:slim and slimmed images, run the following command in bash or powershell:
```sh
docker run -it --rm -v "${pwd}:/app" -v /var/run/docker.sock:/var/run/docker.sock dslim/slim --archive-state off --crt-api-version=1.25 build --dockerfile /docker/bun.Dockerfile --tag-fat mailhero:bun-slim --tag mailhero:bun-slimmed --include-path /bin --http-probe-off --continue-after=1 /app
```

On Nushell, run the following command:
```shell
docker run -it --rm -v $"(pwd):/app" -v /var/run/docker.sock:/var/run/docker.sock dslim/slim --archive-state off --crt-api-version=1.25 build --dockerfile /docker/bun.Dockerfile --tag-fat mailhero:bun-slim --tag mailhero:bun-slimmed --include-path /bin --http-probe-off --continue-after=1 /app
```

## Build debian distroless and debian distroless slimed images

To build the distroless and slimmed distroless images with a compiled executable on debian, run the following command in bash or powershell:
```sh
docker run -it --rm -v "${pwd}:/app" -v /var/run/docker.sock:/var/run/docker.sock dslim/slim --archive-state off --crt-api-version=1.25 build --dockerfile /docker/debian.Dockerfile --tag-fat mailhero:debian-slim --tag mailhero:debian-slimmed --include-path /bin --http-probe-off --continue-after=1 /app
```

On Nushell, run the following command:
```shell
docker run -it --rm -v $"(pwd):/app" -v /var/run/docker.sock:/var/run/docker.sock dslim/slim --archive-state off --crt-api-version=1.25 build --dockerfile /docker/debian.Dockerfile --tag-fat mailhero:debian-slim --tag mailhero:debian-slimmed --include-path /bin --http-probe-off --continue-after=1 /app
```

# Run the production environment

To run the production environment, first create a `prod.env` file in the `env` folder.
Then run the following command:
```sh
docker compose up -d
```

By default, this compose file uses the debian-slimmed build of the image we created with the commands listed above.

You can change it to use the slim version of bun instead like so:
```Dockerfile
services:
  mailhero:
    image: mailhero:bun-slimmed
    container_name: 'mailhero'
    env_file: ./env/prod.env
    ports:
      - "3000:3000"
```