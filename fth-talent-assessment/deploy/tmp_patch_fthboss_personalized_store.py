from pathlib import Path
import shutil
import time

p = Path("/opt/fthboss-talent-assessment/service.py")
stamp = time.strftime("%Y%m%d-%H%M%S")
shutil.copy2(p, f"{p}.bak-personalized-{stamp}")
s = p.read_text()
if '"personalizedReport": payload.get("personalizedReport", {}),' not in s:
    s = s.replace(
'''            "partnerGuide": payload.get("partnerGuide", []),
            "teamManual": payload.get("teamManual", []),
''',
'''            "personalizedReport": payload.get("personalizedReport", {}),
            "partnerGuide": payload.get("partnerGuide", []),
            "teamManual": payload.get("teamManual", []),
''')
p.write_text(s)
print(f"backup: {p}.bak-personalized-{stamp}")
