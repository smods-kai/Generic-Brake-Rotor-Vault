import json
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent.parent

SETTINGS_FILE = Path(__file__).parent / "settings.json"

with open(SETTINGS_FILE, "r", encoding="utf-8") as file:
    SETTINGS = json.load(file)

REPOSITORY = BASE_DIR

PROCESSOR = BASE_DIR / SETTINGS["processor_folder"]

DATABASE = BASE_DIR / SETTINGS["database_path"]

IGNORED = set(SETTINGS["ignored_folders"])

EXTENSIONS = tuple(
    SETTINGS["watch_extensions"]
)

IMAGES_PER_SET = SETTINGS["images_per_set"]

COMMIT_MESSAGE = SETTINGS["commit_message"]