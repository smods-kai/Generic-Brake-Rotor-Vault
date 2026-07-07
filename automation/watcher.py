import time
import re
from pathlib import Path

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

ROOT = Path(__file__).resolve().parent.parent

processed = set()


class RotorWatcher(FileSystemEventHandler):

    def on_created(self, event):

        if not event.is_directory:
            return

        folder = Path(event.src_path)

        name = folder.name

        if not re.match(r".+-SET\d+$", name):
            return

        if name in processed:
            return

        processed.add(name)

        print()
        print("=" * 50)
        print("New SET detected")
        print(name)
        print("=" * 50)

        print("Waiting for copy to finish...")
        time.sleep(5)

        from generator import generate_database
        from git_manager import commit_and_push

        generate_database()

        commit_and_push()


observer = Observer()

observer.schedule(
    RotorWatcher(),
    str(ROOT),
    recursive=True
)

observer.start()

print("RotorVault Automation is running...")
print("Waiting for new SET folders...")

try:
    while True:
        time.sleep(1)

except KeyboardInterrupt:
    observer.stop()

observer.join()