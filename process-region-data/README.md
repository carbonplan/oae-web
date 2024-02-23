# Semi automated process for deriving OAE polygons

## Dependency installation

- create venv: `python -m venv oae`
- activate: `source oae/bin/activate`
- install deps: `pip install -r requirements.txt`

## Data download

- Raw data are sourced from [C]Worthy but partially duplicated in this folder
  `polygon_masks_with_coords.nc` is used to derive the geojson polygons
- Raw numpy vertices (used to aid the manual post processing steps below) are too large to include here
- `regions.geojson` and `regions_joined.geojson` are the latest versions used to derive tiles used in the app

## Initial vectorization

run `convert.py`

## Post processing steps:

Unfortunately we needed to do some manual work to get these polygons looking pretty.

- adjust the longitude to be within -180 to 180 degrees (TODO: add this to the convert script)
- then we manually fixed issues in the atlantic by connecting the polygons based roughly on the numpy vertices. this was completed in QGIS
- similarly, add back in the polygon_id = 0 polygon near greenland because it was lost due to the nature of the process of building the grid
- next we extract dateline adjacent polygons, reproject them to 3832 (pacific) and then dissolve them
- finally we replace the dateline adjacent polygons with the dissolved polygons and make sure everthing is reprojected to EPSG:4326

## Joining zarr data to geojson

Run `join.py`

> Note that this formats polygon properties in such a way to be more compatible with mapbox expressions - it's not the prettiest.

## Build tiles

Install Tippecanoe: `brew install tippecanoe`

Run `build-tiles.py`

## Upload to s3

We should now have a tile directory organized by z/x/y that contains`.pbf` files. Sync this dir with the s3 location where the data is being hosted.
