# Moon Gate Journey / 月洞门游园

## Design Purpose

`Moon Gate Journey` is a short, mobile-first interactive web experience for a university English class on appreciating Chinese culture. The students are not architecture majors. They should first encounter four ideas from Chinese classical gardens through English-led visual observation, then use those ideas in an enjoyable scene-based game.

The learning objective is not to memorize garden terminology. It is to notice how a Chinese classical garden creates feeling through framing, poetic associations, changing views, and an unforced relationship with nature, and to express those observations in concise English.

## Confirmed Classroom Context

- Audience: university students in an English-language Chinese culture appreciation class.
- Use: one student may demonstrate on the classroom screen while all other students open the same URL on their phones and play individually.
- Session length: approximately 6 minutes per student, with no account, server result collection, or live leaderboard.
- Primary language: elegant, accessible American English; short Chinese terms remain as cultural anchors.
- Required sequence: students must complete the learning walk before the interactive assessment unlocks.
- Music: local `bgm.mp3` plays only during the game phase, when provided in the project asset folder.

## Source Content Interpretation

The supplied slide is condensed into four memorable principles:

| Principle | Chinese Anchor | Student-Facing Meaning |
| --- | --- | --- |
| Contrast and Balance | 对比与平衡 | A small opening can reveal a surprisingly large world; restraint can increase grandeur. |
| Poetic and Artistic Refinement | 诗画的雅趣 | A garden is a walkable painting shaped by names, reflections, calligraphy, and cultured feeling. |
| Diversity and Harmony | 多样性与和谐性 | Winding paths, shifting light, layers, and concealment make every step reveal a new scene. |
| Naturalness and Simplicity | 自然与质朴 | The garden follows mountain and water, making human craft feel at peace with nature. |

## Experience Direction

The aesthetic direction is a living Jiangnan album leaf: refined ink-and-mineral-color garden paintings brought gently into motion. It should feel cultured and luminous rather than beige or museum-static.

- Palette: rice paper ivory, pine green, lake teal, cinnabar-lotus coral, mineral blue, and aged gold.
- Typography: expressive high-contrast Latin serif for English titles; dignified Song/Ming-inspired Chinese serif for anchors.
- Materials: fibrous paper grain, translucent mist, window lattice shadows, seal-like accents, watery reflections.
- Motion: slow parallax water and mist, moon-gate reveals, ripple feedback, sliding screens, restrained ink-spread transitions.
- Memorable visual idea: students repeatedly see the garden through changing frames, so `changing views with changing steps` is experienced rather than merely defined.

## Journey Structure

### 1. Arrival / Entry Gate: 20-30 seconds

The first screen is a full-height garden vista framed through a moon gate. It introduces:

- Title: `Moon Gate Journey`
- Subtitle: `Learn to see a Chinese classical garden`
- Chinese anchor: `月洞门游园`
- Primary action: `Enter the Garden`
- Time note: `A six-minute visual journey`

The view responds lightly to pointer or device movement. No music plays yet.

### 2. Learn / Four Changing Views: approximately 2 minutes

Students pass through four horizontal or swipeable framed garden views. Each view includes one short listening control and one guided observation interaction. A progress path records all four learned principles; the game remains locked until all are visited.

| Stop | Scene and Interaction | On-Screen English Learning Line | Spoken Audio Script |
| --- | --- | --- | --- |
| `01 / Framed Vastness` | Tap a carved window to reveal distant pavilion, water, and rockery through a small opening. | `A limited opening makes the world beyond it feel larger.` | `Notice the small window and the wide scene beyond it. In a Chinese classical garden, restraint can make space feel vast. This is contrast and balance.` |
| `02 / A Walkable Painting` | Drag across water to awaken a reflection and uncover a poetic pavilion name plaque. | `A garden invites us to walk inside a painting and a poem.` | `Reflection, a poetic name, and quiet architecture turn the garden into a three-dimensional landscape painting. This is poetic and artistic refinement.` |
| `03 / Changing Views` | Swipe along a winding path; foreground bamboo slides away to reveal a new composition. | `Every step can open another view, without losing harmony.` | `A winding path hides and reveals. Light, shadow, layers, and empty space create variety while the whole garden remains harmonious.` |
| `04 / Made to Feel Natural` | Slowly lift mist to see rocks, water, pavilion and trees nestled together. | `Craft is most graceful when it seems to follow nature.` | `Here, buildings do not dominate mountain and water. Human design settles quietly into the landscape. This is naturalness and simplicity.` |

Listening controls are labelled `Listen · American English`. The delivered project includes four concise, pre-recorded American-English narration assets so the classroom hears the same phrasing and accent. If an individual narration asset fails to load, its button may use a labelled `en-US device voice` fallback while the visible transcript remains available.

### 3. Transition to Play: 10 seconds

After the fourth stop, the learned terms gather into a garden map. A prompt appears:

`The garden is unfinished. Complete five choices with a seeing eye.`

Pressing `Begin the Challenge` enters play, starts `bgm.mp3` only after the student's tap, and reveals a decorative spinning record audio control.

### 4. Play / Complete the Garden: approximately 3 minutes

The assessment consists of five brisk, visually meaningful decisions. The first four each focus on one principle; the fifth returns to the image's special emphasis on concealment, layered depth and empty space as an integrated aesthetic judgment. Students do not answer text-heavy quizzes; they select, reveal, or arrange views. Each response immediately gives a short English explanation without disclosing a long lecture.

| Question | Player Action | Principle Assessed | Correct Visual Rationale |
| --- | --- | --- | --- |
| `Choose the most expansive view.` | Select between two moon-gate/window compositions. | Contrast and Balance | A restrained opening frames depth and makes a modest garden feel vast. |
| `Name the pavilion that completes the mood.` | Select one of three short English poetic names for a reflective waterside pavilion: `Hall of Bright Echoes`, `Meeting Room`, `Large Waterfront Building`. | Poetic and Artistic Refinement | A poetic name extends the emotional and painterly experience rather than merely describing function. |
| `Guide the visitor's path.` | Tap one of two path layouts: winding layered reveal or direct exposed route. | Diversity and Harmony | Winding concealment and reveal produces changing views while maintaining coherence. |
| `Place one final element.` | Select between a modest waterside pavilion nestled into rock and trees or a dominating oversized structure. | Naturalness and Simplicity | A human structure that follows terrain and water feels united with nature. |
| `Which view leaves room for imagination?` | Select between a layered, partly concealed pond view with breathing space and a crowded, fully exposed composition. | Diversity and Harmony: Concealment and Empty Space | What is hidden and what is left open can invite the mind to complete the scene, creating subtle depth. |

Scoring is gentle and appreciation-focused:

- Every answer awards completion progress.
- Strong observation choices increase a hidden four-principle profile.
- An incorrect choice receives a short guided comparison and continues immediately; no punitive failure screen or timer.

### 5. Result / Personal Appreciation Card: 20-30 seconds

The ending returns to a complete garden vista assembled from the student's choices. It displays:

- A poetic English observer title and Chinese echo.
- A two-sentence feedback summary based on strongest observed principles.
- Four principle petals showing mastered/visited observation strengths.
- Buttons: `Walk Again` and `Review the Four Principles`.

Example titles:

| Strongest Lens | Title |
| --- | --- |
| Contrast and Balance | `The Framing Observer / 借景知音` |
| Poetic and Artistic Refinement | `The Poetic Wanderer / 诗境游人` |
| Diversity and Harmony | `The Changing-View Seeker / 移步寻景者` |
| Naturalness and Simplicity | `The Quiet Harmonist / 天人和游者` |

## Visual Asset Plan

All garden scene imagery will be generated through the built-in ChatGPT image-generation tool using one shared style bible and scene-specific prompts. No stock garden imagery will be mixed into the artwork.

### Shared Style Bible

- Subject: classical Jiangnan scholar garden, white plaster walls, charcoal tile roofs, Taihu rockery, ponds, bamboo, lotus, pavilions, lattice windows, moon gates.
- Rendering: painterly digital illustration combining refined gongbi contour control with translucent ink wash and mineral color; tactile rice-paper surface.
- Mood: graceful, inviting, culturally respectful, cinematic but not photorealistic or tourist-postcard glossy.
- Color: pine green, celadon teal, mineral blue shadows, warm ivory paper, cinnabar blossom details, subtle aged gold accents.
- Continuity: the same imagined garden, architecture vocabulary, paint handling, light quality, and palette across every image.
- Exclusions: no people as main subject, no modern objects, no illegible generated signage or overlaid text, no Western garden furniture, no garish saturation.

### Required Generated Scenes

| Key | Purpose | Composition |
| --- | --- | --- |
| `hero-moon-gate` | Arrival and replay background | Vertical-friendly view from inside a circular moon gate toward pond, pavilion, rockery and layered trees. |
| `learn-framed-vastness` | Learn stop 1 | Close foreground carved lattice window framing a deep distant waterscape; clear small-to-large contrast. |
| `learn-poetic-reflection` | Learn stop 2 | Waterside pavilion with empty plaque area and poetic reflection; room for UI plaque overlay. |
| `learn-changing-view` | Learn stop 3 | Winding corridor/path behind bamboo and rock; layered reveal and contrasting sun/shadow. |
| `learn-naturalness` | Learn stop 4 | Pavilion softly nested beside natural rock shore and water under mist. |
| `play-frame-a`, `play-frame-b` | Question 1 comparison | Matched view pair contrasting meaningful framing against an overly open scene. |
| `play-path-a`, `play-path-b` | Question 3 comparison | Matched view pair contrasting winding layered path against blunt axial exposure. |
| `play-placement-a`, `play-placement-b` | Question 4 comparison | Matched view pair contrasting nested modest pavilion against dominating structure. |
| `play-empty-space-a`, `play-empty-space-b` | Question 5 comparison | Matched view pair contrasting layered partial concealment and open water against crowded over-description. |
| `result-complete-garden` | Closing card | Wider luminous final garden with water reflection and open breathing room for result typography. |

The pavilion naming question reuses `learn-poetic-reflection`, with clean HTML plaque choices over the illustration. This reduces unnecessary asset generation and keeps the scene recognizable.

## Audio and Music

### Narration

- Four concise English scripts are exposed by buttons in the learning views.
- Voice direction: warm, clear American English; cultured but approachable pacing.
- Delivery: four bundled narration audio assets under `assets/audio/narration/`; these are used by default on every device.
- Fallback: if an audio asset fails to load, the interface offers the visible script and, where an `en-US` voice exists, a clearly labelled device-voice playback action.
- Only one narration may play at a time; entering another view stops previous narration.
- Every narrated text remains visible on screen for accessibility and classroom audibility differences.

### Game Music Record

- File target: `assets/audio/bgm.mp3`.
- Music begins only after pressing `Begin the Challenge`, complying with mobile autoplay limitations.
- If the file is missing, the game remains fully playable and presents a discreet `Music file not installed` state instead of a broken player.
- Player appearance: a rotating lacquer-and-celadon record decorated with garden-window lattice and ripple motifs, a cinnabar spindle center, and a small pause/play seal button.
- Rotation pauses with audio and observes `prefers-reduced-motion`.

## Screen and Interaction Design

- Implementation target: this standalone static HTML/CSS/JavaScript repository, consistent with the lightweight existing `Cuo` educational web work while remaining separate.
- Responsive priority: portrait phones first; desktop/projector layout becomes a wider album-leaf composition without changing gameplay.
- Controls: touch targets at least 44px; swipe interactions also provide visible tap/keyboard alternatives.
- Progress: local in-memory state only; optional `sessionStorage` preserves a reload during one classroom playthrough.
- Text strategy: all primary instructional and game text in English; Chinese anchors appear as concise names, not translation-heavy paragraphs.
- No login, analytics, external result upload, multiplayer, leaderboard, or teacher dashboard.

## Implementation Boundaries

- `data/content.js`: principles, narration scripts, question/rationale/result title data.
- `data/assets.js`: stable keys for all generated scene assets and optional audio.
- `js/state.js`: phase progression, visited learn stops, score profile, replay/reset and session persistence.
- `js/audio.js`: narration playback and BGM record state with graceful missing-file handling.
- `js/app.js`: rendering, view transitions and touch/click interaction binding.
- `styles.css`: palette, typography, album layout, responsive states, motion and reduced-motion handling.
- `assets/images/`: final generated garden illustrations.
- `assets/audio/`: optional local `bgm.mp3` and four included American-English narration assets.

## Verification Criteria

- On a phone-sized viewport, students can complete the full journey in approximately 6 minutes without hidden or unusable controls.
- The game cannot begin until all four learning scenes have been visited.
- Each question clearly evaluates a learned principle or a highlighted subprinciple from the source image using imagery or a poetic choice, and gives concise English feedback.
- Generated imagery is consistent in garden identity, rendering style, palette, and UI-safe composition.
- Music begins only after explicit interaction; missing `bgm.mp3` does not break gameplay.
- Narration has readable transcript equivalents and does not overlap music or other narration unintentionally.
- Layout remains elegant and legible on projector/desktop and mobile.
- Motion respects reduced-motion preferences.

## Out of Scope

- Real-time class aggregation, score submission, login or teacher dashboard.
- Architectural technical instruction or specialist terminology testing.
- A long narrative adventure, timed competition or broad question bank.
- Remotion video rendering; the experience is a live interactive webpage, not a video composition.
