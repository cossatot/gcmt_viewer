FROM mongo

COPY init.geojson /init.geojson
CMD mongoimport --host=mongo \
  --db gcmt_dev \
  --collection earthquakes \
  --type json \
  --file /init.geojson \
  --jsonArray
