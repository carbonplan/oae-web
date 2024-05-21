### gdal recipes for rasterizing polygon boundaries to conform to web mercator grid:

Helpful to split polygons across the antimeridian before this next step.

Rasterize the original regions.geojson in full resolution (maybe way overkill)

`gdal_rasterize -l regions -a polygon_id -te -180 -90 180 90 -tr 0.01 0.01 -a_nodata -9999 -ot UInt16 -of GTiff regions.geojson output_highres.tif`

Then reproject this to web mercator at our desired resolution of 256x256

`gdalwarp -t_srs EPSG:3857 -te -20037508.34 -20037508.34 20037508.34 20037508.34 -ts 256 256 -r near -dstnodata -9999 output_highres.tif output_webmercator.tif`

Then manually fix gaps in pacific along the antimeridian in qgis.

Finally fix miswrapped polygons using the `fix_meridian.py` script.
