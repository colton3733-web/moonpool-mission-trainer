import { describe, it, expect } from "vitest";
import {
  rooms,
  targets,
  isWalkable,
  movePlayer,
  nearbyTarget,
  clearSight,
} from "./world";
import {
  chapters,
  newStory,
  currentTask,
  targetId,
  advanceStory,
  missionForChapter,
  restoreStory,
} from "./story";
describe("free movement and connected station", () => {
  it("starts on a walkable interior corridor", () =>
    expect(isWalkable({ x: 0, z: 7 })).toBe(true));
  it("moves continuously and slides along walls without tunneling", () => {
    const start = { x: 0, z: 7 };
    const p = movePlayer(start, 100, 0);
    expect(p.x).toBeLessThan(19);
    expect(isWalkable(p)).toBe(true);
    expect(start).toEqual({ x: 0, z: 7 });
    expect(movePlayer({ x: 0, z: 7 }, 0, -100).z).toBeGreaterThan(-70);
  });
  it("every story target has a reachable approach through open doors", () => {
    const start = { x: 0, z: 7 },
      queue = [start],
      seen = new Set(["0,7"]);
    for (let index = 0; index < queue.length; index++) {
      const p = queue[index];
      for (const [dx, dz] of [
        [0.5, 0],
        [-0.5, 0],
        [0, 0.5],
        [0, -0.5],
      ]) {
        const n = { x: p.x + dx, z: p.z + dz },
          key = `${n.x},${n.z}`;
        if (!seen.has(key) && isWalkable(n)) {
          seen.add(key);
          queue.push(n);
        }
      }
    }
    for (const target of targets) {
      const approach = queue.find(
        (p) =>
          Math.hypot(p.x - target.x, p.z - target.z) < 2.3 &&
          clearSight(p, target, target.id),
      );
      expect(approach, `no approach for ${target.id}`).toBeDefined();
      const yaw = Math.atan2(approach!.x - target.x, approach!.z - target.z);
      expect(
        nearbyTarget(approach!, yaw, target.id)?.id,
        `cannot interact with ${target.id}`,
      ).toBe(target.id);
    }
    expect(queue.length).toBeGreaterThan(3000);
  });
  it("does not permit interaction through the wall to an adjacent room", () => {
    expect(nearbyTarget({ x: 0, z: 0 }, 0, "bloop:guide")).toBeUndefined();
    expect(clearSight({ x: 0, z: 4 }, { x: -5, z: 4 })).toBe(false);
  });
});
describe("continuous eight-character storyline", () => {
  it("requires the current objective and does not skip story events", () => {
    const s = newStory();
    expect(advanceStory(s, "moss:guide")).toBe(s);
    expect(s.done).toEqual([]);
  });
  it("carries, uses, and consumes the actual requested item", () => {
    let s = newStory();
    for (let i = 0; i < 3; i++) s = advanceStory(s, targetId(s)!);
    expect(s.held).toBe("filter");
    expect(advanceStory({ ...s, held: null }, targetId(s)!)).toEqual({
      ...s,
      held: null,
    });
    s = advanceStory(s, targetId(s)!);
    expect(s.held).toBeNull();
    expect(missionForChapter(s).flags).toBeDefined();
    expect(advanceStory(s, targetId(s)!, "system", 55)).toBe(s);
    expect(advanceStory(s, targetId(s)!, "system", 60).chapter).toBe(1);
  });
  it("all eight physical story sequences satisfy their existing mission engine", () => {
    let s = newStory();
    for (let chapter = 0; chapter < 8; chapter++) {
      expect(s.chapter).toBe(chapter);
      for (const task of chapters[chapter].tasks) {
        expect(currentTask(s)).toBe(task);
        const next = advanceStory(s, targetId(s)!, task.dial, task.minimum);
        expect(next).not.toBe(s);
        s = next;
      }
      const result = missionForChapter(s, chapter);
      expect(
        result.status,
        `chapter ${chapter + 1}: ${result.explanation}`,
      ).toBe("complete");
    }
    expect(s.finished).toBe(true);
    expect(s.held).toBe("sample");
    expect(s.done.length).toBe(
      chapters.reduce((n, c) => n + c.tasks.length, 0),
    );
  });
  it("restores progress and carried items consistently, rejecting invalid saves", () => {
    let s = newStory();
    for (let i = 0; i < 3; i++) s = advanceStory(s, targetId(s)!);
    const restored = restoreStory(JSON.parse(JSON.stringify(s)));
    expect(restored).toEqual(s);
    expect(restoreStory({ version: 2, chapter: 100, task: 0 })).toEqual(
      newStory(),
    );
    expect(restoreStory({ ...s, held: "food" }).held).toBe("filter");
  });
});
