# droughtrelief
Interactive map for viewing where drought relief is or is not likely in the next 5 days.
The map mashes up the US Drought Monitor and National Weather Service Precipitation (QPF)
forecast datasets.

Data is pulled down via a Node.js backend, converted to GeoJSON, then stored into a Redis
datastore, so that subsequent requests can be served from the Redis cache. The backend 
determines based on the date/time when a request is made whether to fetch an updated datasets
(see `dates.js` for details on when products update.)

The results are served on a MapboxGL JS single page site.

## Future enhancements
* Better error handling
* Some code cleanup
* Automatically display maximized drought relief locations
