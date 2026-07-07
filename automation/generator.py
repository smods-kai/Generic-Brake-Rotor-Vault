import json
import re

from config import DATABASE
from utils import get_group_folders


TITLE_MAP = {
    "BR2WP": "Brake Rotor 2 Pair with Pads",
    "BR2WPH": "Brake Rotor 2 Pair with Pads and Hardware",
    "BRWP": "Brake Rotor Pair with Pads",
    "BRWPH": "Brake Rotor Pair with Pads and Hardware"
}

PAIR_MAP = {
    "BR2WP": 2,
    "BR2WPH": 2,
    "BRWP": 1,
    "BRWPH": 1
}

PADS_MAP = {
    "BR2WP": "Yes",
    "BR2WPH": "Yes",
    "BRWP": "Yes",
    "BRWPH": "Yes"
}

HARDWARE_MAP = {
    "BR2WP": "No",
    "BR2WPH": "Yes",
    "BRWP": "No",
    "BRWPH": "Yes"
}

PREFIX_MAP = {
    "BR2WP": "BR2WPS",
    "BR2WPH": "BR2WPHS",
    "BRWP": "BRWPS",
    "BRWPH": "BRWPHS"
}


def extract_set(folder_name):

    match = re.search(r"SET(\d+)", folder_name)

    if not match:
        return None

    return int(match.group(1))


def generate_database():

    database = []

    groups = get_group_folders()

    for group in groups:

        for folder in sorted(group.iterdir()):

            if not folder.is_dir():
                continue

            number = extract_set(folder.name)

            if number is None:
                continue

            database.append({

                "id": f"SET{number:04d}",

                "title": TITLE_MAP.get(group.name, group.name),

                "position": "Left and Right",

                "rotorType": "Plain",

                "rotorPair": PAIR_MAP.get(group.name, 1),

                "brakePads": PADS_MAP.get(group.name, "No"),

                "hardware": HARDWARE_MAP.get(group.name, "No"),

                "imagesCount": 7,

                "lugHoles": 0,

                "status": "Generic Images",

                "group": group.name,

                "folder": folder.name,

                "prefix": PREFIX_MAP.get(group.name, group.name) + f"{number:04d}"

            })

    database.sort(
        key=lambda item: (
            item["group"],
            item["id"]
        )
    )

    DATABASE.parent.mkdir(parents=True, exist_ok=True)

    with open(DATABASE, "w", encoding="utf-8") as file:

        json.dump(database, file, indent=2)

    print()
    print("=" * 45)
    print(" Database Generated Successfully ")
    print("=" * 45)
    print()
    print(f"Items : {len(database)}")
    print(f"Saved : {DATABASE}")


if __name__ == "__main__":
    generate_database()