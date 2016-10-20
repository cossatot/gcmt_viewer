FROM mongo
RUN apt-get update && apt-get -y install wget
COPY seed.sh /
RUN chmod +x /seed.sh
WORKDIR /
RUN wget http://earth-analysis.com/gcmt_viewer/data/quakes_init.geojson
RUN wget http://earth-analysis.com/gcmt_viewer/data/faults_init.geojson
CMD /seed.sh
