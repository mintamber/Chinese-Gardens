import test from "node:test";
import assert from "node:assert/strict";
import { access, stat } from "node:fs/promises";
import { learningStops, questions, resultProfiles } from "../data/content.js";
import { images, narration, music } from "../data/assets.js";

test("defines four learned garden principles with American-English narration", () => {
  assert.equal(learningStops.length, 4);
  assert.deepEqual(
    learningStops.map((stop) => stop.id),
    ["contrast", "poetic", "harmony", "naturalness"],
  );

  learningStops.forEach((stop) => {
    assert.match(stop.chinese, /[\u4e00-\u9fff]/);
    assert.ok(stop.script.split(" ").length >= 18);
    assert.equal(narration[stop.id].endsWith(".m4a"), true);
  });
});

test("uses five observation questions and four result profiles", () => {
  assert.equal(questions.length, 5);
  assert.equal(questions.at(-1).id, "empty-space");
  assert.deepEqual(Object.keys(resultProfiles), [
    "contrast",
    "poetic",
    "harmony",
    "naturalness",
  ]);
});

test("declares every required generated image and the local music track", () => {
  assert.deepEqual(Object.keys(images), [
    "hero",
    "contrast",
    "poetic",
    "harmony",
    "naturalness",
    "frameA",
    "frameB",
    "pathA",
    "pathB",
    "placementA",
    "placementB",
    "emptySpaceA",
    "emptySpaceB",
    "result",
  ]);
  assert.equal(music.bgm, "./assets/audio/bgm.mp3");
});

test("ships optimized garden paintings for every visual asset key", async () => {
  for (const relativePath of Object.values(images)) {
    assert.match(relativePath, /\.jpg$/);
    const fileUrl = new URL(`..${relativePath.slice(1)}`, import.meta.url);
    await access(fileUrl);
    const asset = await stat(fileUrl);
    assert.ok(asset.size < 1_200_000, `${relativePath} should remain classroom-friendly`);
  }
});

test("includes the complete bilingual classical garden learning reference", () => {
  const expected = {
    contrast: [
      ["Various scales of openings", "大小开合"],
      ["Vastness within a small area", "小中见大"],
      ["Enhance the grand with the small", "以小衬大"],
      ["Less is more", "以少胜多"],
    ],
    poetic: [
      ["3D landscape painting", "三维山水画"],
      ["A reflection of the literati's personality and worldview", "造园人的文人情结"],
      ["Residences and social hangouts", "文人雅士的雅集文酒之处"],
      ["Poetic names of architecture", "亭台楼阁的诗意命名"],
      ["Inscriptions of poetry or calligraphic art on the plaques and gate couplets", "匾额的书法题诗与楹联"],
      ["Ubiquitous cultural symbols", "无处不在的文化符号"],
    ],
    harmony: [
      ["Winding paths to seclusion", "曲径通幽"],
      ["Interplay of light and shadow", "明暗交错"],
      ["Alternation of density and spacing", "疏密相间"],
      ["Balance between openness and privacy", "旷奥相济"],
      ["Changing views with changing steps", "移步换景"],
      ["Beauty in all four seasons", "四季皆景"],
      ["Nuanced but profound aesthetics", "含蓄幽远"],
    ],
    naturalness: [
      ["Tailor to the natural environment", "因地制宜"],
      ["Nestled by/follow mountains and waters", "依山傍水"],
      ["Unity between nature and man", "天人合一"],
      ["Retreat to serene nature", "归隐山林"],
    ],
  };

  learningStops.forEach((stop) => {
    assert.deepEqual(
      stop.principles.map(({ english, chinese }) => [english, chinese]),
      expected[stop.id],
    );
    assert.match(stop.observation, /[\u4e00-\u9fff]/);
    assert.match(stop.hotspot.label, /[\u4e00-\u9fff]/);
    assert.equal(typeof stop.hotspot.marker, "string");
  });

  assert.deepEqual(learningStops[2].principles.at(-1).children, [
    { english: "Concealment", chinese: "犹抱琵琶" },
    { english: "Multiple layers", chinese: "错落有致" },
    { english: "Empty Space", chinese: "留白艺术" },
  ]);
});
