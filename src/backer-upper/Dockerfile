FROM ubuntu:latest

ARG DEBIAN_FRONTEND=noninteractive

RUN apt-get update

RUN apt-get install wget -y && apt-get install gnupg -y

RUN apt-key adv --keyserver hkp://keyserver.ubuntu.com:80 --recv-keys 7FCC7D46ACCC4CF8

RUN sh -c 'echo "deb http://apt.postgresql.org/pub/repos/apt jammy-pgdg main" > /etc/apt/sources.list.d/pgdg.list'

RUN wget -qO- https://www.postgresql.org/media/keys/ACCC4CF8.asc | sudo tee /etc/apt/trusted.gpg.d/pgdg.asc &>/dev/null

RUN apt-get update

RUN apt-get install -y postgresql-client cron awscli

COPY cronjob /etc/cron.d/cronjob

RUN chmod 0644 /etc/cron.d/cronjob

RUN touch /var/log/cron.log

CMD cron && tail -f /var/log/cron.log
