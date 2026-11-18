/* Troc'Savoirs – site témoin (données fictives, tout reste dans le navigateur) */
(function () {
  "use strict";

  // ---------- Données fictives ----------
  const CATEGORIES = ["Maths", "Langues", "Logiciels", "Musique", "Sport"];
  const COLORS = ["jaune", "rose", "bleu", "vert", "orange", "lilas"];

  const STUDENTS = [
    { id: "lea", prenom: "Léa", nom: "Moreau", filiere: "L2 Mathématiques", couleur: "jaune", lieu: "BU Sciences", cats: ["Maths", "Logiciels"], skills: ["Algèbre linéaire", "Python"], note: 4.9, avis: 12,
      propose: "Je t'explique les matrices et les espaces vectoriels avec des exos corrigés. On peut aussi débuguer ton code Python ensemble." },
    { id: "yanis", prenom: "Yanis", nom: "Benali", filiere: "LEA Anglais-Espagnol", couleur: "rose", lieu: "BU Lettres", cats: ["Langues"], skills: ["Anglais oral", "Espagnol"], note: 4.8, avis: 9,
      propose: "On parle anglais ou espagnol pendant une heure, sans stress. Parfait pour préparer un oral ou un séjour Erasmus." },
    { id: "ines", prenom: "Inès", nom: "Martin", filiere: "BUT 1 Génie civil", couleur: "bleu", lieu: "BU Brabois Santé", cats: ["Logiciels"], skills: ["Revit", "Dessin technique"], note: 5.0, avis: 7,
      propose: "Je te montre Revit pas à pas : modéliser un bâtiment, sortir des plans et des coupes propres. Parfait si tu débutes pour un projet." },
    { id: "thomas", prenom: "Thomas", nom: "Roussel", filiere: "Licence Musicologie", couleur: "vert", lieu: "BU Lettres", cats: ["Musique"], skills: ["Guitare", "Solfège"], note: 4.7, avis: 15,
      propose: "Premiers accords, rythmiques ou lecture de partition : j'adapte selon ton niveau. Apporte ta guitare si tu en as une !" },
    { id: "camille", prenom: "Camille", nom: "Durand", filiere: "Licence STAPS", couleur: "orange", lieu: "Campus Brabois", cats: ["Sport"], skills: ["Course à pied", "Prépa physique"], note: 4.9, avis: 11,
      propose: "Je t'aide à construire un plan d'entraînement réaliste pour reprendre la course ou préparer un concours." },
    { id: "mehdi", prenom: "Mehdi", nom: "Amrani", filiere: "BUT Informatique", couleur: "lilas", lieu: "En visio", cats: ["Logiciels"], skills: ["Java", "SQL"], note: 4.6, avis: 8,
      propose: "Tes requêtes SQL ne marchent pas ? Ton projet Java plante ? On regarde ça ensemble, pas à pas." },
    { id: "sarah", prenom: "Sarah", nom: "Lefèvre", filiere: "Licence Allemand", couleur: "rose", lieu: "BU Lettres", cats: ["Langues"], skills: ["Allemand", "Grammaire"], note: 4.8, avis: 6,
      propose: "Révisions de grammaire allemande ou conversation : on avance à ton rythme avec des exemples concrets." },
    { id: "hugo", prenom: "Hugo", nom: "Petit", filiere: "L3 Physique", couleur: "bleu", lieu: "BU Sciences", cats: ["Maths"], skills: ["Statistiques", "Analyse"], note: 4.7, avis: 10,
      propose: "Intégrales, séries, lois de probabilité : je t'aide à comprendre la méthode plutôt qu'à apprendre par cœur." }
  ];

  const LEARNERS = {
    noe: { id: "noe", prenom: "Noé", nom: "Garnier", filiere: "L1 Droit", couleur: "vert" }
  };

  const SLOTS = [
    { id: "lun", jour: "Lundi", heure: "14 h – 15 h" },
    { id: "mar", jour: "Mardi", heure: "10 h – 11 h" },
    { id: "jeu", jour: "Jeudi", heure: "16 h – 17 h" },
    { id: "ven", jour: "Vendredi", heure: "12 h – 13 h" }
  ];
  const PLACES = [
    { id: "bu-sciences", nom: "BU Sciences", ico: "📚" },
    { id: "bu-lettres", nom: "BU Lettres", ico: "📖" },
    { id: "bu-brabois", nom: "BU Brabois Santé", ico: "🏛️" },
    { id: "visio", nom: "En visio", ico: "💻" }
  ];

  // Statuts : demandé → accepté → validé (une des deux parties) → terminé
  const STATUS_LABEL = {
    demande: "Demandé",
    accepte: "Accepté",
    valide_eleve: "Validé par l'élève",
    valide_aidant: "Validé par l'aidant",
    termine: "Terminé",
    annule: "Annulé"
  };
  const STATUS_STEP = { demande: 1, accepte: 2, valide_eleve: 3, valide_aidant: 3, termine: 4, annule: 0 };

  // ---------- État (stocké dans le navigateur) ----------
  const KEY = "troc-savoirs-demo-v1";

  function freshState() {
    return {
      prenom: "",
      filiere: "BUT Informatique",
      credits: 3,            // 2 offerts + 1 gagné
      donnees: 1,            // heures données
      recues: 0,             // heures reçues
      sais: ["HTML / CSS", "Excel"],
      cherche: ["Anglais oral", "Statistiques"],
      exchanges: [
        { id: "ex-noe", role: "helper", otherId: "noe", skill: "HTML / CSS", slot: "jeu", lieu: "visio", status: "demande", review: null }
      ]
    };
  }

  let state = load();

  function load() {
    try {
      const raw = localStorage.getItem(KEY);
      if (raw) return Object.assign(freshState(), JSON.parse(raw));
    } catch (e) { /* stockage indisponible : on garde l'état en mémoire */ }
    return freshState();
  }
  function save() {
    try { localStorage.setItem(KEY, JSON.stringify(state)); } catch (e) { /* ignore */ }
  }

  // ---------- Utilitaires ----------
  const $ = (sel, root = document) => root.querySelector(sel);
  const $$ = (sel, root = document) => Array.from(root.querySelectorAll(sel));
  const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" }[c]));
  const norm = (s) => String(s).normalize("NFD").replace(/[̀-ͯ]/g, "").toLowerCase();
  const initials = (p) => esc((p.prenom[0] || "") + (p.nom[0] || "")).toUpperCase();
  const tilt = (i) => ["-1.2deg", "0.8deg", "-0.5deg", "1.1deg", "-0.9deg", "0.4deg"][i % 6];
  const person = (id) => STUDENTS.find((s) => s.id === id) || LEARNERS[id];
  const slotLabel = (id) => { const s = SLOTS.find((x) => x.id === id); return s ? s.jour + " · " + s.heure : ""; };
  const placeLabel = (id) => { const p = PLACES.find((x) => x.id === id); return p ? p.nom : ""; };
  const pending = () => state.exchanges.filter((e) => e.role === "learner" && !["termine", "annule"].includes(e.status)).length;
  const available = () => state.credits - pending();
  const plural = (n, w) => n + " " + w + (Math.abs(n) > 1 ? "s" : "");

  let toastTimer;
  function toast(msg) {
    const t = $("#toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastTimer);
    toastTimer = setTimeout(() => t.classList.remove("show"), 2600);
  }

  function badgesList() {
    return [
      { id: "premiere", ico: "🤝", name: "Première aide", desc: "Donner ta première heure d'aide", got: state.donnees >= 1 },
      { id: "inter", ico: "🔀", name: "Inter-filières", desc: "Aider un étudiant d'une autre filière", got: state.donnees >= 1 },
      { id: "dix", ico: "🏅", name: "10 h données", desc: "Donner 10 heures d'aide", got: state.donnees >= 10, progress: Math.min(state.donnees, 10) / 10, sub: Math.min(state.donnees, 10) + " / 10 h" }
    ];
  }

  function badgeHTML(b) {
    return `<div class="badge ${b.got ? "" : "locked"}">
      <div class="medal" aria-hidden="true">${b.ico}</div>
      <div><div class="name">${esc(b.name)}</div>
      <div class="sub">${b.got ? "Débloqué" : esc(b.sub || "À débloquer")}${b.got ? "" : " · " + esc(b.desc)}</div>
      ${b.progress !== undefined && !b.got ? `<div class="progress"><i style="width:${Math.round(b.progress * 100)}%"></i></div>` : ""}</div>
    </div>`;
  }

  // ---------- Vues ----------
  const view = $("#view");
  const topbar = $("#topbar");
  const nav = $("#bottomnav");

  function renderTopbar(show) {
    topbar.classList.toggle("hidden", !show);
    if (!show) return;
    topbar.innerHTML = `
      <a class="brand" href="#explorer"><img src="logo.svg" alt=""><span>Troc'Savoirs</span></a>
      <a class="credit-pill" href="#profil" aria-label="Solde : ${plural(state.credits, "crédit")}"><span class="coin">1h</span>${plural(state.credits, "crédit")}</a>`;
  }

  // 1. Accueil / connexion
  function vAccueil() {
    return `
      <section class="hero">
        <img src="logo.svg" alt="Logo Troc'Savoirs : deux flèches qui s'échangent">
        <h1>Troc'Savoirs</h1>
        <p class="slogan">Donne ce que tu sais,<br>reçois ce qu'il te manque.</p>
      </section>

      <div class="principle" aria-label="Le principe">
        <div class="postit tape c-jaune" style="--r:-3deg"><span class="big">1 h</span><span class="lbl">donnée</span></div>
        <span class="arrow" aria-hidden="true">→</span>
        <div class="postit tape c-rose" style="--r:2deg"><span class="big">+1</span><span class="lbl">crédit</span></div>
        <span class="arrow" aria-hidden="true">→</span>
        <div class="postit tape c-bleu" style="--r:-1.5deg"><span class="big">1 h</span><span class="lbl">reçue</span></div>
      </div>

      <p class="gift"><strong>2 crédits offerts</strong> à l'inscription !</p>

      <form id="login">
        <label class="field"><span>Ton prénom <span class="muted small">(pour la démo)</span></span>
          <input class="input" name="prenom" maxlength="20" autocomplete="off" placeholder="Alex" value="${esc(state.prenom)}">
        </label>
        <details class="charte">
          <summary>Lire la charte de bonne conduite</summary>
          <ul>
            <li>Je respecte les créneaux réservés, ou je préviens à l'avance.</li>
            <li>Je reste bienveillant·e, que je donne ou que je reçoive de l'aide.</li>
            <li>Je ne fais pas les devoirs à la place de l'autre : j'explique.</li>
            <li>Les crédits ne s'achètent pas et ne se revendent pas.</li>
            <li>Je signale tout comportement inapproprié.</li>
          </ul>
        </details>
        <label class="check"><input type="checkbox" name="ok" required>
          <span>J'accepte la charte de bonne conduite et l'utilisation de mes données pour le service (RGPD). Je peux supprimer mon compte à tout moment.</span>
        </label>
        <button class="btn btn-primary btn-block" type="submit">🎓 Me connecter avec mon compte étudiant</button>
      </form>
      <p class="footnote">Site témoin du projet Troc'Savoirs – BUT 2, IUT Nancy-Brabois.<br>Les étudiants et les échanges affichés sont fictifs.</p>`;
  }

  // 2. Explorer
  let filter = { q: "", cats: [] };

  function vExplorer() {
    const current = state.exchanges.filter((e) => e.role === "learner" && !["termine", "annule"].includes(e.status)).slice(-1)[0];
    const reqHTML = current
      ? `<a class="postit c-lilas request" href="#echanges" style="--r:-.6deg;text-decoration:none">
           <div><strong>${esc(person(current.otherId).prenom)} · ${esc(current.skill)}</strong><br>
           <span class="small">${esc(slotLabel(current.slot))} · ${esc(placeLabel(current.lieu))}</span></div>
           <span class="status">${STATUS_LABEL[current.status]}</span></a>`
      : `<div class="postit c-lilas" style="--r:.6deg"><strong>Aucune demande en cours.</strong>
           <div class="small" style="margin-top:4px">Tu cherches : ${state.cherche.map(esc).join(", ") || "rien pour l'instant"}.</div></div>`;

    return `
      <div class="hello">
        <div>
          <p class="hand" style="font-size:22px;margin:0;color:var(--wood)">Prêt·e à troquer ?</p>
          <h1 class="title">Salut ${esc(state.prenom)} !</h1>
        </div>
        <div class="postit c-jaune balance" style="--r:2deg"><span class="n">${state.credits}</span><span class="l">${state.credits > 1 ? "crédits" : "crédit"}</span></div>
      </div>

      <div class="search">
        <svg viewBox="0 0 24 24" aria-hidden="true"><circle cx="11" cy="11" r="7"/><path d="M20 20l-4-4"/></svg>
        <input class="input" id="q" type="search" placeholder="Que veux-tu apprendre ?" value="${esc(filter.q)}" aria-label="Que veux-tu apprendre ?">
      </div>
      <div class="chips" role="group" aria-label="Filtres">
        ${CATEGORIES.map((c) => `<button class="chip" data-cat="${c}" aria-pressed="${filter.cats.includes(c)}">${c}</button>`).join("")}
      </div>

      <h2 class="section-title">Ta demande</h2>
      ${reqHTML}

      <h2 class="section-title">Ils proposent <span class="hand" id="count"></span></h2>
      <div class="cards" id="cards"></div>`;
  }

  function renderCards() {
    const q = norm(filter.q.trim());
    const list = STUDENTS.filter((s) => {
      const okCat = !filter.cats.length || s.cats.some((c) => filter.cats.includes(c));
      const hay = norm([s.prenom, s.filiere, s.lieu, ...s.skills, ...s.cats].join(" "));
      return okCat && (!q || q.split(/\s+/).every((w) => hay.includes(w)));
    });
    $("#count").textContent = list.length ? "(" + list.length + ")" : "";
    $("#cards").innerHTML = list.length
      ? list.map((s, i) => `
        <a class="postit c-${s.couleur} card" href="#reserver/${s.id}" style="--r:${tilt(i)}">
          <span class="avatar">${initials(s)}</span>
          <span class="body">
            <span class="who">${esc(s.prenom)}</span> <span class="fil">· ${esc(s.filiere)}</span>
            <span class="tags">${s.skills.map((k) => `<span class="tag">${esc(k)}</span>`).join("")}</span>
            <span class="meta"><span>📍 ${esc(s.lieu)} · <span class="stars">★ ${s.note.toFixed(1)}</span></span><span class="price">1 h = 1 crédit</span></span>
          </span>
        </a>`).join("")
      : `<div class="empty"><p class="hand" style="font-size:24px;margin:0">Personne pour l'instant…</p><p class="small">Essaie un autre mot ou retire un filtre.</p></div>`;
  }

  function bindExplorer() {
    renderCards();
    $("#q").addEventListener("input", (e) => { filter.q = e.target.value; renderCards(); });
    $$(".chip").forEach((b) => b.addEventListener("click", () => {
      const c = b.dataset.cat;
      filter.cats = filter.cats.includes(c) ? filter.cats.filter((x) => x !== c) : [...filter.cats, c];
      b.setAttribute("aria-pressed", filter.cats.includes(c));
      renderCards();
    }));
  }

  // 3. Réserver
  let booking = { slot: null, lieu: null };

  function vReserver(id) {
    const s = STUDENTS.find((x) => x.id === id);
    if (!s) return `<p class="empty">Profil introuvable. <a href="#explorer">Retour</a></p>`;
    const defaultPlace = PLACES.find((p) => p.nom === s.lieu);
    booking = { slot: null, lieu: defaultPlace ? defaultPlace.id : null };
    return `
      <a class="back" href="#explorer">← Explorer</a>
      <div class="postit tape c-${s.couleur}" style="--r:-.8deg">
        <div class="profile-head">
          <span class="avatar xl">${initials(s)}</span>
          <div>
            <h1 class="who">${esc(s.prenom)}</h1>
            <div class="small">${esc(s.filiere)}</div>
            <div class="small"><span class="stars">★ ${s.note.toFixed(1)}</span> · ${s.avis} avis</div>
          </div>
        </div>
        <div class="tags">${s.skills.map((k) => `<span class="tag">${esc(k)}</span>`).join("")}</div>
      </div>

      <h2 class="section-title">Ce que je propose</h2>
      <p class="quote">« ${esc(s.propose)} »</p>

      <h2 class="section-title">Choisis un créneau</h2>
      <div class="slots">
        ${SLOTS.map((sl) => `<button class="slot" data-slot="${sl.id}" aria-pressed="false">${sl.jour}<small>${sl.heure}</small></button>`).join("")}
      </div>

      <h2 class="section-title">Où ?</h2>
      <div class="places">
        ${PLACES.map((p) => `<button class="place" data-place="${p.id}" aria-pressed="${booking.lieu === p.id}"><span class="ico" aria-hidden="true">${p.ico}</span>${p.nom}</button>`).join("")}
      </div>

      <div class="cost"><span><strong>Coût</strong><br><span class="small muted">Débité quand vous aurez validé tous les deux</span></span><span class="hand">1 crédit</span></div>
      <button class="btn btn-primary btn-block" id="book" disabled>Réserver 1 h</button>
      <p class="small muted" style="text-align:center;margin-top:10px" id="book-hint">Choisis un créneau pour continuer.</p>
      <button class="link-btn report" id="report">🚩 Signaler ce profil</button>`;
  }

  function bindReserver(id) {
    const s = STUDENTS.find((x) => x.id === id);
    if (!s) return;
    const btn = $("#book"), hint = $("#book-hint");
    const refresh = () => {
      $$(".slot").forEach((b) => b.setAttribute("aria-pressed", b.dataset.slot === booking.slot));
      $$(".place").forEach((b) => b.setAttribute("aria-pressed", b.dataset.place === booking.lieu));
      const ready = booking.slot && booking.lieu;
      if (available() <= 0) {
        btn.disabled = true;
        hint.textContent = "Plus de crédit disponible : donne 1 h d'aide pour en gagner un !";
      } else {
        btn.disabled = !ready;
        hint.textContent = ready ? `${slotLabel(booking.slot)} · ${placeLabel(booking.lieu)}` : !booking.slot ? "Choisis un créneau pour continuer." : "Choisis un lieu pour continuer.";
      }
    };
    $$(".slot").forEach((b) => b.addEventListener("click", () => { booking.slot = b.dataset.slot; refresh(); }));
    $$(".place").forEach((b) => b.addEventListener("click", () => { booking.lieu = b.dataset.place; refresh(); }));
    btn.addEventListener("click", () => {
      if (btn.disabled) return;
      state.exchanges.push({ id: "ex-" + Date.now(), role: "learner", otherId: s.id, skill: s.skills[0], slot: booking.slot, lieu: booking.lieu, status: "demande", review: null });
      save();
      toast(`Demande envoyée à ${s.prenom} ✉️`);
      location.hash = "#echanges";
    });
    $("#report").addEventListener("click", () => toast("Merci, la modération va vérifier ce profil."));
    refresh();
  }

  // Échanges
  function exchangeActions(e) {
    const other = person(e.otherId);
    if (e.role === "learner") {
      switch (e.status) {
        case "demande": return `<button class="btn btn-ghost btn-small" data-act="sim-accept">⏩ Simuler : ${esc(other.prenom)} accepte</button><button class="btn btn-ghost btn-small" data-act="cancel">Annuler</button>`;
        case "accepte": return `<button class="btn btn-primary btn-small" data-act="validate-me">✅ J'ai reçu l'heure : je valide</button>`;
        case "valide_eleve": return `<button class="btn btn-ghost btn-small" data-act="sim-validate">⏩ Simuler : ${esc(other.prenom)} valide aussi</button>`;
      }
    } else {
      switch (e.status) {
        case "demande": return `<button class="btn btn-primary btn-small" data-act="accept">Accepter</button><button class="btn btn-ghost btn-small" data-act="cancel">Refuser</button>`;
        case "accepte": return `<button class="btn btn-primary btn-small" data-act="validate-me">✅ J'ai donné l'heure : je valide</button>`;
        case "valide_aidant": return `<button class="btn btn-ghost btn-small" data-act="sim-validate">⏩ Simuler : ${esc(other.prenom)} valide aussi</button>`;
      }
    }
    if (e.status === "termine" && !e.review) {
      return `<form class="review" data-review style="width:100%">
        <strong>Laisse un avis à ${esc(other.prenom)}</strong>
        <div class="stars-input" role="radiogroup" aria-label="Note sur 5">
          ${[1, 2, 3, 4, 5].map((n) => `<button type="button" data-star="${n}" aria-label="${n} sur 5">★</button>`).join("")}
        </div>
        <textarea class="input" name="txt" maxlength="140" placeholder="Un mot sur l'échange (140 caractères max)"></textarea>
        <button class="btn btn-primary btn-small" type="submit" style="margin-top:8px">Publier l'avis</button>
      </form>`;
    }
    if (e.status === "termine" && e.review) {
      return `<div class="small">Ton avis : <span class="stars">${"★".repeat(e.review.note)}${"☆".repeat(5 - e.review.note)}</span>${e.review.txt ? " « " + esc(e.review.txt) + " »" : ""}</div>`;
    }
    return "";
  }

  function vEchanges() {
    const list = state.exchanges.filter((e) => e.status !== "annule").slice().reverse();
    return `
      <h1 class="title">Mes échanges</h1>
      <p class="muted small" style="margin:6px 0 18px">Le crédit passe d'un compte à l'autre quand <strong>vous avez validé tous les deux</strong>.</p>
      ${list.length ? list.map((e, i) => {
        const o = person(e.otherId);
        const step = STATUS_STEP[e.status];
        return `<div class="postit c-${o.couleur} ex" data-ex="${e.id}" style="--r:${tilt(i)}">
          <div class="ex-top">
            <span class="avatar">${initials(o)}</span>
            <div style="flex:1;min-width:0">
              <div class="ex-role">${e.role === "learner" ? "J'apprends avec" : "J'aide"} ${esc(o.prenom)}</div>
              <div class="small"><strong>${esc(e.skill)}</strong> · ${esc(o.filiere)}</div>
            </div>
            <span class="status">${STATUS_LABEL[e.status]}</span>
          </div>
          <div class="steps" aria-hidden="true">${[1, 2, 3, 4].map((n) => `<i class="${n <= step ? "on" : ""}"></i>`).join("")}</div>
          <div class="small">🗓️ ${esc(slotLabel(e.slot))} · 📍 ${esc(placeLabel(e.lieu))} · ${e.role === "learner" ? "−1 crédit" : "+1 crédit"}</div>
          <div class="ex-actions">${exchangeActions(e)}</div>
        </div>`;
      }).join("") : `<div class="empty"><p class="hand" style="font-size:24px;margin:0">Aucun échange pour l'instant</p><p><a class="btn btn-yellow btn-small" href="#explorer">Trouver de l'aide</a></p></div>`}`;
  }

  function finish(e) {
    e.status = "termine";
    if (e.role === "learner") { state.credits -= 1; state.recues += 1; }
    else { state.credits += 1; state.donnees += 1; }
  }

  function bindEchanges() {
    $$("[data-ex]").forEach((card) => {
      const e = state.exchanges.find((x) => x.id === card.dataset.ex);
      const other = person(e.otherId);
      card.addEventListener("click", (ev) => {
        const b = ev.target.closest("[data-act]");
        if (!b) return;
        const before = badgesList().filter((x) => x.got).length;
        switch (b.dataset.act) {
          case "sim-accept":
          case "accept": e.status = "accepte"; toast(e.role === "learner" ? `${other.prenom} a accepté ton échange !` : "Échange accepté 👍"); break;
          case "cancel": e.status = "annule"; toast("Échange annulé"); break;
          case "validate-me":
            e.status = e.role === "learner" ? "valide_eleve" : "valide_aidant";
            toast(`Validé ! On attend la validation de ${other.prenom}.`);
            break;
          case "sim-validate":
            finish(e);
            toast(e.role === "learner" ? "Échange terminé : −1 crédit" : "Échange terminé : +1 crédit 🎉");
            break;
        }
        save();
        route();
        const after = badgesList().filter((x) => x.got).length;
        if (after > before) setTimeout(() => toast("Nouveau badge débloqué ! 🏅"), 2700);
      });

      const form = card.querySelector("[data-review]");
      if (form) {
        let note = 0;
        const stars = $$("[data-star]", form);
        stars.forEach((s) => s.addEventListener("click", () => {
          note = +s.dataset.star;
          stars.forEach((x) => x.classList.toggle("on", +x.dataset.star <= note));
        }));
        form.addEventListener("submit", (ev) => {
          ev.preventDefault();
          if (!note) { toast("Choisis une note de 1 à 5 ⭐"); return; }
          e.review = { note, txt: form.txt.value.trim().slice(0, 140) };
          save();
          toast("Merci pour ton avis !");
          route();
        });
      }
    });
  }

  // + Proposer une compétence
  function vProposer() {
    return `
      <h1 class="title">Proposer une compétence</h1>
      <p class="hand" style="font-size:22px;color:var(--wood);margin:4px 0 18px">Tout le monde sait quelque chose !</p>
      <form id="propose" class="postit tape c-jaune" style="--r:-.5deg">
        <label class="field"><span>Je sais…</span>
          <input class="input" name="skill" required maxlength="30" placeholder="ex. Excel, Piano, Anglais…">
        </label>
        <label class="field"><span>Catégorie</span>
          <select class="input" name="cat">${CATEGORIES.map((c) => `<option>${c}</option>`).join("")}<option>Autre</option></select>
        </label>
        <label class="field"><span>En deux mots, ce que tu proposes</span>
          <textarea class="input" name="desc" maxlength="160" placeholder="ex. Je t'aide à faire des tableaux croisés dynamiques."></textarea>
        </label>
        <button class="btn btn-primary btn-block" type="submit">Publier sur le tableau</button>
      </form>
      <p class="small muted" style="margin-top:18px">Chaque heure donnée te rapporte <strong>1 crédit</strong>, à dépenser dans n'importe quelle matière.</p>`;
  }
  function bindProposer() {
    $("#propose").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const v = ev.target.skill.value.trim();
      if (!v) return;
      if (!state.sais.some((x) => norm(x) === norm(v))) state.sais.push(v.slice(0, 30));
      save();
      toast(`« ${v} » ajouté à ton profil ✨`);
      location.hash = "#profil";
    });
  }

  // Badges
  function vBadges() {
    return `
      <h1 class="title">Mes badges</h1>
      <p class="muted small" style="margin:6px 0 18px">Les heures que tu donnes débloquent des badges d'engagement.</p>
      <div class="badges big">${badgesList().map(badgeHTML).join("")}</div>`;
  }

  // 4. Mon profil
  function vProfil() {
    const tagRow = (arr) => arr.length ? arr.map((t) => `<span class="tag solid">${esc(t)}</span>`).join("") : `<span class="muted small">Rien pour l'instant</span>`;
    return `
      <div class="profile-head">
        <span class="avatar xl" style="background:var(--board)">${esc((state.prenom[0] || "?").toUpperCase())}</span>
        <div>
          <h1 class="title">${esc(state.prenom)}</h1>
          <div class="small muted">${esc(state.filiere)} · Université de Lorraine</div>
        </div>
      </div>

      <h2 class="section-title">Mon portefeuille</h2>
      <div class="wallet">
        <div class="postit c-jaune" style="--r:-2deg"><span class="n">${state.credits}</span><span class="l">${state.credits > 1 ? "crédits" : "crédit"}</span></div>
        <div class="postit c-vert" style="--r:1.5deg"><span class="n">${state.donnees}</span><span class="l">h données</span></div>
        <div class="postit c-bleu" style="--r:-1deg"><span class="n">${state.recues}</span><span class="l">h reçues</span></div>
      </div>

      <h2 class="section-title">Je sais</h2>
      <div class="tags">${tagRow(state.sais)}</div>
      <h2 class="section-title">Je cherche</h2>
      <div class="tags">${tagRow(state.cherche)}</div>

      <h2 class="section-title">Mes badges</h2>
      <div class="badges">${badgesList().map(badgeHTML).join("")}</div>

      <div class="row-actions">
        <button class="btn btn-yellow btn-block" id="attest">📄 Attestation d'engagement pour mon CV</button>
        <button class="btn btn-ghost btn-block" id="reset">↺ Recommencer la démo</button>
        <button class="link-btn danger" id="delete">Supprimer mon compte</button>
      </div>`;
  }
  function bindProfil() {
    $("#attest").addEventListener("click", () => toast("L'attestation PDF arrive dans une prochaine version 📄"));
    $("#reset").addEventListener("click", () => { state = freshState(); save(); filter = { q: "", cats: [] }; location.hash = "#accueil"; });
    $("#delete").addEventListener("click", () => {
      if (confirm("Supprimer ton compte et toutes tes données ? (démo : rien n'est envoyé, tout est effacé de ce navigateur)")) {
        try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
        state = freshState();
        location.hash = "#accueil";
        toast("Compte supprimé.");
      }
    });
  }

  function bindAccueil() {
    $("#login").addEventListener("submit", (ev) => {
      ev.preventDefault();
      const f = ev.target;
      if (!f.ok.checked) { toast("Accepte la charte pour continuer"); return; }
      state.prenom = (f.prenom.value.trim() || "Alex").slice(0, 20);
      save();
      location.hash = "#explorer";
    });
  }

  // ---------- Routeur ----------
  function route() {
    let [name, arg] = location.hash.replace(/^#/, "").split("/");
    if (!state.prenom) name = "accueil";
    if (!name) name = "explorer";

    const routes = {
      accueil: [vAccueil, bindAccueil],
      explorer: [vExplorer, bindExplorer],
      reserver: [() => vReserver(arg), () => bindReserver(arg)],
      echanges: [vEchanges, bindEchanges],
      proposer: [vProposer, bindProposer],
      badges: [vBadges, null],
      profil: [vProfil, bindProfil]
    };
    if (!routes[name]) name = "explorer";
    const [render, bind] = routes[name];

    const isHome = name === "accueil";
    renderTopbar(!isHome);
    nav.classList.toggle("hidden", isHome);
    view.classList.toggle("no-nav", isHome);
    view.innerHTML = render();
    if (bind) bind();

    const tab = name === "reserver" ? "explorer" : name;
    $$("a[data-tab]", nav).forEach((a) => a.classList.toggle("active", a.dataset.tab === tab));
  }

  let lastName = null;
  window.addEventListener("hashchange", () => {
    const name = location.hash.replace(/^#/, "").split("/")[0];
    route();
    if (name !== lastName) window.scrollTo(0, 0);
    lastName = name;
  });
  route();
})();
