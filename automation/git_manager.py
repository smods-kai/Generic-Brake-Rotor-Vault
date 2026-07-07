import subprocess

from config import COMMIT_MESSAGE


def push_changes():

    subprocess.run(["git","add","."])

    subprocess.run(["git","commit","-m",COMMIT_MESSAGE])

    subprocess.run(["git","push"])