import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  ArrowDown,
  ArrowLeft,
  ArrowRight,
  ArrowUp,
  BookOpen,
  Check,
  Hand,
  Map,
  Pause,
  Play,
  RotateCcw,
  Volume2,
  X,
} from "lucide-react";
import Guide from "./Guide";
import type { PanelCommand } from "./panel";
import { CurriculumLevel } from "./data/curriculum";
import StationScene, {
  Pose,
  Controls,
  emptyControls,
} from "./adventure/StationScene";
import {
  rooms,
  targets,
  Target,
  roomAt,
  nearbyTarget,
  movePlayer,
  isWalkable,
} from "./adventure/world";
import {
  StoryState,
  chapters,
  newStory,
  restoreStory,
  currentTask,
  targetId,
  advanceStory,
  itemNames,
  Dial,
  missionForChapter,
} from "./adventure/story";
import "./adventure/adventure.css";
const SAVE_KEY = "moonpool-adventure-v2";
function load() {
  try {
    const v = JSON.parse(localStorage.getItem(SAVE_KEY) || "null");
    const story = restoreStory(v?.story);
    const p = v?.pose;
    const pose: Pose =
      p &&
      Number.isFinite(p.x) &&
      Number.isFinite(p.z) &&
      Number.isFinite(p.yaw) &&
      isWalkable(p)
        ? { x: p.x, z: p.z, yaw: p.yaw, pitch: 0 }
        : { x: 0, z: 7, yaw: 0, pitch: 0 };
    return { story, pose };
  } catch {
    return { story: newStory(), pose: { x: 0, z: 7, yaw: 0, pitch: 0 } };
  }
}
class GameBoundary extends React.Component<
  { children: React.ReactNode },
  { failed: boolean }
> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  render() {
    return this.state.failed ? (
      <div className="game-unavailable">
        <h2>The 3D view could not start.</h2>
        <p>Try a browser with WebGL enabled. Your saved story is safe.</p>
      </div>
    ) : (
      this.props.children
    );
  }
}
export default function AstronautExperience({
  level,
  onBack,
  onHandbook,
  onChapterComplete,
  onSectorChange,
}: {
  level: CurriculumLevel;
  onBack: () => void;
  onHandbook: (id: number) => void;
  onChapterComplete?: (id: number) => void;
  onSectorChange?: (id: number) => void;
}) {
  const [initial] = useState(load);
  const [story, setStory] = useState<StoryState>(initial.story);
  const storyRef = useRef(story);
  storyRef.current = story;
  const pose = useRef<Pose>(initial.pose),
    controls = useRef<Controls>(emptyControls());
  const [viewPose, setViewPose] = useState<Pose>(pose.current),
    [mapOpen, setMapOpen] = useState(false),
    [paused, setPaused] = useState(false),
    [resetOpen, setResetOpen] = useState(false),
    [readingsOpen, setReadingsOpen] = useState(false),
    [line, setLine] = useState(
      story.finished ? chapters[7].handoff : chapters[story.chapter].intro,
    ),
    [speaker, setSpeaker] = useState(story.finished ? 7 : story.chapter),
    [speaking, setSpeaking] = useState(false);
  const surface = useRef<HTMLDivElement>(null),
    drag = useRef<{ x: number; y: number } | null>(null),
    lastAction = useRef(0);
  const task = currentTask(story),
    goalId = targetId(story),
    goal = targets.find((t) => t.id === goalId),
    nearby = nearbyTarget(viewPose, viewPose.yaw, goalId),
    location = roomAt(viewPose),
    chapter = chapters[story.chapter],
    guide = rooms[speaker],
    distance = goal ? Math.hypot(goal.x - viewPose.x, goal.z - viewPose.z) : 0;
  const stopped = paused || mapOpen || resetOpen;
  const mission = missionForChapter(story);
  const stepCount = chapters.reduce((n, c) => n + c.tasks.length, 0);
  const progress = Math.round((story.done.length / stepCount) * 100);
  function persist() {
    try {
      localStorage.setItem(
        SAVE_KEY,
        JSON.stringify({ story: storyRef.current, pose: pose.current }),
      );
    } catch {}
  }
  useEffect(() => {
    persist();
    onSectorChange?.(story.chapter + 1);
  }, [story]);
  useEffect(() => {
    const timer = window.setInterval(persist, 2000);
    window.addEventListener("pagehide", persist);
    return () => {
      clearInterval(timer);
      window.removeEventListener("pagehide", persist);
      persist();
      window.speechSynthesis?.cancel();
    };
  }, []);
  useEffect(() => {
    if (stopped) controls.current = emptyControls();
  }, [stopped]);
  function show(text: string, who = storyRef.current.chapter) {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
    setLine(text);
    setSpeaker(who);
  }
  function finishAction(obj: Target, viaDial?: Dial, value?: number) {
    const s = storyRef.current;
    const t = currentTask(s);
    if (!t) return;
    if (
      Math.hypot(obj.x - pose.current.x, obj.z - pose.current.z) > 2.65 ||
      nearbyTarget(pose.current, pose.current.yaw, targetId(s))?.id !== obj.id
    ) {
      show(
        "Walk closer and face the object, then press E or the action button.",
      );
      return;
    }
    if (obj.id !== targetId(s)) {
      if (obj.kind === "guide")
        show(
          s.chapter > obj.room.index
            ? `${obj.room.guide}: Our system is ready. ${chapters[Math.min(7, s.chapter)].intro}`
            : `I’m ${obj.room.guide}. This is ${obj.room.name}. Your current task is with ${rooms[s.chapter].guide}; use your map to find them.`,
          obj.room.index,
        );
      else
        show(
          `This is ${obj.label.toLowerCase()} in ${obj.room.guide}’s area. Follow the gold marker for your current task.`,
          obj.room.index,
        );
      return;
    }
    if (t.dial && !viaDial) {
      show(
        `You’re at the right controls. Turn the ${t.dial === "grow" ? "GROW LIGHT" : t.dial === "shield" ? "SHIELD" : "SYSTEM"} dial to at least ${t.minimum}.`,
        s.chapter,
      );
      return;
    }
    const next = advanceStory(s, obj.id, viaDial, value);
    if (next === s) {
      show(
        t.need
          ? `You need to carry ${itemNames[t.need].toLowerCase()} to do this.`
          : "Finish the current task before taking another item.",
      );
      return;
    }
    setStory(next);
    storyRef.current = next;
    const ended = next.chapter !== s.chapter || next.finished;
    if (ended) {
      onChapterComplete?.(s.chapter + 1);
      show(`${t.line} ${chapters[s.chapter].handoff}`, s.chapter);
    } else show(t.line, s.chapter);
    persist();
  }
  const finishRef = useRef(finishAction);
  finishRef.current = finishAction;
  const sceneInteract = useCallback(
    (obj: Target) => finishRef.current(obj),
    [],
  );
  const interactRef = useRef<() => void>(() => {});
  interactRef.current = () => {
    if (stopped) return;
    const now = performance.now();
    if (now - lastAction.current < 250) return;
    lastAction.current = now;
    const target = nearbyTarget(
      pose.current,
      pose.current.yaw,
      targetId(storyRef.current),
    );
    if (target) finishAction(target);
    else
      show(
        "Walk toward an object or crewmate, face it, then press E. The gold marker shows your next story task.",
      );
  };
  useEffect(() => {
    const map: Record<string, keyof Controls> = {
      w: "forward",
      arrowup: "forward",
      s: "back",
      arrowdown: "back",
      a: "left",
      arrowleft: "left",
      d: "right",
      arrowright: "right",
      j: "turnLeft",
      l: "turnRight",
    };
    const down = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (key === "escape" && !e.repeat) {
        e.preventDefault();
        if (mapOpen) setMapOpen(false);
        else if (resetOpen) setResetOpen(false);
        else setPaused((v) => !v);
        return;
      }
      if (
        /INPUT|TEXTAREA|SELECT/.test((e.target as HTMLElement)?.tagName) ||
        document.querySelector("[role=dialog]")
      )
        return;
      if (map[key]) {
        e.preventDefault();
        if (!stopped) controls.current[map[key]] = true;
      } else if (key === "e" && !e.repeat) {
        e.preventDefault();
        interactRef.current();
      } else if (key === "m" && !e.repeat) {
        e.preventDefault();
        setMapOpen((v) => !v);
      } else if (key === "escape" && !e.repeat) {
        e.preventDefault();
        if (mapOpen) setMapOpen(false);
        else setPaused((v) => !v);
      }
    };
    const up = (e: KeyboardEvent) => {
      const key = e.key.toLowerCase();
      if (map[key]) {
        controls.current[map[key]] = false;
        e.preventDefault();
      }
    };
    const clear = () => {
      controls.current = emptyControls();
      drag.current = null;
    };
    window.addEventListener("keydown", down);
    window.addEventListener("keyup", up);
    window.addEventListener("blur", clear);
    document.addEventListener("visibilitychange", clear);
    return () => {
      window.removeEventListener("keydown", down);
      window.removeEventListener("keyup", up);
      window.removeEventListener("blur", clear);
      document.removeEventListener("visibilitychange", clear);
    };
  }, [stopped, mapOpen, resetOpen]);
  function moveStep(key: keyof Controls) {
    if (stopped) return;
    const p = pose.current;
    if (key === "turnLeft" || key === "turnRight")
      p.yaw += ((key === "turnLeft" ? 1 : -1) * Math.PI) / 12;
    else {
      const forward = key === "forward" ? 1 : key === "back" ? -1 : 0,
        side = key === "right" ? 1 : key === "left" ? -1 : 0;
      const next = movePlayer(
        p,
        (-Math.sin(p.yaw) * forward + Math.cos(p.yaw) * side) * 0.8,
        (-Math.cos(p.yaw) * forward - Math.sin(p.yaw) * side) * 0.8,
      );
      p.x = next.x;
      p.z = next.z;
    }
    setViewPose({ ...p });
  }
  function moveButton(
    key: keyof Controls,
    label: string,
    icon: React.ReactNode,
  ) {
    return (
      <button
        className={"move-key move-" + key}
        aria-label={label}
        onPointerDown={(e) => {
          if (stopped) return;
          e.preventDefault();
          e.currentTarget.setPointerCapture(e.pointerId);
          controls.current[key] = true;
        }}
        onPointerUp={() => (controls.current[key] = false)}
        onPointerCancel={() => (controls.current[key] = false)}
        onLostPointerCapture={() => (controls.current[key] = false)}
        onClick={(e) => {
          if (e.detail === 0) moveStep(key);
        }}
      >
        {icon}
      </button>
    );
  }
  function setDial(dial: Dial, value: number) {
    const s = storyRef.current;
    const obj = nearbyTarget(pose.current, pose.current.yaw, targetId(s));
    if (!obj || obj.id !== targetId(s) || currentTask(s)?.dial !== dial) return;
    const updated = {
      ...s,
      dialValues: { ...s.dialValues, [`${s.chapter}:${dial}`]: value },
    };
    setStory(updated);
    storyRef.current = updated;
    if (value >= (currentTask(s)?.minimum ?? 100))
      finishAction(obj, dial, value);
  }
  useEffect(() => {
    const input = (event: Event) => {
      const c = (event as CustomEvent<PanelCommand>).detail;
      if (!c || typeof c !== "object") return;
      if (c.type === "release") {
        controls.current = emptyControls();
        return;
      }
      if (stopped) return;
      if (
        c.type === "move" &&
        ["forward", "back", "left", "right", "turnLeft", "turnRight"].includes(
          c.direction,
        ) &&
        typeof c.pressed === "boolean"
      )
        controls.current[c.direction] = c.pressed;
      else if (c.type === "interact") interactRef.current();
      else if (c.type === "look" && Number.isFinite(c.yaw)) {
        pose.current.yaw += Math.max(-0.5, Math.min(0.5, c.yaw));
        if (Number.isFinite(c.pitch))
          pose.current.pitch = Math.max(
            -0.8,
            Math.min(0.8, pose.current.pitch + (c.pitch ?? 0)),
          );
      } else if (
        c.type === "dial" &&
        ["system", "grow", "shield"].includes(c.dial) &&
        Number.isFinite(c.value)
      )
        setDial(c.dial, Math.max(0, Math.min(100, c.value)));
    };
    window.addEventListener("moonpool:panel-input", input);
    return () => window.removeEventListener("moonpool:panel-input", input);
  }, [stopped]);
  function read() {
    window.speechSynthesis?.cancel();
    if (!("speechSynthesis" in window)) return;
    const u = new SpeechSynthesisUtterance(line);
    u.rate = 0.9;
    u.onstart = () => setSpeaking(true);
    u.onend = () => setSpeaking(false);
    u.onerror = () => setSpeaking(false);
    window.speechSynthesis.speak(u);
  }
  const dialsReady = !!nearby && nearby.id === goalId && !!task?.dial;
  const heading =
    ((Math.round((viewPose.yaw * 180) / Math.PI) % 360) + 360) % 360;
  const canAct = !!nearby && !stopped;
  const actionLabel =
    nearby?.id === goalId
      ? task?.action
      : nearby?.kind === "guide"
        ? `Talk to ${nearby.room.guide}`
        : nearby
          ? "Inspect object"
          : "Move closer to interact";
  return (
    <section
      className="station-adventure"
      aria-label="Moonpool continuous space-station adventure"
    >
      <div
        className="adventure-viewport"
        ref={surface}
        tabIndex={0}
        aria-label="First-person game. WASD or arrow keys move; drag to look; E interacts; M opens map."
        onPointerDown={(e) => {
          if ((e.target as HTMLElement).tagName === "CANVAS" && !stopped) {
            drag.current = { x: e.clientX, y: e.clientY };
            e.currentTarget.setPointerCapture(e.pointerId);
            surface.current?.focus();
          }
        }}
        onPointerMove={(e) => {
          if (drag.current && !stopped) {
            pose.current.yaw -= (e.clientX - drag.current.x) * 0.004;
            pose.current.pitch = Math.max(
              -0.8,
              Math.min(
                0.8,
                pose.current.pitch - (e.clientY - drag.current.y) * 0.003,
              ),
            );
            drag.current = { x: e.clientX, y: e.clientY };
          }
        }}
        onPointerUp={() => (drag.current = null)}
        onPointerCancel={() => (drag.current = null)}
      >
        <GameBoundary>
          <StationScene
            story={story}
            pose={pose}
            controls={controls}
            paused={stopped}
            onPose={setViewPose}
            onInteract={sceneInteract}
          />
        </GameBoundary>
        <header className="adventure-hud">
          <div className="station-wordmark">
            <span className="live-dot" /> MOONPOOL{" "}
            <small>THE LUNAR NIGHT ADVENTURE</small>
          </div>
          <div className="hud-buttons">
            <button
              onClick={() => setReadingsOpen((v) => !v)}
              aria-label="Show system readings"
            >
              <BookOpen size={17} />
              <span>Readings</span>
            </button>
            <button
              onClick={() => setMapOpen((v) => !v)}
              aria-label="Open station map"
            >
              <Map size={17} />
              <span>Map</span>
            </button>
            <button
              onClick={() => setPaused(true)}
              aria-label="Pause adventure"
            >
              <Pause size={17} />
            </button>
          </div>
        </header>
        <div className="adventure-objective">
          <span>
            {story.finished
              ? "CREW MISSION COMPLETE"
              : `CHAPTER ${story.chapter + 1} / 8 · ${rooms[story.chapter].guide.toUpperCase()}`}
          </span>
          <h1>
            {story.finished ? "Welcome to the Moonpool crew." : chapter.title}
          </h1>
          <p>
            {story.finished ? "Keep exploring your station." : task?.action}
          </p>
          <div className="story-meter">
            <i style={{ width: `${progress}%` }} />
          </div>
        </div>
        <div className="adventure-navigation" aria-label="Navigation">
          <span>
            {location
              ? `${location.guide}’s ${location.name}`
              : "Crew corridor"}
          </span>
          <small>
            {heading}°
            {!story.finished && ` · ${distance.toFixed(1)} m to story task`}
          </small>
        </div>
        <span className="adventure-crosshair" aria-hidden="true">
          +
        </span>
        {nearby && (
          <div className="nearby-prompt">
            <kbd>E</kbd>
            <span>{actionLabel}</span>
          </div>
        )}
        <div className="story-dialogue">
          <div className="dialogue-portrait">
            <Guide world={guide.id} speaking={speaking} size={115} />
          </div>
          <div className="dialogue-copy">
            <span>
              {guide.guide} <small>{guide.name}</small>
            </span>
            <p aria-live="polite">{line}</p>
            <button
              className="dialogue-read"
              onClick={read}
              aria-label="Read character dialogue aloud"
            >
              <Volume2 size={15} />
            </button>
          </div>
        </div>
        <div className="adventure-bag" aria-label="Held item">
          <Hand size={18} />
          <span>{story.held ? itemNames[story.held] : "Hands free"}</span>
        </div>
        {readingsOpen && (
          <aside
            className="readings-overlay"
            aria-label="Current chapter readings"
          >
            <button
              aria-label="Close readings"
              onClick={() => setReadingsOpen(false)}
            >
              <X size={16} />
            </button>
            <span>PRACTICE VALUES · CHAPTER {story.chapter + 1}</span>
            <h2>{rooms[story.chapter].guide}’s systems</h2>
            {mission.resources.map((r) => (
              <div key={r.id}>
                {r.label}
                <b>
                  {r.value} <small>{r.unit}</small>
                </b>
              </div>
            ))}
            <p>
              Time and resources advance when you do a mission action. Walking
              and reading are free.
            </p>
          </aside>
        )}
        {mapOpen && (
          <div className="game-modal-shade">
            <section
              className="station-map-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Station map"
            >
              <div className="game-modal-top">
                <div>
                  <span>ONE CONNECTED STATION</span>
                  <h2>Find your crewmates.</h2>
                </div>
                <button
                  aria-label="Close station map"
                  onClick={() => setMapOpen(false)}
                >
                  <X />
                </button>
              </div>
              <svg
                viewBox="-23 -74 46 88"
                role="img"
                aria-label={`Station map. You are in ${location?.name ?? "the crew corridor"}.`}
              >
                <rect x="-3" y="-70" width="6" height="80" fill="#456573" />
                {rooms.map((r) => (
                  <g key={r.id}>
                    <rect
                      x={r.x - 8}
                      y={r.z - 8}
                      width="16"
                      height="16"
                      rx="1"
                      fill={r.index === story.chapter ? r.color : "#284556"}
                      stroke={r.color}
                      strokeWidth=".25"
                    />
                    <text
                      x={r.x}
                      y={r.z - 1}
                      fill={r.index === story.chapter ? "#152d3f" : "#f0ecdb"}
                      textAnchor="middle"
                      fontSize="1.8"
                      fontWeight="bold"
                    >
                      {r.guide}
                    </text>
                    <text
                      x={r.x}
                      y={r.z + 1.5}
                      fill={r.index === story.chapter ? "#284556" : "#b2ccd2"}
                      textAnchor="middle"
                      fontSize="1.2"
                    >
                      {r.index < story.chapter || story.finished
                        ? "✓ SYSTEM READY"
                        : r.name}
                    </text>
                  </g>
                ))}
                {goal && (
                  <circle
                    cx={goal.x}
                    cy={goal.z}
                    r=".8"
                    fill="#ffcf62"
                    stroke="#172b3b"
                    strokeWidth=".2"
                  />
                )}
                <g
                  transform={`translate(${viewPose.x} ${viewPose.z}) rotate(${(-viewPose.yaw * 180) / Math.PI})`}
                >
                  <path
                    d="M0 -1.2L.8 1 .0 .65-.8 1Z"
                    fill="#fff"
                    stroke="#162e42"
                    strokeWidth=".15"
                  />
                </g>
                <text
                  x="0"
                  y="13"
                  textAnchor="middle"
                  fontSize="1.5"
                  fill="#b7d6df"
                >
                  ARRIVAL AIRLOCK
                </text>
              </svg>
              <p>
                White arrow: you · Gold marker: next task. All rooms connect
                through the central corridor. Close the map to keep walking.
              </p>
              <button
                className="game-primary"
                onClick={() => setMapOpen(false)}
              >
                Back to the adventure <Play size={16} />
              </button>
            </section>
          </div>
        )}
        {paused && (
          <div className="game-modal-shade">
            <section
              className="pause-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Adventure paused"
            >
              <span>TAKE YOUR TIME, ASTRONAUT</span>
              <h2>Your crew can wait.</h2>
              <p>
                Your story is saved in this browser. Movement pauses while this
                menu is open.
              </p>
              <button className="game-primary" onClick={() => setPaused(false)}>
                <Play size={17} /> Keep exploring
              </button>
              <button
                onClick={() => {
                  persist();
                  onHandbook(story.chapter + 1);
                }}
              >
                <BookOpen size={17} /> Open the science handbook
              </button>
              <button
                onClick={() => {
                  persist();
                  onBack();
                }}
              >
                <ArrowLeft size={17} /> Save & leave adventure
              </button>
              <button
                onClick={() => {
                  setResetOpen(true);
                  setPaused(false);
                }}
              >
                <RotateCcw size={17} /> Start a new story
              </button>
            </section>
          </div>
        )}
        {resetOpen && (
          <div className="game-modal-shade">
            <section
              className="pause-dialog"
              role="dialog"
              aria-modal="true"
              aria-label="Start a new story"
            >
              <h2>Start from arrival?</h2>
              <p>
                This resets the adventure’s tasks and carried items in this
                browser. Your lesson badges are kept.
              </p>
              <button
                className="game-primary"
                onClick={() => {
                  const s = newStory();
                  setStory(s);
                  storyRef.current = s;
                  pose.current = { x: 0, z: 7, yaw: 0, pitch: 0 };
                  controls.current = emptyControls();
                  setViewPose({ ...pose.current });
                  setResetOpen(false);
                  show(chapters[0].intro, 0);
                  persist();
                }}
              >
                Start new story
              </button>
              <button onClick={() => setResetOpen(false)}>
                Keep my current story
              </button>
            </section>
          </div>
        )}
      </div>
      <footer className="adventure-console">
        <div className="adventure-console-brand">
          <strong>MOONPOOL</strong>
          <span>DIGITAL MISSION CONTROL</span>
          <small>
            <i /> STANDALONE · READY
          </small>
        </div>
        <div className="movement-bank">
          <div className="move-pad">
            {moveButton("forward", "Move forward", <ArrowUp />)}
            {moveButton("left", "Move left", <ArrowLeft />)}
            <span className="pad-center" />
            {moveButton("right", "Move right", <ArrowRight />)}
            {moveButton("back", "Move backward", <ArrowDown />)}
          </div>
          <div className="look-pad">
            {moveButton("turnLeft", "Turn left", <RotateCcw size={19} />)}
            {moveButton(
              "turnRight",
              "Turn right",
              <RotateCcw size={19} style={{ transform: "scaleX(-1)" }} />,
            )}
            <small>LOOK</small>
          </div>
          <span className="movement-caption">HOLD TO MOVE · WASD / ARROWS</span>
        </div>
        <div className="interaction-bank">
          <span>{nearby ? "OBJECT IN REACH" : "EXPLORE THE STATION"}</span>
          <button
            className="adventure-interact"
            disabled={!canAct}
            onClick={() => interactRef.current()}
          >
            <Hand size={21} />
            <b>{actionLabel}</b>
            <kbd>E</kbd>
          </button>
          <small>Drag the main view to look around · M opens map</small>
        </div>
        <div className="adventure-dials">
          {(["system", "grow", "shield"] as Dial[]).map((id) => {
            const value = story.dialValues[`${story.chapter}:${id}`] ?? 0;
            const enabled = dialsReady && task?.dial === id && !stopped;
            return (
              <label className={enabled ? "dial-enabled" : ""} key={id}>
                <span
                  className="adventure-knob"
                  style={
                    {
                      "--angle": `${-135 + value * 2.7}deg`,
                    } as React.CSSProperties
                  }
                >
                  <i />
                </span>
                <b>
                  {id === "grow"
                    ? "Grow light"
                    : id === "shield"
                      ? "Shield"
                      : "System"}
                </b>
                <input
                  aria-label={`${id === "grow" ? "Grow light" : id === "shield" ? "Shield" : "System"} dial`}
                  type="range"
                  min="0"
                  max="100"
                  step="5"
                  value={value}
                  disabled={!enabled}
                  onChange={(e) => setDial(id, Number(e.target.value))}
                />
                <output>{value}%</output>
              </label>
            );
          })}
        </div>
      </footer>
    </section>
  );
}
