# Classical Garden Learning Scroll Design

Date: 2026-05-27
Status: Approved in conversation, pending written-spec review

## Purpose

This revision expands the learning walk in Moon Gate Journey so it faithfully teaches the complete bilingual content from the reference slide, *Philosophies and Principles of Chinese Classic Gardens*. It also changes the reading experience so the illustrated garden scenes remain visible until the player deliberately opens a learning panel.

This document supplements the existing journey design and replaces its abbreviated learning-card treatment. The arrival, challenge, audio, and result flows remain in scope only where they connect to the learning walk.

## Experience Goal

The player visits four illustrated garden scenes. Each scene is initially a place to look: the painting is unobstructed except for light navigation and one thematic hotspot. Selecting that hotspot opens a paper-like side scroll containing the complete bilingual learning material for that theme, short observation guidance, narration controls, and progression controls. Selecting the hotspot again, the close control, or the unobstructed scene closes the scroll.

The experience should make two actions equally comfortable:

- appreciating the illustrated garden without a large permanent card covering it;
- opening a clearly structured reference when the player is ready to learn.

## Content Structure

The learning walk keeps four themed scenes. Each scroll includes its English and Chinese theme title, a concise introductory sentence, every bilingual item below, and one or more visual observation prompts linked to the illustrated scene.

### Scene 1: Contrast and Balance / 对比与平衡

- Various scales of openings / 大小开合
- Vastness within a small area / 小中见大
- Enhance the grand with the small / 以小衬大
- Less is more / 以少胜多

Observation focus: openings such as a lattice window or moon gate frame a limited view so that a modest space can suggest distance and breadth.

### Scene 2: Poetic and Artistic Refinement / 诗画的雅趣

- 3D landscape painting / 三维山水画
- A reflection of the literati's personality and worldview / 造园人的文人情结
- Residences and social hangouts / 文人雅士的雅集文酒之处
- Poetic names of architecture / 亭台楼阁的诗意命名
- Inscriptions of poetry or calligraphic art on the plaques and gate couplets / 匾额的书法题诗与楹联
- Ubiquitous cultural symbols / 无处不在的文化符号

Observation focus: a pavilion, named plaque, couplet, writing table, or gathering trace turns the garden from scenery into a lived literary world.

### Scene 3: Diversity and Harmony / 多样性与和谐性

- Winding paths to seclusion / 曲径通幽
- Interplay of light and shadow / 明暗交错
- Alternation of density and spacing / 疏密相间
- Balance between openness and privacy / 旷奥相济
- Changing views with changing steps / 移步换景
- Beauty in all four seasons / 四季皆景
- Nuanced but profound aesthetics / 含蓄幽远
  - Concealment / 犹抱琵琶
  - Multiple layers / 错落有致
  - Empty Space / 留白艺术

Observation focus: curved routes, filtered views, layering, shade and light, and deliberately unfilled space make revelation gradual rather than immediate.

### Scene 4: Naturalness and Simplicity / 自然与质朴

- Tailor to the natural environment / 因地制宜
- Nestled by/follow mountains and waters / 依山傍水
- Unity between nature and man / 天人合一
- Retreat to serene nature / 归隐山林

Observation focus: rocks, shorelines, slopes, water-facing structures, and restrained construction should appear shaped by the site rather than imposed upon it.

## Scene and Scroll Interaction

### Resting View

When a scene opens, the illustration is the dominant surface. The current always-visible study card is removed from the resting view. A small thematic hotspot appears within or just beside a relevant illustrated feature, with restrained motion and a bilingual affordance such as `点击阅览 / Tap to learn`.

Each scene receives one primary hotspot:

- Contrast and Balance: a lattice window, framed opening, or moon gate.
- Poetic and Artistic Refinement: a plaque, couplet, named pavilion, or literati gathering element.
- Diversity and Harmony: a winding path, screened doorway, layered planting, or shifting-light area.
- Naturalness and Simplicity: a water edge, rockwork, natural slope, or waterside pavilion.

### Open Scroll

Activating the hotspot reveals a scroll-like reading panel:

- Desktop: it slides in from the right and occupies approximately one third of the viewport, retaining most of the illustrated scene at left.
- Narrow/mobile view: it becomes a bottom drawer with sufficient reading height and a persistent close affordance.
- The panel is internally scrollable so all bilingual terms fit without extending the entire page.
- Content is presented in compact bilingual pairs rather than separate disconnected translations.
- The footer includes `播放讲解 / Listen` and `下一景 / Next Scene` actions consistent with the existing learning route.

### Close and Navigation Behavior

The open scroll closes when the player activates the same hotspot again, selects the explicit close button, or selects a blank area of the visible garden. It also closes automatically before entering another scene or the challenge phase.

The hotspot remains locatable while the scroll is open, but it should not compete with the scroll's text. Keyboard activation and a readable accessible label are required for the hotspot and close control.

## Content and UI Boundaries

The bilingual knowledge content should live as structured data associated with each existing learning stop, rather than hard-coded HTML in the renderer. Each stop needs:

- theme titles and introductory copy;
- a list of bilingual principle items;
- optional nested supporting items, required for `含蓄幽远 / Nuanced but profound aesthetics`;
- an observation prompt;
- hotspot identity, accessible label, and visual placement metadata;
- narration/script copy aligned with the expanded content.

The learning renderer consumes this data to construct the scene hotspot and scroll. The interaction state records the current scene and whether its scroll is open; it must reset the open state on scene transitions. Audio remains controlled through existing audio behaviors and must stop or change coherently when the player leaves a scene.

## Illustration Policy

Existing illustrations should be retained when they already support the assigned observation focus. The content expansion is not a reason to replace attractive artwork.

Before final visual acceptance, inspect each of the four scenes against its hotspot concept. Create or edit an illustration only when a scene lacks the necessary visible teaching cue. The clearest likely review point is the poetic scene: if it has no plaque, couplet, named architecture, calligraphic clue, or gathering element, it needs a targeted visual supplement.

Any newly generated or edited artwork must preserve the existing classical garden atmosphere and leave space for the closed-state hotspot and the open-state scroll layout.

## Error and Edge Conditions

- If the viewport is too narrow for a side panel, the drawer presentation must be used without obscuring its close control.
- If narration is unavailable, all written bilingual content remains available and the learning path is fully usable.
- If an illustration has not yet received an enhanced art asset, the hotspot and scroll should continue to work with the current scene rather than blocking content delivery.
- Repeated opening and closing must not duplicate panels, stack event behavior, or keep narration playing after the player advances.

## Verification Criteria

- Every bilingual classification and sub-item from the supplied reference image appears in the learning UI under the correct theme.
- On first entering each scene, there is no permanent large text panel obscuring the artwork.
- Each scene has a theme-relevant hotspot that opens and closes its scroll through the defined interactions.
- The expanded panel remains readable and closable on both desktop and mobile-sized layouts.
- The player can play narration and continue to the next scene without breaking the established route.
- Changing scenes or moving to the challenge removes the previous scene's open scroll and stops inappropriate narration.
- Offline/file-based delivery continues to work after the updated learning code is bundled.
- Illustration changes, if needed, are limited to scenes that fail the teaching-cue inspection.

## Out of Scope for This Revision

- Redesigning the arrival screen, challenge rules, or result rewards beyond compatibility with the revised learning flow.
- Adding new themes beyond the four categories in the supplied reference.
- Replacing all scene illustrations solely to establish a new visual style.
