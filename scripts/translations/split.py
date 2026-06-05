"""split.py"""

import sys
import json
import os

OUTPUT_PATH = sys.argv[1]
translations = json.load(sys.stdin)

for language_code, translation_data in translations.items():
    output_file_path = os.path.join(OUTPUT_PATH, f"{language_code}.json")

    # Preserve custom keys not present in HA translations
    existing = {}
    if os.path.exists(output_file_path):
        with open(output_file_path, encoding="utf-8") as f:
            existing = json.load(f)

    merged = {**existing, **translation_data}

    with open(output_file_path, "w", encoding="utf-8") as output_file:
        json.dump(merged, output_file, indent="\t", sort_keys=True, ensure_ascii=False)
        output_file.write("\n")
