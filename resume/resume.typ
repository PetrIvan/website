#let background = rgb("#f4efe6")
#let foreground = rgb("#28231f")
#let muted = rgb("#71675e")
#let border = rgb("#d8cec0")
#let accent = rgb("#845044")

#let row-gap = 0.55em
#let content-gap = 0.7em
#let entry-gap = 1.15em
#let section-above = 1.6em
#let section-below = 0.9em

#set document(
  title: "Petr Ivan - Resume",
  author: "Petr Ivan",
  keywords: ("machine learning", "music technology", "software engineering"),
)

#set page(
  paper: "a4",
  margin: (x: 12mm, y: 10mm),
  fill: background,
)

#set text(
  font: "Figtree",
  size: 9pt,
  weight: 400,
  fill: foreground,
  hyphenate: false,
)
#set par(leading: 0.85em, spacing: 0.85em)
#set block(spacing: 1em)
#set list(
  marker: [#text(fill: accent)[•]],
  indent: 8pt,
  body-indent: 4pt,
  spacing: 0.85em,
)
#show list: set text(fill: muted)
#show link: set text(fill: accent)

#let open-icon = box(
  baseline: 12%,
  image("open-24-filled.svg", height: 0.72em),
)

#let external-link(destination, label) = link(
  destination,
  box[#label#h(0.2em)#open-icon],
)

#let section-heading(label) = block(
  above: section-above,
  below: section-below,
  breakable: false,
)[
  #grid(
    columns: (1fr,),
    row-gutter: row-gap,
    text(size: 10.5pt, weight: 650, fill: accent, tracking: 0.055em)[#label],
    line(length: 100%, stroke: 0.45pt + border),
  )
]

#let dated-heading(title, subtitle, dates) = grid(
  columns: (1fr, auto),
  rows: (auto, auto),
  column-gutter: 3mm,
  row-gutter: row-gap,
  align: (left, right),
  text(size: 9.8pt, weight: 650)[#title],
  align(
    right,
    text(size: 8.3pt, weight: 500, fill: muted)[#dates],
  ),
  text(size: 8.6pt, weight: 550, fill: accent)[#subtitle],
  [],
)

#let compact-heading(title, dates) = grid(
  columns: (1fr, auto),
  column-gutter: 3mm,
  align: (left, right),
  text(size: 9.4pt, weight: 650)[#title],
  align(
    right,
    text(size: 8.2pt, weight: 500, fill: muted)[#dates],
  ),
)

#let education(title, subtitle, dates, note: none) = block(
  below: entry-gap,
  breakable: false,
)[
  #if note == none [
    #grid(
      columns: (1fr,),
      row-gutter: row-gap,
      compact-heading(title, dates),
      text(size: 8.6pt, weight: 550, fill: accent)[#subtitle],
    )
  ] else [
    #grid(
      columns: (1fr,),
      row-gutter: row-gap,
      compact-heading(title, dates),
      text(size: 8.6pt, weight: 550, fill: accent)[#subtitle],
      text(size: 8.5pt, fill: muted)[#note],
    )
  ]
]

#let award(title, dates, body) = block(
  below: entry-gap,
  breakable: false,
)[
  #grid(
    columns: (1fr,),
    row-gutter: content-gap,
    compact-heading(title, dates),
    text(size: 8.6pt, fill: muted)[#body],
  )
]

#let experience(
  title,
  subtitle,
  dates,
  body,
  highlights: none,
  below: entry-gap,
) = block(
  below: below,
  breakable: false,
)[
  #if highlights == none [
    #grid(
      columns: (1fr,),
      row-gutter: content-gap,
      dated-heading(title, subtitle, dates),
      text(size: 8.7pt, fill: muted)[#body],
    )
  ] else [
    #grid(
      columns: (1fr,),
      row-gutter: (content-gap, 1em),
      dated-heading(title, subtitle, dates),
      text(size: 8.7pt, fill: muted)[#body],
      block(width: 100%)[#highlights],
    )
  ]
]

#let project(title, dates, body, below: entry-gap) = block(
  below: below,
  breakable: false,
)[
  #grid(
    columns: (1fr,),
    row-gutter: content-gap,
    compact-heading(title, dates),
    text(size: 8.7pt, fill: muted)[#body],
  )
]

#let detail-label(label, body) = block(width: 100%, below: 0.65em)[
  #text(size: 8.7pt, weight: 650)[#label]
  #text(size: 8.7pt, fill: muted)[ #body]
]

#place(top + right)[
  #set par(leading: 0.55em)
  #align(
    right,
    text(size: 8.8pt, fill: muted)[
      #external-link("mailto:hi@petrivan.com", [hi\@petrivan.com])
      #linebreak()
      #external-link("https://www.linkedin.com/in/petr-ivan", [linkedin.com/in/petr-ivan])
      #linebreak()
      #external-link("https://github.com/PetrIvan", [github.com/PetrIvan])
      #linebreak()
      #external-link("https://petrivan.com", [petrivan.com])
    ],
  )
]
#stack(
  dir: ttb,
  spacing: 0.9em,
  text(
    size: 27pt,
    weight: 650,
    tracking: -0.035em,
    top-edge: "bounds",
    bottom-edge: "bounds",
  )[Petr Ivan],
  text(
    size: 11pt,
    weight: 550,
    fill: accent,
    top-edge: "bounds",
    bottom-edge: "bounds",
  )[Machine learning engineer · CS at TU Delft],
  block(width: 65%)[
    #text(
      size: 9.3pt,
      fill: muted,
      top-edge: "bounds",
      bottom-edge: "bounds",
    )[
      Machine learning engineer working across model development, production inference,
      and product delivery, with a focus on music and creative software. Creator of
      ChordSeqAI, formerly Lead AI Engineer on Mozart AI, and Computer Science and
      Engineering student at TU Delft.
    ]
  ]
)
#v(2.6mm)
#line(length: 100%, stroke: 0.65pt + border)
#v(1.2mm)
#grid(
  columns: (1fr, 1fr),
  column-gutter: 8mm,
  align: top,
  [
    #section-heading("EXPERIENCE")
    #experience(
      [Lead AI Engineer],
      [Arthos · Mozart AI],
      [May 2025 – Jun 2026],
      [
        Joined Arthos as its first non-founding engineer before the launch of Mozart AI.
        Built and shipped machine learning systems for generative music and audio-to-MIDI.
      ],
      highlights: list(
        [Developed Transformer-based models for MIDI generation and audio-to-MIDI transcription.],
        [Built streaming data, training, evaluation, release, and model-comparison pipelines.],
        [Optimized production inference with ONNX Runtime, TensorRT, batching, memory-aware concurrency, and GCP deployment.],
        [Integrated ML into the React/TypeScript DAW; also contributed to Vibe Sessions, social features, infrastructure, and CI/CD.],
        [
          Co-authored the #external-link(
            "https://openreview.net/forum?id=7lB2t6tDpW",
            [Mozart AI demo paper],
          ) for the NeurIPS 2025 AI4Music workshop.
        ],
      ),
    )
    #experience(
      [Trainee],
      [Student Trainee Center],
      [Jan 2022 – Dec 2023],
      [
        Completed a selective two-year apprenticeship supported by Microsoft, focused on
        modern technologies and soft skills. Built ChordSeqAI as the final project and
        graduated with distinction.
      ],
    )

    #section-heading("EDUCATION")
    #education(
      [Delft University of Technology],
      [BSc Computer Science and Engineering],
      [Sep 2025 – 2028],
      note: [GPA: 9.67/10],
    )

    #section-heading("PROJECTS")
    #project(
      [#external-link("https://petrivan.com/projects/chordseqai/", [ChordSeqAI])],
      [Sep 2023 – present],
      [
        Open-source composition tool combining chord-sequence models with local browser
        inference, an editable timeline, playback, and export. Reached 5,000+ peak monthly
        active users.
      ],
    )
    #project(
      [#external-link("https://petrivan.com/projects/ai-cup-2026/", [AI Cup 2026])],
      [Apr 2026],
      [
        Placed first overall among 89 teams and presented at the Dutch AI Congress.
        Co-built the top-ranked Kaggle classifier and C++/ONNX deployment prototype,
        contributing to modelling and system design.
      ],
    )
    #project(
      [
        #external-link(
          "https://petrivan.com/projects/entitatis-mundus/",
          [Entitatis Mundus],
        )
      ],
      [Aug 2022],
      [
        Solo 2D platformer built in Unity in one week; handled code, pixel art, music, and
        level design. Ranked \#86 overall and \#30 in game design among 1,046 entries.
      ],
      below: 0mm,
    )
  ],
  [
    #section-heading("HONORS & AWARDS")
    #award(
      [Coding Competition · 3rd Nationally],
      [Jun 2025],
      [
        Four-hour contest spanning game development and algorithm design. Won the district
        and regional rounds before placing 3rd nationally.
      ],
    )
    #award(
      [Learned Society of the Czech Republic],
      [May 2025],
      [Award for secondary-school students for ChordSeqAI.],
    )
    #award(
      [Taiwan International Science Fair],
      [Jan 2025],
      [
        Second Award in Computer Science and Information Engineering for ChordSeqAI.
        Represented Czechia among more than 30 countries.
      ],
    )
    #award(
      [Jaroslav Heyrovský Endowment Fund Prize],
      [Dec 2024],
      [National recognition for ChordSeqAI research, awarded at the Czech Academy of Sciences.],
    )
    #award(
      [Students' Professional Activities],
      [Jun 2024],
      [1st place nationally in Computer Science for ChordSeqAI.],
    )

    #section-heading("SKILLS")
    #detail-label([Languages:], [Python, TypeScript, Java, C++, C\#])
    #detail-label([ML:], [PyTorch, Transformers, ONNX Runtime, TensorRT, DSP])
    #detail-label([Web:], [React, Svelte, Next.js, Tailwind CSS])
    #detail-label([Infrastructure:], [GCP, Docker, Git, CI/CD])

    #section-heading("CERTIFICATIONS")
    #detail-label([Machine Learning in Production], [\- DeepLearning.AI])
    #detail-label([GANs Specialization], [\- DeepLearning.AI])
    #detail-label([Deep Learning Specialization], [\- DeepLearning.AI])
    #detail-label(
      [Cambridge Certificate in Advanced English],
      [\- C2, score 204],
    )
    #detail-label([Test of Russian as a Foreign Language (TORFL-I):], [B1])

    #section-heading("TEST SCORES")
    #detail-label([SAT:], [1570 · Math 800 · 99th percentile])

    #section-heading("LANGUAGES")
    #detail-label([English:], [C2, certified])
    #detail-label([Czech:], [native])
    #detail-label([Russian:], [B1, certified])
  ],
)
