import geopandas as gpd
import xarray as xr
import s3fs
import numpy as np
import json

geojson_path = 'regions.geojson'
gdf = gpd.read_file(geojson_path)

zarr_store_path = 's3://oae-dataset-carbonplan/store1b.zarr'

fs = s3fs.S3FileSystem(anon=True)
store = s3fs.S3Map(root=zarr_store_path, s3=fs)
ds = xr.open_zarr(store, consolidated=True)

gdf.set_index('polygon_id', inplace=True)

def flatten_efficiency_data_and_apply(polygon_id, ds, gdf):
    for injection_date in range(1, 5):  # Injection dates labeled 1 to 4
        try:
            efficiency_data = np.round(ds['OAE_efficiency'].sel(polygon_id=polygon_id, injection_date=injection_date, drop=True).values, 3)
            for year in range(1, 16):  # 1 to 15 representing 15 years
                index = year * 12 - 1  # Adjusted to select the end of each year
                value = efficiency_data[index]
                property_name = f'eff_inj_{injection_date}_year_{year}'
                gdf.at[polygon_id, property_name] = value
        except KeyError:
            print(f"Data for polygon_id {polygon_id} and injection_date {injection_date} does not exist.")

for polygon_id in gdf.index:
    flatten_efficiency_data_and_apply(polygon_id, ds, gdf)

output_path = 'regions_joined.geojson'
gdf.to_file(output_path, driver='GeoJSON')

print(f"GeoJSON file saved to {output_path}.")

# Convert to vector tiles
# tippecanoe -zg -e tiles/ --no-tile-compression regions_joined.geojson
