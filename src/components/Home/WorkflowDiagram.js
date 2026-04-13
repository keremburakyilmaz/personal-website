export default function WorkflowDiagram() {
  /*
    Node positions (center x, center y):
    ─────────────────────────────────────
    Start:       (260, 18)
    Router:      (260, 56)  diamond top=44 bot=68 left=246 right=274

    Row 1:  Embed(100,103)   Parse(260,103)   Plan(420,103)    rects h=22 → top=92 bot=114
    Row 2:  VectorDB(100,159) Chunk(260,159)  Agent(420,159)   rects h=22 → top=148 bot=170
    Row 3:  Rerank(100,213)  Summarize(260,213)                rects h=22 → top=202 bot=224
            AgentDmd(420,214) diamond top=202 bot=226

    Row 4:  GradeDmd(100,272) diamond top=258 bot=286
            Search(350,273) Tool(420,273) Code(490,273)        rects h=22 → top=262 bot=284

    Row 5:  Rewrite(48,325)  Context(162,325)                  rects h=22 → top=314 bot=336
            AgentMerge dot (310,322)
            SumDot (260,290)

    Row 6:  Merge(215,368)   rect h=20 → top=358 bot=378
    Row 7:  Generate(215,409) rect h=22 → top=398 bot=420
            Guardrail(380,409) rect h=22 → top=398 bot=420
    Row 8:  ValidDmd(215,452) diamond top=440 bot=464
    End:    (215,476)
  */

  return (
    <div className="workflow-container" aria-hidden="true">
      <svg
        className="workflow-svg"
        viewBox="0 0 520 490"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        {/* ═══════════ EDGES ═══════════ */}

        {/* Start → Router */}
        <line x1="260" y1="22" x2="260" y2="44" className="wf-edge" />

        {/* Router → 3 branches (from diamond tips) */}
        <line x1="246" y1="56" x2="127" y2="92" className="wf-edge" />
        <line x1="260" y1="68" x2="260" y2="92" className="wf-edge" />
        <line x1="274" y1="56" x2="393" y2="92" className="wf-edge" />

        {/* Left branch: Embed → VectorDB → Rerank */}
        <line x1="100" y1="114" x2="100" y2="148" className="wf-edge" />
        <line x1="100" y1="170" x2="100" y2="202" className="wf-edge" />

        {/* Center: Parse → Chunk → Summarize */}
        <line x1="260" y1="114" x2="260" y2="148" className="wf-edge" />
        <line x1="260" y1="170" x2="260" y2="202" className="wf-edge" />

        {/* Right: Plan → Agent → Agent diamond */}
        <line x1="420" y1="114" x2="420" y2="148" className="wf-edge" />
        <line x1="420" y1="170" x2="420" y2="202" className="wf-edge" />

        {/* Agent diamond → Search / Tool / Code */}
        <line x1="406" y1="214" x2="377" y2="262" className="wf-edge" />
        <line x1="420" y1="226" x2="420" y2="262" className="wf-edge" />
        <line x1="434" y1="214" x2="468" y2="262" className="wf-edge" />

        {/* Search → AgentMerge dot */}
        <line x1="350" y1="284" x2="310" y2="322" className="wf-edge" />
        {/* Tool → AgentMerge dot */}
        <line x1="420" y1="284" x2="310" y2="322" className="wf-edge" />

        {/* Code → Agent loop */}
        <path d="M 512,273 C 518,260 518,170 447,159" className="wf-edge wf-edge-loop" />

        {/* Rerank → Grade diamond */}
        <line x1="100" y1="224" x2="100" y2="258" className="wf-edge" />

        {/* Grade → Rewrite (left branch) */}
        <line x1="86" y1="272" x2="62" y2="314" className="wf-edge" />
        {/* Grade → Context (right branch) */}
        <line x1="114" y1="272" x2="145" y2="314" className="wf-edge" />

        {/* Rewrite → Embed loop */}
        <path d="M 21,325 C -4,300 -4,120 73,103" className="wf-edge wf-edge-loop" />

        {/* Summarize → SumDot */}
        <line x1="260" y1="224" x2="260" y2="290" className="wf-edge" />

        {/* Context → Merge */}
        <line x1="162" y1="336" x2="200" y2="358" className="wf-edge" />
        {/* SumDot → Merge */}
        <line x1="260" y1="290" x2="230" y2="358" className="wf-edge" />
        {/* AgentMerge → Merge */}
        <line x1="310" y1="322" x2="242" y2="358" className="wf-edge" />

        {/* Merge → Generate */}
        <line x1="215" y1="378" x2="215" y2="398" className="wf-edge" />

        {/* Generate → Validate */}
        <line x1="215" y1="420" x2="215" y2="440" className="wf-edge" />

        {/* Validate → End */}
        <line x1="215" y1="464" x2="215" y2="476" className="wf-edge" />

        {/* Validate → Guardrail */}
        <line x1="229" y1="452" x2="353" y2="409" className="wf-edge" />

        {/* Guardrail → Generate loop */}
        <path d="M 380,398 C 380,375 310,375 247,398" className="wf-edge wf-edge-loop" />

        {/* ═══════════ NODES ═══════════ */}

        {/* Start */}
        <circle cx="260" cy="18" r="4.5" className="wf-node wf-start" />

        {/* Router diamond */}
        <polygon points="260,44 274,56 260,68 246,56" className="wf-node wf-diamond" />

        {/* ── Row 1 ── */}
        <rect x="73" y="92" width="54" height="22" rx="5" className="wf-node wf-rect" />
        <text x="100" y="107" className="wf-text">Embed</text>

        <rect x="233" y="92" width="54" height="22" rx="5" className="wf-node wf-rect" />
        <text x="260" y="107" className="wf-text">Parse</text>

        <rect x="393" y="92" width="54" height="22" rx="5" className="wf-node wf-rect" />
        <text x="420" y="107" className="wf-text">Plan</text>

        {/* ── Row 2 ── */}
        <rect x="68" y="148" width="64" height="22" rx="5" className="wf-node wf-rect" />
        <text x="100" y="163" className="wf-text">VectorDB</text>

        <rect x="233" y="148" width="54" height="22" rx="5" className="wf-node wf-rect" />
        <text x="260" y="163" className="wf-text">Chunk</text>

        <rect x="393" y="148" width="54" height="22" rx="5" className="wf-node wf-rect" />
        <text x="420" y="163" className="wf-text">Agent</text>

        {/* ── Row 3 ── */}
        <rect x="73" y="202" width="54" height="22" rx="5" className="wf-node wf-rect" />
        <text x="100" y="217" className="wf-text">Rerank</text>

        <rect x="225" y="202" width="70" height="22" rx="5" className="wf-node wf-rect" />
        <text x="260" y="217" className="wf-text">Summarize</text>

        <polygon points="420,202 434,214 420,226 406,214" className="wf-node wf-diamond" />

        {/* ── Row 4 ── */}
        <polygon points="100,258 114,272 100,286 86,272" className="wf-node wf-diamond" />

        <rect x="323" y="262" width="54" height="22" rx="5" className="wf-node wf-rect" />
        <text x="350" y="277" className="wf-text">Search</text>

        <rect x="393" y="262" width="54" height="22" rx="5" className="wf-node wf-rect" />
        <text x="420" y="277" className="wf-text">Tool</text>

        <rect x="468" y="262" width="44" height="22" rx="5" className="wf-node wf-rect" />
        <text x="490" y="277" className="wf-text">Code</text>

        {/* ── Row 5 ── */}
        <rect x="21" y="314" width="54" height="22" rx="5" className="wf-node wf-rect" />
        <text x="48" y="329" className="wf-text">Rewrite</text>

        <rect x="133" y="314" width="58" height="22" rx="5" className="wf-node wf-rect" />
        <text x="162" y="329" className="wf-text">Context</text>

        {/* Junction dots */}
        <circle cx="310" cy="322" r="3" className="wf-node wf-start" style={{opacity: 0.4}} />
        <circle cx="260" cy="290" r="2.5" className="wf-node wf-start" style={{opacity: 0.3}} />

        {/* ── Bottom ── */}
        <rect x="188" y="358" width="54" height="20" rx="5" className="wf-node wf-rect" />
        <text x="215" y="372" className="wf-text">Merge</text>

        <rect x="183" y="398" width="64" height="22" rx="5" className="wf-node wf-rect" />
        <text x="215" y="413" className="wf-text">Generate</text>

        <rect x="353" y="398" width="54" height="22" rx="5" className="wf-node wf-rect" />
        <text x="380" y="413" className="wf-text">Guardrail</text>

        <polygon points="215,440 229,452 215,464 201,452" className="wf-node wf-diamond" />

        <circle cx="215" cy="480" r="4.5" className="wf-node wf-end" />

        {/* ═══════════ PULSES ═══════════ */}

        {/* RAG path */}
        <circle r="2.5" className="wf-pulse">
          <animateMotion
            dur="7s"
            repeatCount="indefinite"
            path="M 260,18 L 260,56 L 100,103 L 100,159 L 100,213 L 100,272 L 162,325 L 215,368 L 215,409 L 215,452 L 215,480"
          />
        </circle>

        {/* Agent path */}
        <circle r="2" className="wf-pulse wf-pulse-alt">
          <animateMotion
            dur="6s"
            repeatCount="indefinite"
            begin="1s"
            path="M 260,56 L 420,103 L 420,159 L 420,214 L 420,273 L 310,322 L 215,368"
          />
        </circle>

        {/* Center path */}
        <circle r="2" className="wf-pulse wf-pulse-alt">
          <animateMotion
            dur="5s"
            repeatCount="indefinite"
            begin="0.5s"
            path="M 260,56 L 260,103 L 260,159 L 260,213 L 260,290 L 215,368"
          />
        </circle>

        {/* Rewrite loop */}
        <circle r="1.8" className="wf-pulse wf-pulse-alt">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            begin="3.5s"
            path="M 86,272 L 48,325 C -4,300 -4,120 73,103 L 100,103"
          />
        </circle>

        {/* Code → Agent loop */}
        <circle r="1.8" className="wf-pulse wf-pulse-alt">
          <animateMotion
            dur="2.8s"
            repeatCount="indefinite"
            begin="2.5s"
            path="M 512,273 C 518,260 518,170 447,159 L 420,159"
          />
        </circle>

        {/* Guardrail loop */}
        <circle r="1.8" className="wf-pulse wf-pulse-alt">
          <animateMotion
            dur="3s"
            repeatCount="indefinite"
            begin="5s"
            path="M 229,452 L 380,409 C 380,375 310,375 247,398 L 215,409"
          />
        </circle>
      </svg>
    </div>
  );
}
