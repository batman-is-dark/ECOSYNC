import os

def dir_size_mb(path):
    total = 0
    for root, _, files in os.walk(path):
        for f in files:
            try:
                total += os.path.getsize(os.path.join(root, f))
            except Exception:
                pass
    return round(total / 1024 / 1024, 2)

for name in sorted(os.listdir('.')):
    if os.path.isdir(name):
        print(f"{name} {dir_size_mb(name)} MB")
