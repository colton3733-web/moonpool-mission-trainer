import React, {
  MutableRefObject,
  Suspense,
  useEffect,
  useMemo,
  useRef,
} from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import { Billboard, Html, Stars, useGLTF, useTexture } from "@react-three/drei";
import * as THREE from "three";
import Guide from "../Guide";
import {
  rooms,
  targets,
  Room,
  Target,
  colliders,
  movePlayer,
  Point,
} from "./world";
import {
  StoryState,
  currentTask,
  targetId,
  chapters,
  taskId,
  Item,
} from "./story";
export type Pose = Point & { yaw: number; pitch: number };
export type Controls = {
  forward: boolean;
  back: boolean;
  left: boolean;
  right: boolean;
  turnLeft: boolean;
  turnRight: boolean;
};
export const emptyControls = (): Controls => ({
  forward: false,
  back: false,
  left: false,
  right: false,
  turnLeft: false,
  turnRight: false,
});
type Vec = [number, number, number];
function Box({
  p,
  s,
  c = "#b7c8cc",
  emissive = false,
  rotation,
}: {
  p: Vec;
  s: Vec;
  c?: string;
  emissive?: boolean;
  rotation?: Vec;
}) {
  return (
    <mesh position={p} rotation={rotation}>
      <boxGeometry args={s} />
      <meshStandardMaterial
        color={c}
        roughness={0.6}
        metalness={0.15}
        emissive={emissive ? c : "#000"}
        emissiveIntensity={emissive ? 0.6 : 0}
      />
    </mesh>
  );
}
function Cylinder({
  p,
  r = 0.4,
  h = 1,
  c = "#90dce0",
}: {
  p: Vec;
  r?: number;
  h?: number;
  c?: string;
}) {
  return (
    <mesh position={p}>
      <cylinderGeometry args={[r, r, h, 24]} />
      <meshStandardMaterial color={c} roughness={0.3} metalness={0.25} />
    </mesh>
  );
}
function Asset({
  name,
  p,
  height = 1,
  rotation = 0,
}: {
  name: string;
  p: Vec;
  height?: number;
  rotation?: number;
}) {
  const source = useGLTF(
    `${import.meta.env.BASE_URL}models/kenney/${name}.glb`,
  );
  const { model, scale } = useMemo(() => {
    const model = source.scene.clone(true);
    const bounds = new THREE.Box3().setFromObject(model),
      center = bounds.getCenter(new THREE.Vector3()),
      size = bounds.getSize(new THREE.Vector3());
    model.position.set(-center.x, -bounds.min.y, -center.z);
    return { model, scale: height / Math.max(0.01, size.y) };
  }, [source.scene, height]);
  return (
    <group position={p} rotation={[0, rotation, 0]} scale={scale}>
      <primitive object={model} />
    </group>
  );
}
function TextSign({
  text,
  p,
  width = 2.7,
  rotation = [0, 0, 0],
  color = "#b7efdf",
}: {
  text: string;
  p: Vec;
  width?: number;
  rotation?: Vec;
  color?: string;
}) {
  const texture = useMemo(() => {
    const canvas = document.createElement("canvas");
    canvas.width = 768;
    canvas.height = 192;
    const ctx = canvas.getContext("2d")!;
    ctx.fillStyle = "#152e41";
    ctx.fillRect(0, 0, 768, 192);
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.font = "bold 45px Verdana";
    const words = text.length > 24 ? text.split(" ") : [text];
    const midpoint = Math.ceil(words.length / 2);
    if (words.length > 1) {
      ctx.fillText(words.slice(0, midpoint).join(" "), 384, 66, 720);
      ctx.fillText(words.slice(midpoint).join(" "), 384, 130, 720);
    } else ctx.fillText(text, 384, 98, 720);
    const t = new THREE.CanvasTexture(canvas);
    t.colorSpace = THREE.SRGBColorSpace;
    return t;
  }, [text, color]);
  useEffect(() => () => texture.dispose(), [texture]);
  return (
    <mesh position={p} rotation={rotation}>
      <planeGeometry args={[width, width / 4]} />
      <meshBasicMaterial map={texture} side={THREE.DoubleSide} />
    </mesh>
  );
}
export function ItemModel({ item, p = [0, 0, 0] }: { item: Item; p?: Vec }) {
  return (
    <group position={p}>
      {item.includes("bottle") ? (
        <>
          <Cylinder
            p={[0, 0.18, 0]}
            r={0.1}
            h={0.36}
            c={
              item === "used-bottle"
                ? "#b4a48a"
                : item === "empty-bottle"
                  ? "#d9e4dc"
                  : "#8adddf"
            }
          />
          <Cylinder p={[0, 0.39, 0]} r={0.065} h={0.065} c="#f6a45d" />
          <Box p={[0, 0.2, 0.102]} s={[0.14, 0.14, 0.01]} c="#fff0ca" />
        </>
      ) : item === "wrench" ? (
        <>
          <Box p={[0, 0.2, 0]} s={[0.08, 0.45, 0.06]} c="#b8c6d2" />
          <mesh position={[0, 0.45, 0]}>
            <torusGeometry args={[0.11, 0.04, 8, 20, Math.PI * 1.55]} />
            <meshStandardMaterial color="#b8c6d2" />
          </mesh>
        </>
      ) : item === "cable" ? (
        <mesh position={[0, 0.18, 0]} rotation={[Math.PI / 2, 0, 0]}>
          <torusGeometry args={[0.2, 0.045, 10, 32]} />
          <meshStandardMaterial color="#f4b365" />
        </mesh>
      ) : item === "food" ? (
        <>
          <Box p={[0, 0.2, 0]} s={[0.55, 0.4, 0.4]} c="#c59155" />
          <Box p={[0, 0.42, 0]} s={[0.5, 0.04, 0.37]} c="#9acd6b" />
        </>
      ) : item === "sample" ? (
        <>
          <Cylinder p={[0, 0.18, 0]} r={0.085} h={0.35} c="#d9c2e6" />
          <Cylinder p={[0, 0.38, 0]} r={0.09} h={0.05} c="#506a7a" />
        </>
      ) : (
        <>
          <Box
            p={[0, 0.23, 0]}
            s={[0.28, 0.45, 0.22]}
            c={item === "cell" ? "#f4c664" : "#a8c8db"}
          />
          <Box
            p={[0, 0.25, 0.12]}
            s={[0.1, 0.28, 0.015]}
            c="#94efe5"
            emissive
          />
        </>
      )}
    </group>
  );
}
function Handheld({ item }: { item: Item | null }) {
  const ref = useRef<THREE.Group>(null);
  const offset = useMemo(() => new THREE.Vector3(0.37, -0.43, -0.72), []);
  useFrame(({ camera }) => {
    if (ref.current) {
      ref.current.position
        .copy(offset)
        .applyQuaternion(camera.quaternion)
        .add(camera.position);
      ref.current.quaternion.copy(camera.quaternion);
    }
  });
  return item ? (
    <group ref={ref}>
      <group rotation={[0, 0, -0.12]} scale={item === "food" ? 0.7 : 1}>
        <ItemModel item={item} />
      </group>
      <mesh position={[0.04, -0.05, 0.06]} rotation={[0, 0, -0.3]}>
        <capsuleGeometry args={[0.08, 0.2, 4, 12]} />
        <meshStandardMaterial color="#e7e5dc" />
      </mesh>
      <Cylinder p={[0.08, -0.16, 0.06]} r={0.1} h={0.1} c="#ed9959" />
    </group>
  ) : null;
}
function PlantBed({ p, grown = false }: { p: Vec; grown?: boolean }) {
  return (
    <group position={p}>
      <Box p={[0, 0.55, 0]} s={[2.2, 1.1, 1]} c="#355969" />
      <Box p={[0, 1.12, 0]} s={[2.25, 0.08, 1.05]} c="#b6d4c2" />
      {[-0.7, 0, 0.7].map((x, i) => (
        <group key={x}>
          <Cylinder p={[x, 1.18, 0]} r={0.24} h={0.13} c="#6d5139" />
          <mesh
            position={[x, grown ? 1.55 : 1.35, 0]}
            scale={[0.8, grown ? 1.5 : 0.7, 0.7]}
          >
            <sphereGeometry args={[0.23, 12, 12]} />
            <meshStandardMaterial color={i % 2 ? "#acd76e" : "#79b969"} />
          </mesh>
          <mesh
            position={[x + 0.15, grown ? 1.6 : 1.4, 0.03]}
            rotation={[0, 0, -0.65]}
            scale={[0.7, 1, 0.4]}
          >
            <sphereGeometry args={[0.23, 12, 12]} />
            <meshStandardMaterial color="#a8d578" />
          </mesh>
        </group>
      ))}
    </group>
  );
}
function ScrubberFan({ running }: { running: boolean }) {
  const ref = useRef<THREE.Group>(null);
  useFrame((_, dt) => {
    if (ref.current && running) ref.current.rotation.z -= dt * 3;
  });
  return (
    <group position={[0, 1.75, 0.4]}>
      <mesh>
        <torusGeometry args={[0.34, 0.04, 8, 28]} />
        <meshStandardMaterial color="#b2d7d8" />
      </mesh>
      <group ref={ref}>
        {[0, 1, 2].map((n) => (
          <group key={n} rotation={[0, 0, (n * Math.PI * 2) / 3]}>
            <Box p={[0, 0.15, 0]} s={[0.12, 0.32, 0.035]} c="#dbded3" />
          </group>
        ))}
      </group>
    </group>
  );
}
function RoomDecor({ room, story }: { room: Room; story: StoryState }) {
  const { index: i, x, z, color } = room;
  const complete = story.finished || story.chapter > i;
  const shield = (story.dialValues["3:shield"] ?? 0) / 100;
  const grow = story.dialValues["2:grow"] ?? 0;
  return (
    <group>
      {i === 0 && (
        <>
          {[-5, -2, 1].map((v, n) => (
            <group key={v} position={[x + v, 0, z - 6.6]}>
              <Cylinder
                p={[0, 1.5, 0]}
                r={0.55}
                h={2.8}
                c={n === 1 ? "#80b7d2" : "#91d4ce"}
              />
              <Cylinder p={[0, 2.95, 0]} r={0.62} h={0.14} c="#cad5d4" />
              <Box
                p={[0, 1.5, 0.56]}
                s={[0.2, 1.9, 0.04]}
                c="#b6f4e7"
                emissive
              />
            </group>
          ))}
          <Box p={[x + 5, 1.65, z - 7]} s={[3.4, 2.4, 0.4]} c="#4f8495" />
          <TextSign p={[x + 5, 2.2, z - 6.78]} text="WATER + AIR" width={2.5} />
        </>
      )}
      {i === 1 && (
        <>
          {[-5, -2.5, 0, 2.5, 5].map((v) => (
            <group key={v}>
              <Box
                p={[x + v, 1.6, z - 6.4]}
                s={[1.75, 2.8, 0.75]}
                c="#365273"
              />
              <Box
                p={[x + v, 1.6, z - 5.99]}
                s={[1.5, 0.2, 0.03]}
                c={
                  complete || story.done.includes("1:2") ? "#a1dfaa" : "#f3c766"
                }
                emissive
              />
              {[-0.8, -0.4, 0, 0.4, 0.8].map((y) => (
                <Box
                  key={y}
                  p={[x + v, 1.7 + y, z - 5.98]}
                  s={[1.45, 0.025, 0.04]}
                  c="#668eaf"
                />
              ))}
            </group>
          ))}
        </>
      )}
      {i === 2 && (
        <>
          {[-4, 0, 4].map((v) => (
            <PlantBed
              key={v}
              p={[x + v, 0, z - 6.3]}
              grown={story.done.includes("2:2")}
            />
          ))}
          <Box
            p={[x, 3.2, z - 5.5]}
            s={[12, 0.1, 1]}
            c={grow >= 50 ? "#fff3bc" : "#6b8791"}
            emissive={grow >= 50}
          />
        </>
      )}
      {i === 3 && (
        <>
          {[-5, 0, 5].map((v) => (
            <group key={v}>
              <Box p={[x + v, 0.4, z - 6.2]} s={[2.4, 0.8, 2]} c="#667787" />
              <Box
                p={[x + v, 0.88, z - 6.2]}
                s={[2.25, 0.2, 1.85]}
                c="#c0b3d7"
              />
              <Box
                p={[x + v, 1.02, z - 6.7]}
                s={[1.5, 0.16, 0.5]}
                c="#ede9de"
              />
            </group>
          ))}
          {[-4, -2, 0, 2, 4].map((v) => (
            <Box
              key={v}
              p={[x + 6.8, 1.9, z + v]}
              s={[0.15, 3.8, 1.8]}
              c={shield >= 0.8 ? "#66758c" : "#a0b2c1"}
              rotation={[0, ((1 - shield) * Math.PI) / 2, 0]}
            />
          ))}
        </>
      )}
      {i === 4 && (
        <>
          {[-5, 0, 5].map((v) => (
            <group key={v}>
              <Box p={[x + v, 1.15, z - 6.5]} s={[2.5, 2.3, 0.7]} c="#775d54" />
              {[-0.7, 0, 0.7].map((w) => (
                <Cylinder
                  key={w}
                  p={[x + v + w, 2.7, z - 6.5]}
                  r={0.18}
                  h={0.8}
                  c="#c9a484"
                />
              ))}
            </group>
          ))}
        </>
      )}
      {i === 5 && (
        <>
          {[-4.5, 0, 4.5].map((v, n) => (
            <group key={v}>
              <Cylinder
                p={[x + v, 1.6, z - 6.4]}
                r={1}
                h={3.1}
                c={["#8acbd6", "#b3bcaa", "#6daebc"][n]}
              />
              <Cylinder
                p={[x + v, 3.2, z - 6.4]}
                r={1.05}
                h={0.15}
                c="#bfcfd0"
              />
              <Box
                p={[x + v, 1.7, z - 5.37]}
                s={[0.17, 2, 0.02]}
                c="#b2f4e9"
                emissive
              />
            </group>
          ))}
        </>
      )}
      {i === 6 && (
        <>
          <Cylinder p={[x, 1.1, z - 6.7]} r={0.35} h={2} c="#adb8ce" />
          <group position={[x, 2.3, z - 6.7]} rotation={[0.75, 0, 0.35]}>
            <Cylinder p={[0, 0, 0]} r={0.4} h={2} c="#d1c9e0" />
            <Cylinder p={[0, 1.05, 0]} r={0.34} h={0.08} c="#68abbc" />
          </group>
          <mesh position={[x - 4, 2.3, z - 7.7]}>
            <sphereGeometry args={[1, 32, 24]} />
            <meshStandardMaterial
              color="#8caaca"
              emissive="#5594b2"
              emissiveIntensity={0.3}
            />
          </mesh>
        </>
      )}
      {i === 7 && (
        <>
          {[-5, 0, 5].map((v) => (
            <group key={v}>
              <Box p={[x + v, 1.9, z - 6.8]} s={[3.5, 2.5, 0.3]} c="#19374c" />
              <TextSign
                text={
                  v === 0
                    ? "MOONPOOL · READY"
                    : v < 0
                      ? "CREW SYSTEMS"
                      : "SCIENCE + SUPPLY"
                }
                p={[x + v, 2.2, z - 6.62]}
                width={3}
              />
              <Box
                p={[x + v, 1.25, z - 6.6]}
                s={[2.7, 0.05, 0.04]}
                c={complete ? "#98e5b2" : color}
                emissive
              />
            </group>
          ))}
        </>
      )}
    </group>
  );
}
const crewCrops: Record<string, [number, number, number]> = {
  tink: [375, 330, 520],
  bloop: [925, 340, 450],
  skim: [400, 815, 520],
  pebble: [955, 795, 530],
  moss: [380, 1310, 460],
  nori: [895, 1315, 475],
  pip: [380, 1745, 480],
  luma: [915, 1770, 470],
};
function CrewCharacter({
  world,
  onClick,
}: {
  world: string;
  onClick: () => void;
}) {
  const texture = useTexture(
    `${import.meta.env.BASE_URL}crew/original-art.png`,
  );
  const crop = crewCrops[world];
  const uniforms = useMemo(
    () => ({
      art: { value: texture },
      crop: { value: new THREE.Vector3(...crop) },
    }),
    [texture, world],
  );
  return (
    <Billboard position={[0, 1.02, 0]}>
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onClick();
        }}
      >
        <planeGeometry args={[1.85, 1.85]} />
        <shaderMaterial
          transparent
          side={THREE.DoubleSide}
          uniforms={uniforms}
          vertexShader="varying vec2 artUV;void main(){artUV=uv;gl_Position=projectionMatrix*modelViewMatrix*vec4(position,1.0);}"
          fragmentShader="uniform sampler2D art;uniform vec3 crop;varying vec2 artUV;void main(){vec2 uv=vec2((crop.x+(1.0-artUV.y)*crop.z)/1640.0,1.0-(crop.y+(1.0-artUV.x)*crop.z)/2360.0);vec4 color=texture2D(art,uv);float white=min(color.r,min(color.g,color.b));if(white>0.975)discard;gl_FragColor=vec4(color.rgb,color.a*(1.0-smoothstep(0.94,0.975,white)));}"
        />
      </mesh>
    </Billboard>
  );
}
function InteriorRoom({
  room,
  story,
  onInteract,
}: {
  room: Room;
  story: StoryState;
  onInteract: (t: Target) => void;
}) {
  const { x, z, color, id } = room;
  const floor = "#ced4cf",
    wall = "#b6c5c8";
  const active = targetId(story);
  const t = currentTask(story);
  return (
    <group>
      <Box p={[x, -0.12, z]} s={[16, 0.24, 16]} c={floor} />
      <Box p={[x, 4.4, z]} s={[16, 0.2, 16]} c="#8eacb2" />
      {colliders
        .filter(
          (c) =>
            c.id.startsWith(id + ":") &&
            ["outer", "north", "south", "innerA", "innerB"].includes(
              c.id.split(":")[1],
            ),
        )
        .map((c) => (
          <Box key={c.id} p={[c.x, 2.15, c.z]} s={[c.w, 4.3, c.d]} c={wall} />
        ))}
      {[-6, -2, 2, 6].map((v) => (
        <React.Fragment key={v}>
          <Box p={[x + v, 4.23, z]} s={[0.15, 0.07, 13]} c="#e3f2de" emissive />
          <Box p={[x + v, 0.015, z]} s={[0.025, 0.025, 15]} c="#a6b8bb" />
        </React.Fragment>
      ))}
      <Box
        p={[x + (x < 0 ? 7.78 : -7.78), 0.5, z - 5.15]}
        s={[0.1, 0.1, 5.5]}
        c={color}
        emissive
      />
      <Box
        p={[x + (x < 0 ? 7.78 : -7.78), 0.5, z + 5.15]}
        s={[0.1, 0.1, 5.5]}
        c={color}
        emissive
      />
      <Box
        p={[x + (x < 0 ? 7.85 : -7.85), 3.6, z]}
        s={[0.35, 0.35, 4.7]}
        c={color}
      />
      <TextSign
        p={[x + (x < 0 ? 8.03 : -8.03), 3.55, z]}
        width={3.8}
        rotation={[0, x < 0 ? Math.PI / 2 : -Math.PI / 2, 0]}
        text={`${room.guide} · ${room.name}`}
        color={color}
      />
      <RoomDecor room={room} story={story} />
      <Asset name="barrels_rail" p={[x - 5.5, 0, z + 6.5]} height={0.9} />
      <Asset name="machine_wirelessCable" p={[x + 6, 0, z + 6]} height={1.7} />
      <Asset name="pipe_corner" p={[x + 6.7, 2.8, z - 6.5]} height={0.65} />
      {room.index === 6 && (
        <Asset
          name="satelliteDish_detailed"
          p={[x + 5, 0, z - 6.5]}
          height={2.3}
        />
      )}
      {targets
        .filter((v) => v.room.id === id)
        .map((obj) => {
          const isActive = obj.id === active;
          const relevant = chapters[room.index].tasks.find(
            (v) => v.at === obj.kind,
          );
          const itemTask =
            isActive && t?.take ? t : relevant?.take ? relevant : undefined;
          const picked =
            itemTask &&
            story.done.includes(
              taskId(room.index, chapters[room.index].tasks.indexOf(itemTask)),
            );
          const onClick = () => onInteract(obj);
          return (
            <group key={obj.id} position={[obj.x, 0, obj.z]}>
              {obj.kind === "guide" ? (
                <>
                  <Cylinder p={[0, 0.06, 0]} r={0.6} h={0.12} c={color} />
                  <CrewCharacter world={id} onClick={onClick} />
                  <Html
                    transform
                    sprite
                    position={[0, 2.1, 0]}
                    distanceFactor={4}
                    occlude
                  >
                    <button
                      className="crew-name-label"
                      aria-label={`Talk to ${room.guide} in ${room.name}`}
                      onClick={onClick}
                    >
                      {room.guide}
                    </button>
                  </Html>
                </>
              ) : (
                <group
                  onClick={(e) => {
                    e.stopPropagation();
                    onClick();
                  }}
                >
                  {obj.kind === "monitor" || obj.kind === "control" ? (
                    <Asset name="desk_computer" p={[0, 0, 0]} height={1.07} />
                  ) : obj.kind === "machine" ? (
                    <Asset
                      name={
                        id === "bloop" || id === "skim"
                          ? "machine_barrelLarge"
                          : "machine_generator"
                      }
                      p={[0, 0, 0]}
                      height={id === "bloop" || id === "skim" ? 1.45 : 1}
                    />
                  ) : (
                    <Asset name="desk_computer" p={[0, 0, 0]} height={1.07} />
                  )}
                  <Box
                    p={[0, 1.04, 0]}
                    s={[
                      obj.kind === "machine" ? 2.1 : 1.9,
                      0.09,
                      obj.kind === "machine" ? 1.5 : 1.2,
                    ]}
                    c="#e2dfcc"
                  />
                  <Box
                    p={[0, 0.17, 0.56]}
                    s={[1.6, 0.1, 0.04]}
                    c={isActive ? "#f9c45d" : color}
                    emissive
                  />
                  {obj.kind === "supply" ||
                  (obj.kind === "secondary" &&
                    (id === "pip" || id === "nori")) ||
                  obj.kind === "return" ? (
                    <>
                      {itemTask && !picked && (
                        <ItemModel item={itemTask.take!} p={[0, 1.1, 0]} />
                      )}
                      {id === "nori" && obj.kind === "secondary" && (
                        <PlantBed
                          p={[0, -0.2, 0]}
                          grown={story.done.includes("2:2")}
                        />
                      )}
                    </>
                  ) : obj.kind === "machine" ? (
                    <>
                      <Cylinder
                        p={[0, 1.75, -0.3]}
                        r={0.48}
                        h={1.3}
                        c={color}
                      />
                      {id === "bloop" && (
                        <ScrubberFan running={story.done.includes("0:4")} />
                      )}
                      <Box
                        p={[0, 1.65, 0.21]}
                        s={[0.45, 0.22, 0.05]}
                        c={story.chapter > room.index ? "#9ad7a0" : "#f4c478"}
                        emissive
                      />
                    </>
                  ) : (
                    <>
                      <Box
                        p={[0, 1.55, -0.35]}
                        s={[1.7, 0.9, 0.14]}
                        c="#1b3346"
                      />
                      <TextSign
                        text={
                          isActive
                            ? t!.action
                            : obj.kind === "monitor"
                              ? "SYSTEM READINGS"
                              : obj.kind === "control"
                                ? "CONTROL PANEL"
                                : "SUPPLY STATION"
                        }
                        p={[0, 1.6, -0.26]}
                        width={1.5}
                      />
                      {[-0.5, 0, 0.5].map((v) => (
                        <Cylinder
                          key={v}
                          p={[v, 1.12, 0.1]}
                          r={0.09}
                          h={0.1}
                          c={color}
                        />
                      ))}
                    </>
                  )}
                </group>
              )}
              {isActive && (
                <>
                  <mesh
                    position={[0, 0.025, 0]}
                    rotation={[-Math.PI / 2, 0, 0]}
                  >
                    <ringGeometry args={[0.95, 1.02, 40]} />
                    <meshBasicMaterial
                      color="#ffd572"
                      transparent
                      opacity={0.85}
                    />
                  </mesh>
                  <mesh position={[0, 2.8, 0]}>
                    <octahedronGeometry args={[0.13]} />
                    <meshBasicMaterial color="#ffcf62" />
                  </mesh>
                </>
              )}
            </group>
          );
        })}
    </group>
  );
}
function CameraController({
  pose,
  controls,
  paused,
  onPose,
}: {
  pose: MutableRefObject<Pose>;
  controls: MutableRefObject<Controls>;
  paused: boolean;
  onPose: (p: Pose) => void;
}) {
  const clock = useRef(0);
  useFrame(({ camera }, dt) => {
    const p = pose.current,
      c = controls.current;
    if (!paused) {
      p.yaw +=
        (Number(c.turnLeft) - Number(c.turnRight)) * Math.min(dt, 0.05) * 1.6;
      const forward = Number(c.forward) - Number(c.back),
        side = Number(c.right) - Number(c.left),
        n = Math.max(1, Math.hypot(forward, side));
      const speed = 3.6 * Math.min(dt, 0.05);
      const next = movePlayer(
        p,
        ((-Math.sin(p.yaw) * forward + Math.cos(p.yaw) * side) * speed) / n,
        ((-Math.cos(p.yaw) * forward - Math.sin(p.yaw) * side) * speed) / n,
      );
      p.x = next.x;
      p.z = next.z;
    }
    camera.position.set(p.x, 1.62, p.z);
    camera.rotation.set(p.pitch, p.yaw, 0, "YXZ");
    clock.current += dt;
    if (clock.current > 0.12) {
      onPose({ ...p });
      clock.current = 0;
    }
  });
  return null;
}
function StationScene({
  story,
  pose,
  controls,
  paused,
  onPose,
  onInteract,
}: {
  story: StoryState;
  pose: MutableRefObject<Pose>;
  controls: MutableRefObject<Controls>;
  paused: boolean;
  onPose: (p: Pose) => void;
  onInteract: (t: Target) => void;
}) {
  return (
    <Canvas
      camera={{ position: [0, 1.62, 7], fov: 70, near: 0.05, far: 160 }}
      dpr={[1, 1.5]}
      gl={{ antialias: true, powerPreference: "high-performance" }}
    >
      <color attach="background" args={["#132a40"]} />
      <fog attach="fog" args={["#132a40", 45, 120]} />
      <ambientLight intensity={1.65} />
      <directionalLight position={[0, 6, 8]} intensity={1.2} color="#fff3d5" />
      <Stars radius={110} depth={20} count={800} factor={2} />
      <Box p={[0, -0.12, -30]} s={[6, 0.24, 80]} c="#8fa7af" />
      <Box p={[0, 4.4, -30]} s={[6, 0.2, 80]} c="#507284" />
      {Array.from({ length: 21 }, (_, i) => -70 + i * 4).map((z) => (
        <React.Fragment key={z}>
          <Box p={[0, 4.24, z]} s={[2.3, 0.06, 0.17]} c="#d9e8cf" emissive />
          <Box p={[-2.5, 0.02, z]} s={[0.07, 0.025, 2.8]} c="#e9c278" />
          <Box p={[2.5, 0.02, z]} s={[0.07, 0.025, 2.8]} c="#e9c278" />
        </React.Fragment>
      ))}
      {Array.from({ length: 4 }, (_, i) => -10 - i * 20).map((z) => (
        <React.Fragment key={z}>
          {[-3, 3].map((x) => (
            <Box key={x} p={[x, 2.15, z]} s={[0.3, 4.3, 4]} c="#91a7ad" />
          ))}
        </React.Fragment>
      ))}
      {[10, -70].map((z) => (
        <Box key={z} p={[0, 2.15, z]} s={[6, 4.3, 0.3]} c="#536f7e" />
      ))}
      {[-69, 9].map((z) =>
        [-3, 3].map((x) => (
          <Box
            key={`${x}:${z}`}
            p={[x, 2.15, z]}
            s={[0.3, 4.3, 2]}
            c="#91a7ad"
          />
        )),
      )}
      <TextSign
        text="MOONPOOL · CREW DECK"
        p={[0, 2.6, 9.82]}
        width={4}
        rotation={[0, Math.PI, 0]}
      />
      <Suspense fallback={null}>
        {rooms.map((room) => (
          <InteriorRoom
            key={room.id}
            room={room}
            story={story}
            onInteract={onInteract}
          />
        ))}
      </Suspense>
      <CameraController
        pose={pose}
        controls={controls}
        paused={paused}
        onPose={onPose}
      />
      <Handheld item={story.held} />
    </Canvas>
  );
}

export default React.memo(StationScene);
