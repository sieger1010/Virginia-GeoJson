# Virginia-GeoJson

This is a project being used for Telamon Corporation to display USDA agriculture census data. The GeoJSON file is being used to draw a map with D3js.

The website is under regular development and changes to the GeoJSON in this repository will continue.

### A special note about data winding
While building the map I learned about the subject of winding when dealing with shape coordinates. There is a defined standard for GeoJSON which mapshaper seems to follow, but d3js requires the opposite order. To fix this issue, after exporting the counties from mapshaper I ran the file through geojson-rewind with the command: geojson-rewind foo.geojson --counterclockwise
This output is what was copied into the final and working version of the map that is being displayed with d3.

### Important tools

USDA shapefiles and metadata

mapshaper.org

d3js

codepen.io

geojson-rewind - from NPM

