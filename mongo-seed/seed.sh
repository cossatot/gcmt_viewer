#!/bin/bash

mongoimport --host mongo --db gcmt_dev --collection quakes --drop --type json --file /quakes_init.geojson --jsonArray
mongoimport --host mongo --db gcmt_dev --collection faults --drop --type json --file /faults_init.geojson --jsonArray
