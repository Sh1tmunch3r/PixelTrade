import os
import json
from datetime import datetime
from pathlib import Path
from flask import Flask, render_template, jsonify # Added jsonify

app = Flask(__name__)

# --- Configuration ---
BASE_DIR = Path(__file__).resolve().parent
STATIC_BASE_DIR = BASE_DIR / "static" / "base"
APP_INFO_DIR = BASE_DIR / "base" / "apps" / "info"
FILE_INFO_PATH = APP_INFO_DIR / "file_info.json"
APPS_MANIFEST_PATH = APP_INFO_DIR / "apps_manifest.json"

# --- File Info Grabber (runs once on startup) ---
def gather_file_info():
    """
    Scans files in 'static/base/', gathers their info, and saves it to file_info.json.
    """
    source_directory = STATIC_BASE_DIR
    output_file_path = FILE_INFO_PATH

    if not source_directory.exists() or not source_directory.is_dir():
        print(f"Source directory '{source_directory}' not found. Skipping file info generation.")
        return

    APP_INFO_DIR.mkdir(parents=True, exist_ok=True) # Ensure output dir exists
    all_files_data = []

    print(f"Scanning files in '{source_directory}'...")
    for item in source_directory.iterdir():
        if item.is_file():
            try:
                stat_info = item.stat()
                try:
                    # Best effort for true creation time
                    creation_timestamp = stat_info.st_birthtime # macOS, some BSDs
                except AttributeError:
                    creation_timestamp = stat_info.st_ctime # Windows (creation), Linux (inode change)

                file_data = {
                    "name": item.name,
                    "size_bytes": stat_info.st_size,
                    "build_date": datetime.fromtimestamp(creation_timestamp).strftime("%Y-%m-%d %H:%M:%S"),
                    "last_updated": datetime.fromtimestamp(stat_info.st_mtime).strftime("%Y-%m-%d %H:%M:%S")
                }
                all_files_data.append(file_data)
                # print(f"  Processed: {item.name}") # Optional: for verbose logging
            except Exception as e:
                print(f"  Error processing file {item.name}: {e}")

    try:
        with open(output_file_path, 'w') as json_file:
            json.dump(all_files_data, json_file, indent=4)
        print(f"File information successfully written to '{output_file_path}'")
    except IOError as e:
        print(f"Error writing JSON to '{output_file_path}': {e}")

# --- App Data Loading and Merging ---
def load_and_merge_app_data():
    """
    Loads app definitions from apps_manifest.json and merges them with
    file metadata from file_info.json.
    """
    apps_data = []
    file_metadata_lookup = {}

    # 1. Load apps_manifest.json
    if APPS_MANIFEST_PATH.exists():
        try:
            with open(APPS_MANIFEST_PATH, 'r', encoding='utf-8') as f:
                apps_manifest = json.load(f)
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from {APPS_MANIFEST_PATH}: {e}")
            apps_manifest = []
        except IOError as e:
            print(f"Error reading {APPS_MANIFEST_PATH}: {e}")
            apps_manifest = []
    else:
        print(f"Warning: App manifest file '{APPS_MANIFEST_PATH}' not found.")
        apps_manifest = []

    # 2. Load file_info.json and create a lookup dictionary
    if FILE_INFO_PATH.exists():
        try:
            with open(FILE_INFO_PATH, 'r', encoding='utf-8') as f:
                file_info_list = json.load(f)
                for f_info in file_info_list:
                    file_metadata_lookup[f_info["name"]] = f_info
        except json.JSONDecodeError as e:
            print(f"Error decoding JSON from {FILE_INFO_PATH}: {e}")
        except IOError as e:
            print(f"Error reading {FILE_INFO_PATH}: {e}")

    # 3. Merge data
    for app_def in apps_manifest:
        app_info = app_def.copy() # Start with all data from the manifest
        file_name_in_manifest = app_def.get("file_name")

        # Augment with data from file_info.json if a match is found
        if file_name_in_manifest and file_name_in_manifest in file_metadata_lookup:
            file_meta = file_metadata_lookup[file_name_in_manifest]
            app_info["size_bytes"] = file_meta.get("size_bytes")
            app_info["build_date"] = file_meta.get("build_date") # This is the file's creation/build date
            app_info["last_updated"] = file_meta.get("last_updated") # This is the file's last modified date
        else:
            if file_name_in_manifest:
                print(f"Warning: File '{file_name_in_manifest}' (for app '{app_def.get('title', 'Unknown')}') not found in '{FILE_INFO_PATH}'. Metadata like size will be missing.")
            # Set defaults if file metadata is not found
            app_info["size_bytes"] = None
            # If no file data, build_date and last_updated might rely on manifest's release_date or be None
            # The manifest's "release_date" is distinct and kept.
            if "build_date" not in app_info: app_info["build_date"] = None
            if "last_updated" not in app_info: app_info["last_updated"] = None


        # Ensure essential fields for the frontend exist, even if with default values
        app_info.setdefault("id", f"app_{len(apps_data)}") # Generate an ID if missing
        app_info.setdefault("icon", "📦")
        app_info.setdefault("category", "Uncategorized")
        app_info.setdefault("short_desc", "No short description available.")
        app_info.setdefault("long_desc", "No detailed description available.")
        app_info.setdefault("features", [])
        app_info.setdefault("version", "N/A")
        app_info.setdefault("release_date", None) # This is from manifest
        app_info.setdefault("isDecoy", False)
        app_info.setdefault("file_name", None) # Ensure file_name is present

        apps_data.append(app_info)

    return apps_data

# --- Flask Routes ---
@app.route('/')
def storefront_page(): # Assuming attacker.html is your storefront
    """Serves the main storefront page."""
    return render_template('pixelmarket.html')

@app.route('/api/get_apps_data')
def get_apps_data_endpoint():
    """API endpoint to provide merged app data."""
    # Re-run gather_file_info() if you want file stats to be updated per request (costly)
    # Or rely on it running at startup, and manifest changes picked up by load_and_merge_app_data()
    # gather_file_info() # Typically not here for performance; run on startup
    app_data = load_and_merge_app_data()
    return jsonify(app_data)

@app.route('/target')
def target_page():
    """Serves the vulnerable target page for clickjacking demo."""
    return render_template('dldr.html')

@app.route('/file_demo')
def file_system_demo_page():
    """Serves the page demonstrating the File System Access API."""
    return render_template('pixelmarket.html') # Assuming this is intentional


if __name__ == '__main__':
    # Ensure essential directories exist before starting
    APP_INFO_DIR.mkdir(parents=True, exist_ok=True)
    STATIC_BASE_DIR.mkdir(parents=True, exist_ok=True)

    print("Attempting to gather file information...")
    gather_file_info() # Run once on startup to generate/update file_info.json
    print("---------------------------------------")

    # Optional: You can pre-load and print manifest data on startup for quick checks
    # print("Loading initial app manifest data...")
    # initial_apps = load_and_merge_app_data()
    # if not initial_apps:
    #     print("Warning: No app data loaded from manifest. Check 'apps_manifest.json'.")
    # else:
    #     print(f"Successfully loaded {len(initial_apps)} app(s) definitions from manifest.")
    # print("---------------------------------------")

    app.run(debug=True, host='0.0.0.0', port=5221)