// age gate condiviso con la home OurVelvet (stessa chiave di conferma18())
(function () {
  function ok() { try { return ["vh_18", "vh_studio_18", "vh_ms_18"].some(function (k) { return sessionStorage.getItem(k) === "1"; }); } catch (e) { return false; } }
  window.is18 = ok;
  document.addEventListener("DOMContentLoaded", function () {
    if (ok()) return;
    var g = document.createElement("div"); g.id = "gate";
    g.innerHTML = '<div class="box"><span class="badge-18">SOLO 18+</span><h1 style="margin:14px 0 8px;font-size:22px;">OurVelvet · stanza riservata</h1>' +
      '<p class="sub">Contenuti e link per adulti. Entri solo se sei maggiorenne e accetti consenso esplicito e safeword <strong>ROSSO</strong>. Niente minori né personaggi dall\'aspetto minorile.</p>' +
      '<button class="primary" id="gateYes" style="width:100%;margin-top:6px;">Ho 18 anni o più · Entra</button>' +
      '<a class="btn-link" style="display:block;margin-top:10px;" href="https://www.google.com/">Esci</a></div>';
    document.body.appendChild(g);
    document.getElementById("gateYes").onclick = function () { try { sessionStorage.setItem("vh_18", "1"); } catch (e) {} g.remove(); };
  });
})();
window.esc = function (s) { return String(s == null ? "" : s).replace(/[&<>"']/g, function (c) { return { "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]; }); };
window.api = async function (path, opts) {
  var r = await fetch("/ai-directory/api" + path, opts ? { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(opts) } : undefined);
  try { return await r.json(); } catch (e) { return { ok: false, error: "Risposta non valida (" + r.status + ")" }; }
};
