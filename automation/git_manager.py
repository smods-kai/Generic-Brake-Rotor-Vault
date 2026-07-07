import subprocess
from pathlib import Path

REPO = Path(__file__).resolve().parent.parent


def git(*args):
    """Run git from the repository root."""
    return subprocess.run(
        ["git", *args],
        cwd=REPO,
        capture_output=True,
        text=True
    )


def has_changes():
    result = git("status", "--porcelain")
    return bool(result.stdout.strip())


def commit_and_push():

    if not has_changes():
        print("No changes detected.")
        return

    print("Staging files...")
    git("add", ".")

    print("Committing...")
    commit = git("commit", "-m", "RotorVault Auto Sync")

    if commit.returncode != 0:
        print(commit.stdout)
        print(commit.stderr)
        return

    print("Pushing...")
    push = git("push")

    if push.returncode == 0:
        print("Repository updated successfully.")
    else:
        print(push.stderr)