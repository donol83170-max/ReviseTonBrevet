import re, json, os

BASE = os.path.dirname(os.path.abspath(__file__))

files = {
    "maths": ["calcul", "geometrie", "fonctions", "stats", "equations"],
    "francais": ["grammaire", "figures", "redaction", "lecture", "orthographe"],
    "histoire-geo": ["ww1", "ww2", "veme", "mondialisation", "developpement"],
    "svt": ["corps-humain", "genetique", "ecologie", "reproduction", "microbiologie"],
    "physique-chimie": ["mecanique", "electricite", "chimie", "optique", "energie"],
}

result = {}

for matiere, themes in files.items():
    result[matiere] = {}
    for theme in themes:
        path = os.path.join(BASE, "themes", matiere, f"{theme}.html")
        with open(path, encoding="utf-8") as f:
            html = f.read()

        # Find initQCM([...]);
        m = re.search(r'initQCM\(\s*(\[[\s\S]*?\])\s*\);', html)
        if not m:
            print(f"❌ No QCM in {matiere}/{theme}")
            result[matiere][theme] = []
            continue

        raw = m.group(1)

        # Convert JS to valid JSON:
        # 1. Remove trailing commas before ] or }
        raw = re.sub(r',(\s*[}\]])', r'\1', raw)
        # 2. Replace single-quoted strings with double-quoted (simple approach)
        # 3. Escape backslashes in strings already escaped
        # Actually the files use double quotes already, let's try direct parse
        try:
            questions = json.loads(raw)
            result[matiere][theme] = questions
            print(f"✓ {matiere}/{theme}: {len(questions)} questions")
        except Exception as e:
            print(f"❌ Parse error {matiere}/{theme}: {e}")
            # Try to extract manually question by question
            result[matiere][theme] = f"PARSE ERROR: {str(e)[:100]}"

out = os.path.join(BASE, "qcm_all.json")
with open(out, "w", encoding="utf-8") as f:
    json.dump(result, f, ensure_ascii=False, indent=2)

print(f"\n✅ qcm_all.json généré !")
