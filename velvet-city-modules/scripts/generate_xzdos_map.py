import subprocess, re, json, datetime

raw = subprocess.check_output(["nginx", "-T"], stderr=subprocess.DEVNULL, text=True)
blocks = re.split(r'(?=\bserver\s*\{)', raw)

domains = []
for b in blocks:
    m_sn = re.search(r'\bserver_name\s+([^;]+);', b)
    if not m_sn:
        continue
    sn = m_sn.group(1).strip()
    if "x-zdos.it" not in sn:
        continue
    listen = re.findall(r'\blisten\s+([^;]+);', b)
    root_m = re.search(r'\broot\s+([^;]+);', b)
    ret_m = re.findall(r'\breturn\s+([^;]+);', b)
    locs = []
    for lm in re.finditer(r'location\s+([^{]+)\{([^}]*)\}', b, re.S):
        path = " ".join(lm.group(1).split())
        body = lm.group(2)
        target = []
        for k in ("proxy_pass", "alias", "root", "return", "rewrite", "try_files"):
            for km in re.findall(rf'\b{k}\s+([^;]+);', body):
                target.append(f"{k} {km.strip()}")
        locs.append({"path": path, "rules": target})
    domains.append({
        "server_name": sn,
        "listen": [x.strip() for x in listen],
        "root": root_m.group(1).strip() if root_m else "",
        "server_returns": [x.strip() for x in ret_m],
        "locations": locs
    })

now = datetime.datetime.now().strftime("%Y-%m-%d %H:%M:%S")
md_lines = [
    "# 🌐 MAPPA COMPLETA REINDIRIZZAMENTI & ENDPOINT `x-zdos.it` (VELVET CITY / ZDOS)",
    f"**Ultimo aggiornamento automatico:** `{now}` · **VPS:** `vmi3082470` · **Regole 18+:** Consenso esplicito · Safeword `ROSSO`",
    "",
    "---",
    ""
]

for d in domains:
    md_lines.append(f"## 🔹 Dominio: `{d['server_name']}`")
    md_lines.append(f"- **Listen:** `{', '.join(d['listen'])}`")
    if d["root"]:
        md_lines.append(f"- **Root statica:** `{d['root']}`")
    if d["server_returns"]:
        md_lines.append(f"- **Redirect server:** `{'; '.join(d['server_returns'])}`")
    if d["locations"]:
        md_lines.append("")
        md_lines.append("| Sub-Path / Route | Destinazione / Regola Nginx |")
        md_lines.append("| :--- | :--- |")
        for l in d["locations"]:
            r_str = " · ".join(l["rules"]) if l["rules"] else "ereditato"
            md_lines.append(f"| `{l['path']}` | `{r_str}` |")
    md_lines.append("")

md_text = "\n".join(md_lines)
open("/root/MAPPA_REINDIRIZZAMENTI_XZDOS.md", "w", encoding="utf-8").write(md_text)
open("/var/www/velvethub/dist/public/map/redirects.json", "w", encoding="utf-8").write(json.dumps({"updated": now, "domains": domains}, indent=2))
print(f"Documento generato: /root/MAPPA_REINDIRIZZAMENTI_XZDOS.md ({len(domains)} blocchi server)")
