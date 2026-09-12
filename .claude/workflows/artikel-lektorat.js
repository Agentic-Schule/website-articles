export const meta = {
  name: 'artikel-lektorat',
  description:
    'Lektoriert agentic.schule-Artikel gegen Johannes Hoppes Schreibrichtlinie: LLM-Floskeln und Ton, Faktenprüfung an Primärquellen, Begriffseinführung, Leser-Perspektive und eigenständige Verständlichkeit. Findet, verifiziert adversarial und synthetisiert Befunde.',
  phases: [
    { title: 'Lektorat', detail: 'Fünf Prüfdimensionen je Artikel', model: 'opus' },
    { title: 'Faktencheck', detail: 'Behauptungen adversarial an der Primärquelle prüfen, Stil-Befunde gegen Fehlalarm absichern', model: 'opus' },
    { title: 'Synthese', detail: 'Dedup, Ranking und Vollständigkeits-Kritik je Artikel', model: 'opus' },
  ],
};

// Alle Agenten auf Opus (per Aufgabenstellung).
const M = 'opus';

// Standard-Ziel: die drei Artikel der Reihe. Über args überschreibbar:
// ein Pfad als String oder mehrere Pfade als Array. Am robustesten sind
// absolute Pfade, dann findet der Workflow die Dateien unabhängig vom
// Arbeitsverzeichnis (wichtig, wenn die Artikel in einem Worktree-Branch liegen).
const DEFAULT_ARTICLES = [
  'blog/2026-09-the-asymmetry-problem-DE/README.md',
  'blog/2026-09-ungezuegelte-ai-DE/README.md',
  'blog/2026-09-strix-pentest-agent-DE/README.md',
];
const files = Array.isArray(args)
  ? args
  : typeof args === 'string' && args.trim()
    ? [args.trim()]
    : DEFAULT_ARTICLES;

const short = (p) => p.split('/').filter(Boolean).slice(-2).join('/');
// Repo-Wurzel aus dem Artikelpfad ableiten (…/<repo>/blog/<artikel>/README.md),
// damit die Schreibrichtlinie CLAUDE.md aus demselben Checkout gelesen wird.
const repoRootOf = (p) => {
  const i = p.indexOf('/blog/');
  return i > 0 ? p.slice(0, i) : '.';
};

// ---------------------------------------------------------------------------
// Schemas
// ---------------------------------------------------------------------------
const FINDINGS_SCHEMA = {
  type: 'object',
  properties: {
    findings: {
      type: 'array',
      items: {
        type: 'object',
        properties: {
          line: { type: 'integer', description: '1-basierte Zeilennummer im Artikel' },
          quote: { type: 'string', description: 'wörtliches Zitat der betroffenen Stelle' },
          issue: { type: 'string', description: 'der konkrete Mangel in einem Satz' },
          rule: { type: 'string', description: 'die verletzte Regel der Schreibrichtlinie' },
          severity: { type: 'string', enum: ['BLOCKER', 'SOLLTE', 'NICE-TO-HAVE'] },
          suggestion: { type: 'string', description: 'knapper Korrekturvorschlag' },
          isFactual: { type: 'boolean', description: 'true, wenn eine überprüfbare Tatsachenbehauptung betroffen ist' },
          claimToVerify: { type: 'string', description: 'die an der Primärquelle zu prüfende Behauptung (falls isFactual)' },
        },
        required: ['line', 'quote', 'issue', 'severity', 'suggestion', 'isFactual'],
      },
    },
  },
  required: ['findings'],
};

// Verdikt-Werte sind interne Status-Token (ASCII), die der Agent exakt zurückgibt.
const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    stands: { type: 'boolean', description: 'true, wenn der Befund nach Prüfung bestehen bleibt' },
    verdict: {
      type: 'string',
      enum: ['FAKT-FALSCH', 'FAKT-UNBESTAETIGT', 'FAKT-KORREKT', 'STIL-BESTAETIGT', 'STIL-VERWORFEN'],
    },
    source: { type: 'string', description: 'URL + wörtliches Zitat (Faktum) oder zitierte Regel (Stil)' },
    reasoning: { type: 'string' },
  },
  required: ['stands', 'verdict', 'reasoning'],
};

// ---------------------------------------------------------------------------
// Gemeinsamer Auftrag für alle Lektorats-Agenten
// ---------------------------------------------------------------------------
const SHARED = [
  'Du bist ein sehr gründlicher Lektor und Fact-Checker für Blog-Artikel von Johannes Hoppe (agentic.schule).',
  'Die Artikel erscheinen unter seinem Namen und müssen nach ihm klingen, nicht nach einem Sprachmodell.',
  'Lies die ZIELDATEI komplett. Lies zusätzlich die Schreibrichtlinie CLAUDE.md (ihr Pfad steht unten bei SCHREIBRICHTLINIE); sie ist der verbindliche Maßstab.',
  'Du änderst NICHTS an der Datei, du berichtest nur strukturiert.',
  'Für jeden Befund: exakte Zeilennummer, WÖRTLICHES Zitat der Stelle, der Mangel in einem Satz, die verletzte Regel, Schweregrad (BLOCKER / SOLLTE / NICE-TO-HAVE) und ein knapper Korrekturvorschlag.',
  'Betrifft ein Befund eine überprüfbare TATSACHENbehauptung, setze isFactual=true und formuliere in claimToVerify präzise die zu prüfende Behauptung.',
  'Lieber wenige, harte, belegte Befunde als viele weiche. Kein Eigenlob, keine Meta-Erzählung, keine Zusammenfassungsfloskeln.',
].join('\n');

// ---------------------------------------------------------------------------
// Die fünf Prüfdimensionen = die extrahierte Essenz der Regeln und Korrekturen
// ---------------------------------------------------------------------------
const DIMENSIONS = [
  {
    key: 'floskeln',
    prompt: `Prüfdimension: STIL & LLM-FLOSKELN (Johannes' "AI-Tells"). Melde jeden Treffer:
- Gedankenstrich-Einschub (Halbgeviert oder Geviert) als Stilmittel. AUSNAHMEN, die NICHT gemeldet werden: Striche, die in derselben Zeile mit einem <!-- STIL: ... -->-Kommentar als bewusst freigegeben markiert sind; der Strich im Frontmatter-bio-Block; Striche innerhalb wörtlicher Zitate. Alle anderen Striche im Fließtext sind Befunde. Statt Strich gehört dort ein Punkt (zwei Sätze) oder ein Semikolon.
- "nicht X, sondern Y" als rhetorischer Effekt, samt Varianten "nicht nur X, sondern auch Y" und "Es geht nicht um X, sondern um Y". Rein sachliche Technik-Aussagen ("nicht permanent, sondern nur bei Bedarf") sind erlaubt.
- Zusammenfassungs-Floskeln: "Kurz gesagt", "Mit anderen Worten", "Unterm Strich", "Am Ende des Tages", "Doch damit nicht genug".
- Autoritäts-Floskeln: "Es ist wichtig zu verstehen", "Die Wahrheit ist", "Fakt ist", "In einer Welt, in der ...".
- Bedeutungs-Zeigefinger in Häufung: "Genau das ist der Punkt", "Das ist die eigentliche Nachricht", "Und genau deshalb".
- Adjektivpaare als Rhythmus-Füllung ("sauber und elegant"); Füllwort-Häufungen, vor allem "eigentlich".
- Erzähl-Ornamente: dramatisierende Zwischensätze, die den Text aufblähen und oft eine sachlich schiefe Behauptung einschmuggeln. Nüchtern und präzise benennen.
- Das Wort "ehrlich" im Artikeltext. Verboten: der Autor liefert Fakten; das Etikett "ehrlich" legt nahe, es gäbe auch Geschöntes. Die Sache direkt benennen.
- Pannen-Erzählungen, die den souveränen Ton brechen: "mir ist das passiert", "das hat mich Ärger gekostet", "erst beim zweiten Mal verstand ich", "meine naive Intuition war ...". Fallen gehören als Wissen präsentiert ("das ist eine Falle: ..."), nicht als erlittene Lektion. Trockene Selbstironie und "ich bevorzuge ..." bleiben erlaubt.
- Unbelegte Superlative und Zahlen zur Ausschmückung. Zahlen nur, wenn fürs Verständnis nötig UND belegt; sonst qualitativ. Superlative ohne Beleg gehören gehedgt ("in der Regel", "meist", "sehr hoch").
- Recherche-Eigenlob im Text ("sorgfältig verifiziert", "die spannendste Erkenntnis meiner Recherche").`,
  },
  {
    key: 'fakten',
    prompt: `Prüfdimension: TATSACHENBEHAUPTUNGEN. Extrahiere jede starke, überprüfbare Behauptung und markiere sie mit isFactual=true samt präziser claimToVerify. Führe die Prüfung NICHT selbst zu Ende (das macht die nächste Phase), aber bewerte den Beleg-Status im Artikel.
Achte auf: Versionsnummern, Datumsangaben, Preise, Lizenzen (z. B. Apache 2.0 / MIT / Umsatzklauseln), Parameter- und Kontextgrößen, Quantisierungsgrößen in GB, Befehle und Flags, Ports, Benchmark- und Downloadzahlen, WÖRTLICHE Zitate, Rechtsnormen und Aktenzeichen, Produkt- und Policy-Aussagen, Feature-Behauptungen über Werkzeuge und Modelle.
Zwei Arten von Befund:
1. Aussage ist präzise nachprüfbar oder wirkt zweifelhaft -> isFactual=true, claimToVerify exakt.
2. Aussage ist stark, steht aber ohne Beleg oder Link da, obwohl die Schreibrichtlinie Belege verlangt -> Befund "unbelegte starke Aussage", isFactual=true.
Erfinde nichts. Kennst du selbst schon eine Primärquelle, notiere sie im suggestion-Feld. Behaupte nie, etwas sei falsch, ohne Primärquelle.`,
  },
  {
    key: 'begriffe',
    prompt: `Prüfdimension: BEGRIFFSEINFÜHRUNG & LESER-PERSPEKTIVE. Der Artikel muss aus Sicht eines Lesers Sinn ergeben, der NUR diesen Text hat und bei der Entstehung nicht dabei war.
Melde:
- Fachbegriffe, auf denen der Text argumentiert, BEVOR sie eingeführt oder erklärt werden (used-then-defined), und Begriffe, die nie erklärt werden (used-never-defined).
- Englische Fachbegriffe, die bei ERSTER Nennung nicht kursiv gesetzt und nicht kurz deutsch erklärt sind; Akronyme, die bei Erstnennung nicht ausgeschrieben werden. Häufige, dem technischen Publikum geläufige Akronyme (LLM, GPU, VM, CI, MCP) sind KEIN Befund.
- Kontextlose Fragmente, die stillschweigend Wissen aus einem Arbeitsdialog voraussetzen: unklare Rückbezüge ("das", "dieser Block", "wie erwähnt", "der Fehler von eben"), die im Artikel selbst nirgends aufgelöst werden. Genau die Stellen, die wirken, als seien sie aus einem Chat übernommen.
- Vorwärtsverweise, die auf noch nicht Erklärtem aufbauen; Verstöße gegen "erst das Warum, dann der Weg".
Für jeden Befund: An welcher Stelle stolpert der uneingeweihte Leser konkret, und welche Einführung fehlt?`,
  },
  {
    key: 'standalone',
    prompt: `Prüfdimension: EIGENSTÄNDIGE VERSTÄNDLICHKEIT. Nimm an, der Leser hat AUSSCHLIESSLICH diesen einen Artikel gelesen, keinen anderen Teil der Reihe.
Querverweise auf andere Teile sind erlaubt. Ein Befund liegt vor, wenn der Artikel von einem anderen Teil ABHÄNGT, um verständlich zu sein: wenn eine Prämisse, ein Eigenname oder ein Begriff (etwa Produkt-, Programm- oder Modellnamen) nur über "im ersten Teil ..." existiert und im Artikel selbst nicht so weit erklärt wird, dass der Satz auch allein trägt.
Liste konkret jeden Namen und jede Prämisse auf, die für einen Nur-diesen-Artikel-Leser unerklärt bleibt, mit Zeilennummer und Zitat, plus dem minimalen Zusatz, der die Stelle eigenständig machen würde.`,
  },
  {
    key: 'struktur',
    prompt: `Prüfdimension: AUFBAU & FORMALIA der Schreibrichtlinie. Prüfe:
- Fette These direkt nach dem Frontmatter; danach "## Inhalt" (oder "## Contents") mit [[toc]].
- "Warum" zuerst (Motivation/Problem vor Weg vor Fazit); Brückensätze am Sektionsende; Überschriften als Frage, Imperativ/Infinitiv oder "Thema: Untertitel"; Abschluss mit persönlichem Urteil, Handlungsaufruf und Feedback-Einladung.
- Durchgehendes Duzen, kein "Sie" (das Neutrum-"Sie" am Satzanfang zählt nicht). Meinung als Meinung markiert ("meiner Meinung nach", "meine Vermutung").
- Echte Umlaute (ae/oe/ue/ss ist verboten, es muss ä ö ü ß heißen); keine harten Zeilenumbrüche mitten im Absatz (Umbruch nur zwischen Absätzen, Listenpunkten, Überschriften).
- Bild-Title-Falle: In Markdown-Bildern der Form ![alt](datei "title") bricht ein gerades ASCII-Anführungszeichen IM title das Bild auf GitHub. Anführungszeichen im title müssen typografisch sein. Prüfe jedes Bild im Artikel.
- Analogien nur sparsam und technisch KORREKT; keine ungenauen Kurzschlüsse wie "X ist das GitHub/Docker für Y".
- Nur falls im selben Verzeichnis eine englische -EN-Fassung existiert: gleiche Überschriften-Struktur und -Reihenfolge, englische Zitate zeichengenau identisch. Existiert keine EN-Fassung, überspringe diesen Punkt kommentarlos.`,
  },
];

// ---------------------------------------------------------------------------
// Verifikations-Prompt: Fakten adversarial an der Primärquelle, Stil gegen Fehlalarm
// ---------------------------------------------------------------------------
const verifyPrompt = (file, fd) => {
  const head = `Prüfe EINEN Lektorats-Befund streng und versuche zunächst, ihn zu WIDERLEGEN (Grundhaltung: Zweifel).
Datei: ${file}, Zeile ${fd.line}.
Zitat: "${fd.quote}"
Behaupteter Mangel: ${fd.issue}
`;
  const factual = `Das ist eine TATSACHENbehauptung. Zu prüfen: ${fd.claimToVerify || fd.quote}
Verifiziere AUSSCHLIESSLICH an der PRIMÄRQUELLE. GitHub nur über das gh CLI, nie WebFetch auf github.com.
Webseiten mit curl -sL -A "Mozilla/5.0"; wenn die Seite blockiert oder JS-gerendert ist, lade per ToolSearch "select:mcp__playwright__browser_navigate,mcp__playwright__browser_evaluate" die Playwright-MCP-Tools und lies document.body.innerText. Suchmaschinen-Snippets zählen NICHT als Endbeleg.
Erfinde nichts und erfinde keine plausibel klingenden Gegen-Fakten.
Verdikt: FAKT-FALSCH (Artikel-Aussage nachweislich falsch), FAKT-KORREKT (Artikel-Aussage stimmt, der Befund war ein Fehlalarm) oder FAKT-UNBESTAETIGT (keine Primärquelle auffindbar).
stands=true nur, wenn die Artikel-Aussage falsch ist ODER stark und unbelegbar. Trage in source die URL und ein wörtliches Zitat der Quelle ein.`;
  const stylistic = `Das ist ein STIL- oder Kohärenz-Befund. Prüfe an der Schreibrichtlinie (${repoRootOf(file)}/CLAUDE.md) und am Zitat, ob es WIRKLICH ein Verstoß ist und kein Fehlalarm.
Beachte die erlaubten Ausnahmen: mit <!-- STIL: ... --> markierte Gedankenstriche, der Frontmatter-bio-Block, wörtliche Zitate, sowie geläufige Akronyme (LLM, GPU, VM, CI, MCP), die nicht ausgeschrieben werden müssen.
Verdikt: STIL-BESTAETIGT (echter Verstoß, stands=true) oder STIL-VERWORFEN (Fehlalarm, stands=false). Zitiere die konkrete Regel in source.`;
  return head + (fd.isFactual ? factual : stylistic);
};

// ---------------------------------------------------------------------------
// Lauf: Lektorat -> Faktencheck (pro Befund, ohne Barriere) -> Synthese
// ---------------------------------------------------------------------------
phase('Lektorat');
log(`Lektorat: ${files.length} Artikel x ${DIMENSIONS.length} Dimensionen auf ${M}`);

const items = [];
for (const f of files) for (const d of DIMENSIONS) items.push({ f, d });

const reviewed = await pipeline(
  items,
  (it) =>
    agent(`${SHARED}\n\nZIELDATEI: ${it.f}\nSCHREIBRICHTLINIE: ${repoRootOf(it.f)}/CLAUDE.md\n\n${it.d.prompt}`, {
      label: `lektorat:${short(it.f)}:${it.d.key}`,
      phase: 'Lektorat',
      schema: FINDINGS_SCHEMA,
      model: M,
    }).then((r) => ({ file: it.f, dim: it.d.key, findings: (r && r.findings) || [] })),
  (res) =>
    parallel(
      res.findings.map((fd) => () =>
        agent(verifyPrompt(res.file, fd), {
          label: `check:${short(res.file)}:${fd.line}`,
          phase: 'Faktencheck',
          schema: VERDICT_SCHEMA,
          model: M,
        })
          .then((v) => ({ ...fd, file: res.file, dim: res.dim, verdict: v }))
          .catch(() => null),
      ),
    ),
);

// Verifizierte Befunde einsammeln und deduplizieren.
const all = reviewed.flat().filter(Boolean);
const seen = new Set();
const deduped = [];
for (const x of all) {
  const key = `${x.file}#${x.line}#${(x.issue || '').slice(0, 50)}`;
  if (seen.has(key)) continue;
  seen.add(key);
  deduped.push(x);
}
const kept = deduped.filter((x) => x.verdict && x.verdict.stands);

// Vollständigkeits-Kritik je Artikel: was haben die Dimensionen übersehen?
phase('Synthese');
log(`Nach Prüfung bleiben ${kept.length} von ${deduped.length} Befunden bestehen`);

const gaps = await parallel(
  files.map((f) => () => {
    const known =
      kept.filter((k) => k.file === f).map((k) => `- Z.${k.line}: ${k.issue}`).join('\n') || '(noch keine)';
    return agent(
      `${SHARED}\n\nZIELDATEI: ${f}\nSCHREIBRICHTLINIE: ${repoRootOf(f)}/CLAUDE.md\n\nPrüfdimension: VOLLSTÄNDIGKEITS-KRITIK. Die Dimensionen Floskeln, Fakten, Begriffseinführung, eigenständige Verständlichkeit und Aufbau haben bereits geprüft. Nenne NUR, was sie ÜBERSEHEN haben. Keine Wiederholung bekannter Befunde.\nBereits bekannt:\n${known}`,
      { label: `kritik:${short(f)}`, phase: 'Synthese', schema: FINDINGS_SCHEMA, model: M },
    )
      .then((r) => ({ file: f, findings: (r && r.findings) || [] }))
      .catch(() => ({ file: f, findings: [] }));
  }),
);

// Ergebnis nach Artikel gruppieren und nach Schweregrad sortieren.
const rank = { BLOCKER: 0, SOLLTE: 1, 'NICE-TO-HAVE': 2 };
const je_artikel = {};
for (const f of files) {
  je_artikel[f] = {
    befunde: kept
      .filter((k) => k.file === f)
      .sort((a, b) => (rank[a.severity] - rank[b.severity]) || (a.line - b.line))
      .map((k) => ({
        zeile: k.line,
        schwere: k.severity,
        dimension: k.dim,
        zitat: k.quote,
        mangel: k.issue,
        regel: k.rule,
        vorschlag: k.suggestion,
        verdikt: k.verdict && k.verdict.verdict,
        quelle: k.verdict && k.verdict.source,
      })),
    weitere_hinweise_ungeprueft: (gaps.find((g) => g && g.file === f) || { findings: [] }).findings,
  };
}

return {
  gepruefte_artikel: files,
  befunde_gesamt: kept.length,
  je_artikel,
  hinweis:
    'befunde sind verifiziert (Fakten an der Primärquelle, Stil gegen Fehlalarm). weitere_hinweise_ungeprueft stammen aus der Vollständigkeits-Kritik und sind noch nicht gegengeprüft.',
};
