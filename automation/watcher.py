import time
from pathlib import Path

from watchdog.observers import Observer
from watchdog.events import FileSystemEventHandler

import generator
import git_manager
import notifier

WATCH_PATH = Path(__file__).resolve().parent.parent


class VaultHandler(FileSystemEventHandler):

    def __init__(self):

        self.last_event = 0

    def on_any_event(self, event):

        if event.is_directory:
            return

        now = time.time()

        if now - self.last_event < 3:
            return

        self.last_event = now

        print("\nChanges detected...")

        time.sleep(3)

        generator.generate_database()

        git_manager.push_changes()

        notifier.notify("RotorVault", "Repository updated successfully.")


observer = Observer()

observer.schedule(
    VaultHandler(),
    str(WATCH_PATH),
    recursive=True
)

observer.start()

print("Watching repository...")

try:

    while True:
        time.sleep(1)

except KeyboardInterrupt:

    observer.stop()

observer.join()