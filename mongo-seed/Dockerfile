FROM mongo

COPY ./data/init.geojson /init.geojson
CMD mongoimport --host=mongo \
  --db gcmt_dev \
  --collection earthquakes \
  --drop \
  --type json \
  --file /init.geojson \
  --jsonArray