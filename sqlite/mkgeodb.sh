#! /bin/sh
echo $1
spatialite_osm_net -o $1 -d $1.sqlite --roads -T roads -tf road_template.conf
spatialite_network -d $1.sqlite -T roads -f node_from -t node_to -g geometry --oneway-tofrom oneway_tofrom --oneway-fromto oneway_fromto -n name -o roads_net_data --overwrite-output
spatialite $1.sqlite "CREATE VIRTUAL TABLE roads_net USING VirtualNetwork('roads_net_data')"