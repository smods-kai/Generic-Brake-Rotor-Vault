from pathlib import Path

from config import (
    REPOSITORY,
    IGNORED
)


def get_group_folders():

    groups = []

    for item in REPOSITORY.iterdir():

        if not item.is_dir():
            continue

        if item.name in IGNORED:
            continue

        groups.append(item)

    return sorted(groups)