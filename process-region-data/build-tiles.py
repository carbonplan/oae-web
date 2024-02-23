import os
import subprocess
import shutil

def run_command(command):
    try:
        subprocess.run(command, check=True, shell=True)
    except subprocess.CalledProcessError as e:
        print(f"An error occurred: {e}")

# Remove the 'tiles' directory if it exists
tiles_dir = 'tiles'
if os.path.exists(tiles_dir):
    shutil.rmtree(tiles_dir)

# Create a new 'tiles' directory
os.makedirs(tiles_dir, exist_ok=True)

# Run the tippecanoe command
tippecanoe_cmd = (
    'tippecanoe '
    '-zg '
    '-e tiles/ '
    '-l regions_joined ' # name referenced by frontend
    '--no-tile-compression '
    'regions_joined.geojson'
)
run_command(tippecanoe_cmd)
