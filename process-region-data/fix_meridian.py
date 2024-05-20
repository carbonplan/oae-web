import json

# this fixes polygons that wrap the wrong way around the world after manual qgis fixes in epsg 3832

file_path = 'proper_square_datelinefixing.geojson'
with open(file_path, 'r') as file:
    geojson_raw = json.load(file)

def find_antimeridian_crossings(features):
    crossing_features = []
    for feature in features:
        coords = feature['geometry']['coordinates'][0] 
        for i in range(len(coords) - 1):
            if abs(coords[i][0] - coords[i+1][0]) > 180:
                crossing_features.append(feature)
                break
    return crossing_features

crossing_features = find_antimeridian_crossings(geojson_raw["features"])

def adjust_antimeridian_crossings(features):
    adjusted_features = []
    for feature in features:
        coordinates = feature['geometry']['coordinates'][0] 
        adjusted_coords = []
        for i in range(len(coordinates)):
            lon, lat = coordinates[i]
            if i > 0:
                prev_lon = adjusted_coords[-1][0]
                if abs(lon - prev_lon) > 180:
                    if lon < 0 and prev_lon > 0:
                        lon += 360
                    elif lon > 0 and prev_lon < 0:
                        lon -= 360
            adjusted_coords.append([lon, lat])
        feature['geometry']['coordinates'] = [adjusted_coords]
        adjusted_features.append(feature)
    return adjusted_features

adjusted_features = adjust_antimeridian_crossings(crossing_features)

adjusted_feature_ids = {f['properties']['polygon_id']: f for f in adjusted_features}
all_features_adjusted = []
for feature in geojson_raw['features']:
    polygon_id = feature['properties']['polygon_id']
    if polygon_id in adjusted_feature_ids:
        all_features_adjusted.append(adjusted_feature_ids[polygon_id])
    else:
        all_features_adjusted.append(feature)

adjusted_geojson = {
    "type": "FeatureCollection",
    "features": all_features_adjusted
}

adjusted_file_path = 'adjusted_dateline.geojson'

with open(adjusted_file_path, 'w') as file:
    json.dump(adjusted_geojson, file)