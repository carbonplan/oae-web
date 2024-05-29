import xarray as xr
import json
import numpy as np
import geopandas as gpd

# Function to adjust longitudes to avoid wrapping around the globe
def adjust_longitudes(lon):
    if abs(lon[1] - lon[0]) > 180:
        lon[1] = lon[1] - 360 if lon[1] > 0 else lon[1] + 360
    if abs(lon[2] - lon[1]) > 180:
        lon[2] = lon[2] - 360 if lon[2] > 0 else lon[2] + 360
    if abs(lon[3] - lon[2]) > 180:
        lon[3] = lon[3] - 360 if lon[3] > 0 else lon[3] + 360
    return lon

# Function to create a GeoJSON feature for a grid cell
def create_feature(lat, lon, mask_id_value):
    lon = adjust_longitudes(lon.copy())  # Adjust longitudes to avoid wrapping
    # Define the polygon coordinates in counter-clockwise order
    polygon_coords = [
        [lon[0], lat[0]], [lon[1], lat[1]],
        [lon[2], lat[2]], [lon[3], lat[3]],
        [lon[0], lat[0]]  # Close the polygon
    ]
    feature = {
        "type": "Feature",
        "properties": {
            "polygon_mask_id": int(mask_id_value)
        },
        "geometry": {
            "type": "Polygon",
            "coordinates": [polygon_coords]
        }
    }
    return feature

# Load the NetCDF file
file_path = 'polygon_masks_with_coords.nc'  
data = xr.open_dataset(file_path)

# Extract and normalize the relevant data
latitude = data['latitude'].values
longitude = data['longitude'].values
longitude = (longitude % 360 + 540) % 360 - 180  # Normalize longitude to be within -180 to 180 degrees
mask_id = data['polygon_mask_id'].values

# Initialize the Feature Collection
geojson_feature_collection = {
    "type": "FeatureCollection",
    "features": []
}

# Iterate over the grid to create polygons
nlat, nlon = latitude.shape
for i in range(nlat - 1):
    for j in range(nlon - 1):

        lat_corners = [latitude[i, j], latitude[i, j + 1],
                       latitude[i + 1, j + 1], latitude[i + 1, j]]
        lon_corners = [longitude[i, j], longitude[i, j + 1],
                       longitude[i + 1, j + 1], longitude[i + 1, j]]

        # Check for nan values in latitude, longitude, and mask_id
        # Exclude grid cells with polygon_mask_id: 0
        if not any(np.isnan(lat_corners + lon_corners)) and mask_id[i, j] != 0:
            mask_id_value = mask_id[i, j]
            feature = create_feature(lat_corners, lon_corners, mask_id_value)
            geojson_feature_collection["features"].append(feature)

# Save the Feature Collection to a GeoJSON file
geojson_file = 'grid_geojson_subset.geojson'  # Name of the GeoJSON file
with open(geojson_file, 'w') as f:
    json.dump(geojson_feature_collection, f)

# Perform the dissolve operation using GeoPandas
gdf = gpd.read_file(geojson_file)
dissolved_gdf = gdf.dissolve(by='polygon_mask_id')
dissolved_gdf['polygon_id'] = dissolved_gdf.index
dissolved_gdf.reset_index(drop=True, inplace=True)

# Adjust coordinates by height and width of cell
cell_height = (latitude[1, 0] - latitude[0, 0]) / 2
cell_width = (longitude[0, 1] - longitude[0, 0]) / 2
dissolved_gdf['geometry'] = dissolved_gdf['geometry'].translate(xoff=(cell_width * -1), yoff=(cell_height * -1))

# Save the dissolved polygons to a new GeoJSON file
output_file = 'grid_geojson_dissolved.geojson'  # Name of the output file
dissolved_gdf.to_file(output_file, driver='GeoJSON')

# QGIS steps
# next we adjust the longitude to be within -180 to 180 degrees
# then we manually fixed issues in the atlantic by connecting the polygons based roughly on the numpy vertices
# similarly, add back in the polygon_id = 0 polygon near greenland because it was lost due to the nature of the process of building the grid
# next we extract dateline adjacent polygons, reproject them to 3832 (pacific) and then dissolve them
# finally we replace the dateline adjacent polygons with the dissolved polygons
