import { createMission, stepMission, MissionState } from "../sim";
import { rooms, TargetKind } from "./world";
export type Item =
  | "filter"
  | "cell"
  | "bottle"
  | "empty-bottle"
  | "used-bottle"
  | "food"
  | "wrench"
  | "cable"
  | "sample";
export type Dial = "system" | "grow" | "shield";
export const itemNames: Record<Item, string> = {
  filter: "CO₂ filter cartridge",
  cell: "Power cell",
  bottle: "Clean water bottle",
  "empty-bottle": "Empty bottle",
  "used-bottle": "Used-water bottle",
  food: "Harvest crate",
  wrench: "Repair wrench",
  cable: "Backup cable",
  sample: "Sealed science sample",
};
export type StoryTask = {
  at: TargetKind;
  action: string;
  line: string;
  take?: Item;
  need?: Item;
  consume?: Item;
  engine?: string[];
  dial?: Dial;
  minimum?: number;
};
export type Chapter = {
  title: string;
  intro: string;
  handoff: string;
  tasks: StoryTask[];
};
export const chapters: Chapter[] = [
  {
    title: "A breath of fresh air",
    intro:
      "Welcome aboard! Tank needs every part of Moonpool ready for lunar night. First, find Bloop in the Bubble Dome. Walk through the glass connector and turn left through the first airlock.",
    handoff:
      "The air is improving! Moss needs help storing power for the night. Carry what you learned across the corridor to Solar Ridge.",
    tasks: [
      {
        at: "guide",
        action: "Talk to Bloop",
        line: "Hi, cadet! I look after our air and water. Walk over to the readings monitor. Which air reading needs our attention?",
      },
      {
        at: "monitor",
        action: "Read the air monitor",
        line: "Oxygen is 6, but carbon dioxide is 6 and rising. We need the CO₂ scrubber—not extra oxygen. Pick up its filter cartridge from the supply bench.",
      },
      {
        at: "supply",
        action: "Pick up filter cartridge",
        take: "filter",
        line: "You have the replacement filter. Carry it to the big scrubber and fit it into the front slot.",
      },
      {
        at: "machine",
        action: "Install the CO₂ filter",
        need: "filter",
        consume: "filter",
        engine: ["repair_scrubber"],
        line: "That fits! Stand near the system controls and turn the SYSTEM dial to at least 60 to start airflow.",
      },
      {
        at: "control",
        action: "Set airflow to 60 or more",
        dial: "system",
        minimum: 60,
        engine: ["advance"],
        line: "The scrubber is working. Carbon dioxide fell to 4, while oxygen stayed at 6. Different machines do different jobs!",
      },
    ],
  },
  {
    title: "Light through the lunar night",
    intro:
      "Bloop sent you! Our solar panels stop generating in the dark. A battery stores energy; an empty battery cannot make it. Let’s protect our essential supply.",
    handoff:
      "Essentials are supplied and 4 energy tokens remain. Follow the corridor to Nori’s greenhouse on the left. The crew will need food next.",
    tasks: [
      {
        at: "guide",
        action: "Talk to Moss",
        line: "We have 8 practice energy tokens. Find the charged power cell on the supply bench.",
      },
      {
        at: "supply",
        action: "Pick up the power cell",
        take: "cell",
        line: "Carry that charged cell to the battery bank.",
      },
      {
        at: "machine",
        action: "Connect the power cell",
        need: "cell",
        consume: "cell",
        line: "Connected. The charge was already stored—we did not create new energy. Find the distribution station.",
      },
      {
        at: "secondary",
        action: "Route power to essentials",
        engine: ["plan_essentials"],
        line: "Essentials need 2 tokens on each of two dark turns. Set the SYSTEM dial to at least 60 to approve that supply.",
      },
      {
        at: "control",
        action: "Approve essential power",
        dial: "system",
        minimum: 60,
        line: "The supply is ready. Go to the readings monitor and test our two-turn night plan.",
      },
      {
        at: "monitor",
        action: "Test the night plan",
        engine: ["advance", "advance"],
        line: "We used 4 tokens and kept 4 in reserve. Planning ahead protects more than one moment.",
      },
    ],
  },
  {
    title: "From seed to supper",
    intro:
      "Come into my greenhouse! The pantry feeds the crew while crops grow. Help me water the plants, plan the lighting, and pack a harvest for Luma’s shelter.",
    handoff:
      "Take your harvest crate across to Luma in the Shadow Shelter. Supplies only help the crew when they reach the right place.",
    tasks: [
      {
        at: "guide",
        action: "Talk to Nori",
        line: "First, take the clean water bottle from the supply bench. Carry it to the crop bed.",
      },
      {
        at: "supply",
        action: "Pick up the water bottle",
        take: "bottle",
        line: "You are holding the bottle. Walk to the crop bed and use it to water the plants.",
      },
      {
        at: "secondary",
        action: "Water the crop bed",
        need: "bottle",
        consume: "bottle",
        line: "Plants need water and light. Walk to the grow controls and turn the GROW LIGHT dial to at least 50.",
      },
      {
        at: "control",
        action: "Set the grow lights",
        dial: "grow",
        minimum: 50,
        engine: ["normal_lights"],
        line: "Normal lighting keeps the planned harvest on schedule. Read the pantry schedule before we pack the food.",
      },
      {
        at: "monitor",
        action: "Read the meal schedule",
        line: "Our existing food supplies cover the meals while crops grow. This training checkpoint will advance four planned meal periods; real plants take much longer.",
      },
      {
        at: "machine",
        action: "Advance meal plan & pack harvest",
        take: "food",
        engine: ["advance", "advance", "advance", "advance"],
        line: "Meals stayed supplied. The practice harvest is packed; carry it to the shelter.",
      },
    ],
  },
  {
    title: "A safe place for the crew",
    intro:
      "I’m Luma. Good preparation includes a protected place and supplies. Bring Nori’s harvest inside, then help me prepare our shielding.",
    handoff:
      "The crew and essential equipment are protected. Pip has spotted a worn seal in the workshop, farther along the corridor on the left.",
    tasks: [
      {
        at: "guide",
        action: "Talk to Luma",
        line: "Thank you for bringing food! Place the harvest crate at the shelter supply station.",
      },
      {
        at: "secondary",
        action: "Deliver the harvest crate",
        need: "food",
        consume: "food",
        line: "Our supplies are here. Read the hazard monitor next. These readings are a practice scenario, not a live warning.",
      },
      {
        at: "monitor",
        action: "Inspect the hazard briefing",
        line: "Shielding reduces additional exposure; it does not undo exposure already received. Stay inside the prepared shelter and close the shield.",
      },
      {
        at: "control",
        action: "Close the radiation shield",
        dial: "shield",
        minimum: 80,
        line: "Shield closed. Walk to the shelter system to power essential equipment and check crew protection.",
      },
      {
        at: "machine",
        action: "Check the shelter plan",
        engine: ["run_plan"],
        line: "Crew protected, essentials supplied. The practice exposure rose only from 3 to 4, rather than 6 outside.",
      },
    ],
  },
  {
    title: "The route around a failure",
    intro:
      "Pip here! An extra pump is not a useful backup if it shares the failed connection. Help me repair the seal and build a separate path.",
    handoff:
      "Both tests passed! Follow the corridor across to Skim. The water system needs a complete accounting of its supplies.",
    tasks: [
      {
        at: "guide",
        action: "Talk to Pip",
        line: "Take the wrench from my supply bench and bring it to the door-seal assembly.",
      },
      {
        at: "supply",
        action: "Pick up the repair wrench",
        take: "wrench",
        line: "Use the wrench at the seal assembly. A new science room cannot fix this leak.",
      },
      {
        at: "machine",
        action: "Repair the door seal",
        need: "wrench",
        consume: "wrench",
        engine: ["repair_seal"],
        line: "Seal repaired. The wrench is back in the toolkit. Pick up the spare cable at the cable rack.",
      },
      {
        at: "secondary",
        action: "Pick up the backup cable",
        take: "cable",
        line: "Carry that cable to the independent connection panel.",
      },
      {
        at: "control",
        action: "Connect the independent backup",
        need: "cable",
        consume: "cable",
        engine: ["build_backup"],
        line: "This connection goes around the failed branch. Go to the test monitor; a repair is not finished until it is checked.",
      },
      {
        at: "monitor",
        action: "Test seal and backup route",
        engine: ["test"],
        line: "Both checks passed. We spent 6 materials and 3 work shifts; nothing was repaired for free.",
      },
    ],
  },
  {
    title: "Every drop has a destination",
    intro:
      "I’m Skim. Water moves between stores; a recycler does not make a second copy. We have 12 practice water tokens. Let’s follow them.",
    handoff:
      "Clean reserve: 8 tokens. Every drop is accounted for. Pebble is waiting in the observation room farther along on the left.",
    tasks: [
      {
        at: "guide",
        action: "Talk to Skim",
        line: "Fill a clean water bottle at the supply tap, then carry it to the crew supply station.",
      },
      {
        at: "supply",
        action: "Take a clean water bottle",
        take: "bottle",
        line: "Carry the clean bottle to crew supplies. The practice delivery allocates 4 water tokens.",
      },
      {
        at: "secondary",
        action: "Supply water to the crew",
        need: "bottle",
        consume: "bottle",
        take: "empty-bottle",
        engine: ["supply_crew"],
        line: "Crew supplied. Take your empty bottle back to the clean tap for the existing crops.",
      },
      {
        at: "supply",
        action: "Refill the empty bottle",
        need: "empty-bottle",
        consume: "empty-bottle",
        take: "bottle",
        line: "Now carry clean water to the existing crop station; it needs 3 practice tokens.",
      },
      {
        at: "machine",
        action: "Supply the existing crops",
        need: "bottle",
        consume: "bottle",
        engine: ["supply_crops"],
        line: "Crew and crops are supplied. Collect the used-water container from the return station.",
      },
      {
        at: "return",
        action: "Collect used-water bottle",
        take: "used-bottle",
        line: "Used water belongs in the recycler, never directly in the clean supply. Carry it to the recycling controls.",
      },
      {
        at: "control",
        action: "Recycle the used water",
        need: "used-bottle",
        consume: "used-bottle",
        engine: ["recycle"],
        line: "We recovered 3 tokens and spent 1 energy token. Read the final water audit at the monitor.",
      },
      {
        at: "monitor",
        action: "Audit the water stores",
        engine: ["finish"],
        line: "8 clean, 1 still used, and 3 held by crops: 12 altogether. The same water moved; no extra copies appeared.",
      },
    ],
  },
  {
    title: "A decision before the reply",
    intro:
      "Welcome to the lookout! I’m Pebble. Our fan needs power before a local deadline. A delayed answer cannot do the work for us.",
    handoff:
      "The fan is restored and your report is accurate. Tank needs you across the glass connector for the final combined readiness check.",
    tasks: [
      {
        at: "guide",
        action: "Talk to Pebble",
        line: "Read the mission clock at the monitor. This is a turn-based practice deadline; take your time reading.",
      },
      {
        at: "monitor",
        action: "Read the local deadline",
        line: "The fan needs a two-minute repair before minute 6. Our exaggerated support-message delay is a teaching device; Earth–Moon light travel is about 1.3 seconds one way.",
      },
      {
        at: "secondary",
        action: "Pause camera research to power repair",
        engine: ["start_camera"],
        line: "We reused the camera’s power allocation. The battery reserve stays intact. Walk to the fan to carry out the repair.",
      },
      {
        at: "machine",
        action: "Carry out the two-minute repair",
        engine: ["advance", "advance"],
        line: "Fan restored at practice minute 2, ahead of minute 6. Send a report matching what actually happened.",
      },
      {
        at: "control",
        action: "Send the repair report",
        engine: ["report"],
        line: "Report sent: airflow restored, camera research paused, battery preserved. A useful report states the trade-off.",
      },
    ],
  },
  {
    title: "One crew. One Moonpool.",
    intro:
      "You made it! I’m Tank. Air, power, food, protection, repairs, water, and planning work together. Let’s bring the whole base through its final rehearsal.",
    handoff:
      "Moonpool is ready! You helped every crewmate, carried real supplies, and made the systems work together. Keep exploring—this is your station.",
    tasks: [
      {
        at: "guide",
        action: "Talk to Tank",
        line: "First, check that everyone reaches the prepared shelter. Use the crew coordination station.",
      },
      {
        at: "secondary",
        action: "Coordinate the crew shelter transfer",
        engine: ["start_transfer", "advance", "advance", "report", "continue"],
        line: "Everyone is sheltered before the deadline. For the three-turn systems rehearsal, take the pump replacement cell from supplies.",
      },
      {
        at: "supply",
        action: "Pick up the pump replacement cell",
        take: "cell",
        line: "Carry the replacement to the circulation pump.",
      },
      {
        at: "machine",
        action: "Repair the circulation pump",
        need: "cell",
        consume: "cell",
        engine: ["repair_pump"],
        line: "Pump running. Keep the grow lights on for both crisis rounds so the harvest arrives in time. Set GROW LIGHT to at least 50.",
      },
      {
        at: "control",
        action: "Plan the crop lighting",
        dial: "grow",
        minimum: 50,
        engine: ["toggle_light"],
        line: "Plan ready. At the monitor, check the first whole practice turn—essential energy and meals must both be affordable.",
      },
      {
        at: "monitor",
        action: "Run the first systems turn",
        engine: ["advance"],
        line: "First turn supplied. The lights are still part of the plan. Check the second turn at the monitor.",
      },
      {
        at: "monitor",
        action: "Run the second systems turn",
        engine: ["advance"],
        line: "Second turn supplied. The crew’s essentials are protected. Collect the sealed science sample from the return station.",
      },
      {
        at: "return",
        action: "Collect the sealed science sample",
        take: "sample",
        engine: ["collect_sample"],
        line: "Sample secured. Go to the main controls for the final turn and reserve check.",
      },
      {
        at: "control",
        action: "Complete the station readiness check",
        engine: ["advance"],
        line: "All systems passed. We kept 1 energy token, preserved emergency food, and completed the science sample. Welcome to the Moonpool crew!",
      },
    ],
  },
];
export type StoryState = {
  version: 2;
  chapter: number;
  task: number;
  held: Item | null;
  done: string[];
  finished: boolean;
  dialValues: Record<string, number>;
};
export function newStory(): StoryState {
  return {
    version: 2,
    chapter: 0,
    task: 0,
    held: null,
    done: [],
    finished: false,
    dialValues: {},
  };
}
export function taskId(chapter: number, task: number) {
  return `${chapter}:${task}`;
}
export function currentTask(s: StoryState): StoryTask | undefined {
  return s.finished ? undefined : chapters[s.chapter]?.tasks[s.task];
}
export function targetId(s: StoryState) {
  const t = currentTask(s);
  return t ? `${rooms[s.chapter].id}:${t.at}` : undefined;
}
export function advanceStory(
  s: StoryState,
  target: string,
  viaDial?: Dial,
  value?: number,
): StoryState {
  const t = currentTask(s);
  if (
    !t ||
    target !== targetId(s) ||
    t.dial !== viaDial ||
    (t.dial && (value ?? 0) < (t.minimum ?? 0)) ||
    (t.need && s.held !== t.need) ||
    (!t.consume && t.take && s.held)
  )
    return s;
  const held = t.take ?? (t.consume ? null : s.held);
  const done = [...s.done, taskId(s.chapter, s.task)];
  const last = s.task === chapters[s.chapter].tasks.length - 1;
  return {
    ...s,
    held,
    done,
    task: last ? 0 : s.task + 1,
    chapter: last ? Math.min(7, s.chapter + 1) : s.chapter,
    finished: last && s.chapter === 7,
    dialValues: viaDial
      ? { ...s.dialValues, [`${s.chapter}:${viaDial}`]: value ?? 0 }
      : s.dialValues,
  };
}
export function missionForChapter(
  s: StoryState,
  chapter = s.chapter,
): MissionState {
  return chapters[chapter].tasks.reduce(
    (m, t, i) =>
      s.done.includes(taskId(chapter, i))
        ? (t.engine ?? []).reduce(stepMission, m)
        : m,
    createMission(chapter + 1),
  );
}
export function restoreStory(value: unknown): StoryState {
  const v = value as Partial<StoryState>;
  if (
    !v ||
    v.version !== 2 ||
    !Number.isInteger(v.chapter) ||
    !Number.isInteger(v.task) ||
    Number(v.chapter) < 0 ||
    Number(v.chapter) > 7 ||
    Number(v.task) < 0 ||
    Number(v.task) >= chapters[Number(v.chapter)].tasks.length
  )
    return newStory();
  const base = newStory();
  const chapter = Number(v.chapter),
    task = Number(v.task);
  const finished = v.finished === true && chapter === 7 && task === 0;
  const done = chapters.flatMap((c, ci) =>
    c.tasks.flatMap((_, ti) =>
      ci < chapter || (ci === chapter && (finished || ti < task))
        ? [taskId(ci, ti)]
        : [],
    ),
  );
  let held: Item | null = null;
  for (const id of done) {
    const [ci, ti] = id.split(":").map(Number);
    const t = chapters[ci].tasks[ti];
    held = t.take ?? (t.consume ? null : held);
  }
  return {
    ...base,
    chapter,
    task,
    finished,
    done,
    held,
    dialValues:
      typeof v.dialValues === "object" && v.dialValues ? v.dialValues : {},
  };
}
