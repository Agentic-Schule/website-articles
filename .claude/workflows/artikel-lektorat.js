export const meta = {
  name: 'artikel-lektorat',
  description:
    'Lektoriert agentic.schule-Artikel gegen Johannes Hoppes Schreibrichtlinie: LLM-Floskeln und Ton, Faktenpruefung an Primaerquellen, Begriffseinfuehrung, Leser-Perspektive und eigenstaendige Verstaendlichkeit. Findet, verifiziert adversarial und synthetisiert Befunde.',
  phases: [
    { title: 'Lektorat', detail: 'Fuenf Pruefdimensionen je Artikel', model: 'opus' },
    { title: 'Faktencheck', detail: 'Behauptungen adversarial an der Primaerquelle pruefen, Stil-Befunde gegen Fehlalarm absichern', model: 'opus' },
    { title: 'Synthese', detail: 'Dedup, Ranking und Vollstaendigkeits-Kritik je Artikel', model: 'opus' },
  ],
};

// Alle Agenten auf Opus (per Aufgabenstellung).
const M = 'opus';

// Standard-Ziel: die drei Artikel der Reihe. Ueber args ueberschreibbar:
// ein Pfad als String oder mehrere Pfade als Array (repo-relativ).
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
          quote: { type: 'string', description: 'woertliches Zitat der betroffenen Stelle' },
          issue: { type: 'string', description: 'der konkrete Mangel in einem Satz' },
          rule: { type: 'string', description: 'die verletzte Regel der Schreibrichtlinie' },
          severity: { type: 'string', enum: ['BLOCKER', 'SOLLTE', 'NICE-TO-HAVE'] },
          suggestion: { type: 'string', description: 'knapper Korrekturvorschlag' },
          isFactual: { type: 'boolean', description: 'true, wenn eine ueberpruefbare Tatsachenbehauptung betroffen ist' },
          claimToVerify: { type: 'string', description: 'die an der Primaerquelle zu pruefende Behauptung (falls isFactual)' },
        },
        required: ['line', 'quote', 'issue', 'severity', 'suggestion', 'isFactual'],
      },
    },
  },
  required: ['findings'],
};

const VERDICT_SCHEMA = {
  type: 'object',
  properties: {
    stands: { type: 'boolean', description: 'true, wenn der Befund nach Pruefung bestehen bleibt' },
    verdict: {
      type: 'string',
      enum: ['BESTAETIGT-FALSCH', 'UNBESTAETIGT', 'KORREKT-KEIN-BEFUND', 'STIL-BESTAETIGT', 'STIL-VERWORFEN'],
    },
    source: { type: 'string', description: 'URL + woertliches Zitat (Faktum) oder zitierte Regel (Stil)' },
    reasoning: { type: 'string' },
  },
  required: ['stands', 'verdict', 'reasoning'],
};

// ---------------------------------------------------------------------------
// Gemeinsamer Auftrag fuer alle Lektorats-Agenten
// ---------------------------------------------------------------------------
const SHARED = [
  'Du bist ein sehr gruendlicher Lektor und Fact-Checker fuer Blog-Artikel von Johannes Hoppe (agentic.schule).',
  'Die Artikel erscheinen unter seinem Namen und muessen nach ihm klingen, nicht nach einem Sprachmodell.',
  'Lies die ZIELDATEI komplett. Lies zusaetzlich die Schreibrichtlinie im Repo-Root (Datei CLAUDE.md); sie ist der verbindliche Massstab.',
  'Du aenderst NICHTS an der Datei, du berichtest nur strukturiert.',
  'Fuer jeden Befund: exakte Zeilennummer, WOERTLICHES Zitat der Stelle, der Mangel in einem Satz, die verletzte Regel, Schweregrad (BLOCKER / SOLLTE / NICE-TO-HAVE) und ein knapper Korrekturvorschlag.',
  'Betrifft ein Befund eine ueberpruefbare TATSACHENbehauptung, setze isFactual=true und formuliere in claimToVerify praezise die zu pruefende Behauptung.',
  'Lieber wenige, harte, belegte Befunde als viele weiche. Kein Eigenlob, keine Meta-Erzaehlung, keine Zusammenfassungsfloskeln.',
].join('\n');

// ---------------------------------------------------------------------------
// Die fuenf Pruefdimensionen = die extrahierte Essenz der Regeln und Korrekturen
// ---------------------------------------------------------------------------
const DIMENSIONS = [
  {
    key: 'floskeln',
    prompt: `Pruefdimension: STIL & LLM-FLOSKELN (Johannes' "AI-Tells"). Melde jeden Treffer:
- Gedankenstrich-Einschub (Halbgeviert oder Geviert) als Stilmittel. AUSNAHMEN, die NICHT gemeldet werden: Striche, die in derselben Zeile mit einem <!-- STIL: ... -->-Kommentar als bewusst freigegeben markiert sind; der Strich im Frontmatter-bio-Block; Striche innerhalb woertlicher Zitate. Alle anderen Striche im Fliesstext sind Befunde. Statt Strich gehoert dort ein Punkt (zwei Saetze) oder ein Semikolon.
- "nicht X, sondern Y" als rhetorischer Effekt, samt Varianten "nicht nur X, sondern auch Y" und "Es geht nicht um X, sondern um Y". Rein sachliche Technik-Aussagen ("nicht permanent, sondern nur bei Bedarf") sind erlaubt.
- Zusammenfassungs-Floskeln: "Kurz gesagt", "Mit anderen Worten", "Unterm Strich", "Am Ende des Tages", "Doch damit nicht genug".
- Autoritaets-Floskeln: "Es ist wichtig zu verstehen", "Die Wahrheit ist", "Fakt ist", "In einer Welt, in der ...".
- Bedeutungs-Zeigefinger in Haeufung: "Genau das ist der Punkt", "Das ist die eigentliche Nachricht", "Und genau deshalb".
- Adjektivpaare als Rhythmus-Fuellung ("sauber und elegant"); Fuellwort-Haeufungen, vor allem "eigentlich".
- Erzaehl-Ornamente: dramatisierende Zwischensaetze, die den Text aufblaehen und oft eine sachlich schiefe Behauptung einschmuggeln. Nuechtern und praezise benennen.
- Das Wort "ehrlich" im Artikeltext. Verboten: der Autor liefert Fakten; das Etikett "ehrlich" legt nahe, es gaebe auch Geschoentes. Die Sache direkt benennen.
- Pannen-Erzaehlungen, die den souveraenen Ton brechen: "mir ist das passiert", "das hat mich Aerger gekostet", "erst beim zweiten Mal verstand ich", "meine naive Intuition war ...". Fallen gehoeren als Wissen praesentiert ("das ist eine Falle: ..."), nicht als erlittene Lektion. Trockene Selbstironie und "ich bevorzuge ..." bleiben erlaubt.
- Unbelegte Superlative und Zahlen zur Ausschmueckung. Zahlen nur, wenn fuers Verstaendnis noetig UND belegt; sonst qualitativ. Superlative ohne Beleg gehoeren gehedgt ("in der Regel", "meist", "sehr hoch").
- Recherche-Eigenlob im Text ("sorgfaeltig verifiziert", "die spannendste Erkenntnis meiner Recherche").`,
  },
  {
    key: 'fakten',
    prompt: `Pruefdimension: TATSACHENBEHAUPTUNGEN. Extrahiere jede starke, ueberpruefbare Behauptung und markiere sie mit isFactual=true samt praeziser claimToVerify. Fuehre die Pruefung NICHT selbst zu Ende (das macht die naechste Phase), aber bewerte den Beleg-Status im Artikel.
Achte auf: Versionsnummern, Datumsangaben, Preise, Lizenzen (z. B. Apache 2.0 / MIT / Umsatzklauseln), Parameter- und Kontextgroessen, Quantisierungsgroessen in GB, Befehle und Flags, Ports, Benchmark- und Downloadzahlen, WOERTLICHE Zitate, Rechtsnormen und Aktenzeichen, Produkt- und Policy-Aussagen, Feature-Behauptungen ueber Werkzeuge und Modelle.
Zwei Arten von Befund:
1. Aussage ist praezise nachpruefbar oder wirkt zweifelhaft -> isFactual=true, claimToVerify exakt.
2. Aussage ist stark, steht aber ohne Beleg oder Link da, obwohl die Schreibrichtlinie Belege verlangt -> Befund "unbelegte starke Aussage", isFactual=true.
Erfinde nichts. Kennst du selbst schon eine Primaerquelle, notiere sie im suggestion-Feld. Behaupte nie, etwas sei falsch, ohne Primaerquelle.`,
  },
  {
    key: 'begriffe',
    prompt: `Pruefdimension: BEGRIFFSEINFUEHRUNG & LESER-PERSPEKTIVE. Der Artikel muss aus Sicht eines Lesers Sinn ergeben, der NUR diesen Text hat und bei der Entstehung nicht dabei war.
Melde:
- Fachbegriffe, auf denen der Text argumentiert, BEVOR sie eingefuehrt oder erklaert werden (used-then-defined), und Begriffe, die nie erklaert werden (used-never-defined).
- Englische Fachbegriffe, die bei ERSTER Nennung nicht kursiv gesetzt und nicht kurz deutsch erklaert sind; Akronyme, die bei Erstnennung nicht ausgeschrieben werden.
- Kontextlose Fragmente, die stillschweigend Wissen aus einem Arbeitsdialog voraussetzen: unklare Rueckbezuege ("das", "dieser Block", "wie erwaehnt", "der Fehler von eben"), die im Artikel selbst nirgends aufgeloest werden. Genau die Stellen, die wirken, als seien sie aus einem Chat uebernommen.
- Vorwaertsverweise, die auf noch nicht Erklaertem aufbauen; Verstoesse gegen "erst das Warum, dann der Weg".
Fuer jeden Befund: An welcher Stelle stolpert der uneingeweihte Leser konkret, und welche Einfuehrung fehlt?`,
  },
  {
    key: 'standalone',
    prompt: `Pruefdimension: EIGENSTAENDIGE VERSTAENDLICHKEIT. Nimm an, der Leser hat AUSSCHLIESSLICH diesen einen Artikel gelesen, keinen anderen Teil der Reihe.
Querverweise auf andere Teile sind erlaubt. Ein Befund liegt vor, wenn der Artikel von einem anderen Teil ABHAENGT, um verstaendlich zu sein: wenn eine Praemisse, ein Eigenname oder ein Begriff (etwa Produkt-, Programm- oder Modellnamen wie "Mythos", "Glasswing" oder interne Projektnamen) nur ueber "im ersten Teil ..." existiert und im Artikel selbst nicht so weit erklaert wird, dass der Satz auch allein traegt.
Liste konkret jeden Namen und jede Praemisse auf, die fuer einen Nur-diesen-Artikel-Leser unerklaert bleibt, mit Zeilennummer und Zitat, plus dem minimalen Zusatz, der die Stelle eigenstaendig machen wuerde.`,
  },
  {
    key: 'struktur',
    prompt: `Pruefdimension: AUFBAU & FORMALIA der Schreibrichtlinie. Pruefe:
- Fette These direkt nach dem Frontmatter; danach "## Inhalt" (oder "## Contents") mit [[toc]].
- "Warum" zuerst (Motivation/Problem vor Weg vor Fazit); Brueckensaetze am Sektionsende; Ueberschriften als Frage, Imperativ/Infinitiv oder "Thema: Untertitel"; Abschluss mit persoenlichem Urteil, Handlungsaufruf und Feedback-Einladung.
- Durchgehendes Duzen, kein "Sie" (das Neutrum-"Sie" am Satzanfang zaehlt nicht). Meinung als Meinung markiert ("meiner Meinung nach", "meine Vermutung").
- Echte Umlaute (ae/oe/ue/ss ist verboten, es muss ä ö ü ß heissen); keine harten Zeilenumbrueche mitten im Absatz (Umbruch nur zwischen Absaetzen, Listenpunkten, Ueberschriften).
- Bild-Title-Falle: In Markdown-Bildern der Form ![alt](datei "title") bricht ein gerades ASCII-Anfuehrungszeichen IM title das Bild auf GitHub. Anfuehrungszeichen im title muessen typografisch sein. Pruefe jedes Bild im Artikel.
- Analogien nur sparsam und technisch KORREKT; keine ungenauen Kurzschluesse wie "X ist das GitHub/Docker fuer Y".
- Nur falls im selben Verzeichnis eine englische -EN-Fassung existiert: gleiche Ueberschriften-Struktur und -Reihenfolge, englische Zitate zeichengenau identisch. Existiert keine EN-Fassung, ueberspringe diesen Punkt kommentarlos.`,
  },
];

// ---------------------------------------------------------------------------
// Verifikations-Prompt: Fakten adversarial an der Primaerquelle, Stil gegen Fehlalarm
// ---------------------------------------------------------------------------
const verifyPrompt = (file, fd) => {
  const head = `Pruefe EINEN Lektorats-Befund streng und versuche zunaechst, ihn zu WIDERLEGEN (Grundhaltung: Zweifel).
Datei: ${file}, Zeile ${fd.line}.
Zitat: "${fd.quote}"
Behaupteter Mangel: ${fd.issue}
`;
  const factual = `Das ist eine TATSACHENbehauptung. Zu pruefen: ${fd.claimToVerify || fd.quote}
Verifiziere AUSSCHLIESSLICH an der PRIMAERQUELLE. GitHub nur ueber das gh CLI, nie WebFetch auf github.com.
Webseiten mit curl -sL -A "Mozilla/5.0"; wenn die Seite blockiert oder JS-gerendert ist, lade per ToolSearch "select:mcp__playwright__browser_navigate,mcp__playwright__browser_evaluate" die Playwright-MCP-Tools und lies document.body.innerText. Suchmaschinen-Snippets zaehlen NICHT als Endbeleg.
Erfinde nichts und erfinde keine plausibel klingenden Gegen-Fakten.
Verdikt: BESTAETIGT-FALSCH (Artikel-Aussage nachweislich falsch), KORREKT-KEIN-BEFUND (Artikel-Aussage stimmt, der Befund war ein Fehlalarm) oder UNBESTAETIGT (keine Primaerquelle auffindbar).
stands=true nur, wenn die Artikel-Aussage falsch ist ODER stark und unbelegbar. Trage in source die URL und ein woertliches Zitat der Quelle ein.`;
  const stylistic = `Das ist ein STIL- oder Kohaerenz-Befund. Pruefe an der Schreibrichtlinie (CLAUDE.md im Repo-Root) und am Zitat, ob es WIRKLICH ein Verstoss ist und kein Fehlalarm.
Beachte die erlaubten Ausnahmen: mit <!-- STIL: ... --> markierte Gedankenstriche, der Frontmatter-bio-Block, woertliche Zitate.
Verdikt: STIL-BESTAETIGT (echter Verstoss, stands=true) oder STIL-VERWORFEN (Fehlalarm, stands=false). Zitiere die konkrete Regel in source.`;
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
    agent(`${SHARED}\n\nZIELDATEI: ${it.f}\n\n${it.d.prompt}`, {
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

// Vollstaendigkeits-Kritik je Artikel: was haben die Dimensionen uebersehen?
phase('Synthese');
log(`Nach Pruefung bleiben ${kept.length} von ${deduped.length} Befunden bestehen`);

const gaps = await parallel(
  files.map((f) => () => {
    const known =
      kept.filter((k) => k.file === f).map((k) => `- Z.${k.line}: ${k.issue}`).join('\n') || '(noch keine)';
    return agent(
      `${SHARED}\n\nZIELDATEI: ${f}\n\nPruefdimension: VOLLSTAENDIGKEITS-KRITIK. Die Dimensionen Floskeln, Fakten, Begriffseinfuehrung, eigenstaendige Verstaendlichkeit und Aufbau haben bereits geprueft. Nenne NUR, was sie UEBERSEHEN haben. Keine Wiederholung bekannter Befunde.\nBereits bekannt:\n${known}`,
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
    'befunde sind verifiziert (Fakten an der Primaerquelle, Stil gegen Fehlalarm). weitere_hinweise_ungeprueft stammen aus der Vollstaendigkeits-Kritik und sind noch nicht gegengeprueft.',
};
