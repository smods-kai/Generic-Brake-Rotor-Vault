from utils import get_group_folders
import generator

print()

print("="*45)
print(" RotorVault Automation Engine ")
print("="*45)

print()

groups = get_group_folders()

for group in groups:

    print("✓", group.name)

print()

print(f"Groups : {len(groups)}")