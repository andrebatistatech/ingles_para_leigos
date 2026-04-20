"""
Parse _gen_*.js files and output seed-full.sql.
Run: python supabase/build_seed.py
"""
import re, json, sys
from pathlib import Path

ROOT = Path(__file__).parent

def escape_sql(s):
    return s.replace("'", "''")

def fmt_options(opts):
    # opts is a Python list, serialize as JSON then SQL-escape
    j = json.dumps(opts, ensure_ascii=False)
    return "'" + j.replace("'", "''") + "'"

rows = []

def MC(level, difficulty, topic, question_text, options, correct_answer, explanation, study_tip):
    opts = fmt_options(options)
    return (
        f"('{level}',{difficulty},'multiple_choice','{escape_sql(topic)}',"
        f"'{escape_sql(question_text)}',{opts},"
        f"'{escape_sql(correct_answer)}','{escape_sql(explanation)}','{escape_sql(study_tip)}',60)"
    )

def ES(level, difficulty, topic, question_text, correct_answer, explanation, study_tip):
    return (
        f"('{level}',{difficulty},'essay','{escape_sql(topic)}',"
        f"'{escape_sql(question_text)}',NULL,"
        f"'{escape_sql(correct_answer)}','{escape_sql(explanation)}','{escape_sql(study_tip)}',120)"
    )

# ---- parse each _gen_*.js file ----
# Strategy: exec the JS-like array literals by converting them to Python.
# The arrays use single-quoted strings with '' escaping — valid Python too!
# We extract the array bodies and eval them as Python.

ARRAY_RE = re.compile(
    r'const\s+(\w+)\s*=\s*(\[[\s\S]*?\]);',
    re.MULTILINE
)

def parse_js_array(text):
    """Convert JS array literal to Python list. JS '' in strings = Python ''."""
    # JS single-quoted strings with '' apostrophe are valid Python too.
    # Just eval.
    try:
        return eval(text)
    except Exception as e:
        print(f"  eval error: {e}", file=sys.stderr)
        print(f"  snippet: {text[:200]}", file=sys.stderr)
        raise

# Map var name patterns to (level, difficulty, type)
VAR_RE = re.compile(r'^([abc][12])d([123])_(mc|es)$')
LEVEL_MAP = {
    'a1':'A1','a2':'A2','b1':'B1','b2':'B2','c1':'C1','c2':'C2'
}

files = sorted(ROOT.glob('_gen*.js'))
print(f"Found {len(files)} gen files")

for fpath in files:
    src = fpath.read_text(encoding='utf-8')
    arrays = ARRAY_RE.findall(src)
    print(f"  {fpath.name}: {len(arrays)} arrays")
    for var_name, arr_text in arrays:
        m = VAR_RE.match(var_name)
        if not m:
            continue
        level = LEVEL_MAP[m.group(1)]
        diff = int(m.group(2))
        qtype = m.group(3)  # mc or es
        data = parse_js_array(arr_text)
        for item in data:
            item = list(item)
            topic = item[0]
            if qtype == 'mc':
                # [topic, question_text, options, correct_answer, explanation, study_tip]
                rows.append(MC(level, diff, topic, item[1], item[2], item[3], item[4], item[5]))
            else:
                # [topic, question_text, correct_answer, explanation, study_tip]
                rows.append(ES(level, diff, topic, item[1], item[2], item[3], item[4]))

print(f"Total rows: {len(rows)}")

out = ROOT / 'seed-full.sql'
lines = [
    "-- seed-full.sql: questions generated from _gen_*.js files",
    "-- Run in Supabase SQL Editor after seed.sql",
    "",
    "INSERT INTO questions (level, difficulty, type, topic, question_text, options, correct_answer, explanation, study_tip, time_limit_seconds) VALUES",
    ",\n".join(rows),
    ";",
]
out.write_text("\n".join(lines), encoding='utf-8')
print(f"Written to {out}")
