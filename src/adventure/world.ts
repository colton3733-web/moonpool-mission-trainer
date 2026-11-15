export type Point = { x: number; z: number };
export type Collider = {
  id: string;
  x: number;
  z: number;
  w: number;
  d: number;
};
export type Room = {
  id: string;
  name: string;
  guide: string;
  color: string;
  x: number;
  z: number;
  index: number;
};
export const rooms: Room[] = [
  ["bloop", "Bubble Dome", "Bloop", "#92dacf"],
  ["moss", "Solar Ridge", "Moss", "#e6c464"],
  ["nori", "Spiral Greenhouse", "Nori", "#9bcf77"],
  ["luma", "Shadow Shelter", "Luma", "#bba5df"],
  ["pip", "Lava Tube Workshop", "Pip", "#f49a77"],
  ["skim", "Water Recovery", "Skim", "#8bc9e6"],
  ["pebble", "Observation & Comms", "Pebble", "#d5a6d7"],
  ["tink", "Mission Control", "Tink", "#f8b86e"],
].map(([id, name, guide, color], index) => ({
  id,
  name,
  guide,
  color,
  index,
  x: index % 2 === 0 ? -11 : 11,
  z: -Math.floor(index / 2) * 20,
}));
export type TargetKind =
  | "guide"
  | "supply"
  | "machine"
  | "control"
  | "secondary"
  | "monitor"
  | "return";
export type Target = {
  id: string;
  room: Room;
  kind: TargetKind;
  x: number;
  z: number;
  label: string;
};
const offsets: Record<TargetKind, [number, number]> = {
  guide: [0, 0],
  supply: [-4, -4],
  machine: [0, -5],
  control: [4, -4],
  secondary: [-4, 3],
  monitor: [4, 3],
  return: [0, 4],
};
export const targets: Target[] = rooms.flatMap((room) =>
  (Object.keys(offsets) as TargetKind[]).map((kind) => ({
    id: `${room.id}:${kind}`,
    room,
    kind,
    x: room.x + (kind === "guide" ? (room.x < 0 ? 5 : -5) : offsets[kind][0]),
    z: room.z + offsets[kind][1],
    label:
      kind === "guide"
        ? `Talk to ${room.guide}`
        : kind === "supply"
          ? "Supply bench"
          : kind === "machine"
            ? "Main system"
            : kind === "control"
              ? "System controls"
              : kind === "secondary"
                ? "Work station"
                : kind === "monitor"
                  ? "Readings monitor"
                  : "Return station",
  })),
);
export const colliders: Collider[] = rooms.flatMap((r) => [
  { id: `${r.id}:outer`, x: r.x + (r.x < 0 ? -8 : 8), z: r.z, w: 0.3, d: 16 },
  { id: `${r.id}:north`, x: r.x, z: r.z - 8, w: 16, d: 0.3 },
  { id: `${r.id}:south`, x: r.x, z: r.z + 8, w: 16, d: 0.3 },
  {
    id: `${r.id}:innerA`,
    x: r.x + (r.x < 0 ? 8 : -8),
    z: r.z - 5.2,
    w: 0.3,
    d: 5.6,
  },
  {
    id: `${r.id}:innerB`,
    x: r.x + (r.x < 0 ? 8 : -8),
    z: r.z + 5.2,
    w: 0.3,
    d: 5.6,
  },
  {
    id: `${r.id}:guide`,
    x: r.x + (r.x < 0 ? 5 : -5),
    z: r.z,
    w: 0.65,
    d: 0.65,
  },
  ...(
    [
      "supply",
      "machine",
      "control",
      "secondary",
      "monitor",
      "return",
    ] as TargetKind[]
  ).map((k) => ({
    id: `${r.id}:${k}`,
    x: r.x + offsets[k][0],
    z: r.z + offsets[k][1],
    w: k === "machine" ? 2 : 1.8,
    d: k === "machine" ? 1.9 : 1.1,
  })),
]);
for (const r of rooms) {
  colliders.push(
    { id: `${r.id}:barrels`, x: r.x - 5.5, z: r.z + 6.5, w: 1.45, d: 1.35 },
    { id: `${r.id}:wireless`, x: r.x + 6, z: r.z + 6, w: 1.65, d: 1.3 },
  );
  const add = (xs: number[], z: number, w: number, d: number) =>
    xs.forEach((x, i) =>
      colliders.push({ id: `${r.id}:decor${i}`, x: r.x + x, z: r.z + z, w, d }),
    );
  if (r.index === 0) {
    add([-5, -2, 1], -6.6, 1.25, 1.25);
    colliders.push({
      id: "bloop:aquarium",
      x: r.x + 5,
      z: r.z - 7,
      w: 3.4,
      d: 0.4,
    });
  }
  if (r.index === 1) add([-5, -2.5, 0, 2.5, 5], -6.4, 1.75, 0.75);
  if (r.index === 2) add([-4, 0, 4], -6.3, 2.2, 1);
  if (r.index === 3) {
    add([-5, 0, 5], -6.2, 2.4, 2);
    colliders.push({
      id: "luma:shieldwall",
      x: r.x + 6.8,
      z: r.z,
      w: 1.8,
      d: 11,
    });
  }
  if (r.index === 4) add([-5, 0, 5], -6.5, 2.5, 0.7);
  if (r.index === 5) add([-4.5, 0, 4.5], -6.4, 2.1, 2.1);
  if (r.index === 6) {
    add([0], -6.7, 1, 1.6);
    colliders.push({
      id: "pebble:dish",
      x: r.x + 5,
      z: r.z - 6.5,
      w: 2.65,
      d: 2.65,
    });
  }
  if (r.index === 7) add([-5, 0, 5], -6.8, 3.5, 0.3);
}
const radius = 0.28;
export function isWalkable(p: Point): boolean {
  const floor =
    (Math.abs(p.x) <= 3 - radius &&
      p.z >= -70 + radius &&
      p.z <= 10 - radius) ||
    rooms.some(
      (r) =>
        Math.abs(p.x - r.x) <= 8 - radius && Math.abs(p.z - r.z) <= 8 - radius,
    ) ||
    rooms.some(
      (r) =>
        Math.abs(p.z - r.z) < 2.35 - radius &&
        Math.abs(p.x) < Math.abs(r.x) + 1,
    );
  return (
    floor &&
    !colliders.some(
      (c) =>
        p.x > c.x - c.w / 2 - radius &&
        p.x < c.x + c.w / 2 + radius &&
        p.z > c.z - c.d / 2 - radius &&
        p.z < c.z + c.d / 2 + radius,
    )
  );
}
export function movePlayer(p: Point, dx: number, dz: number): Point {
  const out = { ...p };
  const steps = Math.max(1, Math.ceil(Math.hypot(dx, dz) / 0.12));
  for (let i = 0; i < steps; i++) {
    const x = out.x + dx / steps,
      z = out.z + dz / steps;
    if (isWalkable({ x, z: out.z })) out.x = x;
    if (isWalkable({ x: out.x, z })) out.z = z;
  }
  return out;
}
export function roomAt(p: Point): Room | undefined {
  return rooms.find((r) => Math.abs(p.x - r.x) < 8 && Math.abs(p.z - r.z) < 8);
}
export function clearSight(a: Point, b: Point, ignoreId?: string): boolean {
  const distance = Math.hypot(a.x - b.x, a.z - b.z);
  const steps = Math.ceil(distance / 0.1);
  for (let i = 1; i < steps; i++) {
    const x = a.x + ((b.x - a.x) * i) / steps,
      z = a.z + ((b.z - a.z) * i) / steps;
    if (
      colliders.some(
        (c) =>
          c.id !== ignoreId &&
          x > c.x - c.w / 2 &&
          x < c.x + c.w / 2 &&
          z > c.z - c.d / 2 &&
          z < c.z + c.d / 2,
      )
    )
      return false;
  }
  return true;
}
export function nearbyTarget(
  p: Point,
  yaw: number,
  preferred?: string,
): Target | undefined {
  return targets
    .filter((t) => {
      const d = Math.hypot(t.x - p.x, t.z - p.z);
      const facing =
        d < 0.5
          ? 1
          : ((t.x - p.x) * -Math.sin(yaw) + (t.z - p.z) * -Math.cos(yaw)) / d;
      return d < 2.65 && facing > 0.25 && clearSight(p, t, t.id);
    })
    .sort((a, b) => {
      const score = (t: Target) =>
        Math.hypot(t.x - p.x, t.z - p.z) - (t.id === preferred ? 1 : 0);
      return score(a) - score(b);
    })[0];
}
