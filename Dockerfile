FROM resin/rpi-raspbian:jessie
MAINTAINER James Baxter <j.w.baxter@gmail.com>

RUN apt-get update
RUN apt-get install git build-essential curl -y
RUN curl -sL https://deb.nodesource.com/setup_4.x | bash -
RUN apt-get install nodejs -y

WORKDIR /opt
RUN git clone git://git.drogon.net/wiringPi
WORKDIR /opt/wiringPi
RUN ./build

WORKDIR /opt
RUN git clone https://github.com/r10r/rcswitch-pi.git
WORKDIR /opt/rcswitch-pi
RUN make

ADD . /opt/switch_server
WORKDIR /opt/switch_server
RUN npm install

CMD ["/opt/switch_server/bin/www"]
