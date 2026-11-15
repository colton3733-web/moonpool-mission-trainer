import { ArrowRight, Check, ChevronDown, CircleHelp, Gamepad2, MapPin, Moon, Play, Sparkles } from "lucide-react";
import Guide from "./Guide";
import { curriculum } from "./data/curriculum";

type Props = { onPlay: () => void };

const crewRoles = [
  ["pip", "PIP", "ENGINEER", "Fixes things. If it’s broken, Pip has a wrench for it."],
  ["moss", "MOSS", "SCIENTIST", "Collects samples and asks big questions about new places."],
  ["skim", "SKIM", "PILOT", "Flies the crew’s ship and gets everyone through tight spots."],
  ["tink", "TANK", "MISSION CONTROL", "Keeps the whole Moon base working together."],
  ["luma", "LUMA", "SCOUT", "Lights up dark places and scouts ahead of the rest of the crew."],
  ["nori", "NORI", "NAVIGATOR", "Reads the star map and picks the route for the whole crew."],
  ["pebble", "PEBBLE", "HELPER", "Small but tough, and ready to help wherever needed."],
  ["bloop", "BLOOP", "MEDIC", "Takes care of the crew when someone is hurt or stuck."],
] as const;
const benefits = [
  { Icon: Moon, title: "A BASE ON THE MOON", copy: "Visit a Moon base near the lunar south pole." },
  { Icon: Sparkles, title: "REAL NASA SCIENCE", copy: "Lessons connect to real space science." },
  { Icon: Check, title: "CERTIFICATES", copy: "Earn a certificate after each completed mission." },
  { Icon: CircleHelp, title: "READ ALONG", copy: "Every story is shown as captions at your pace." },
  { Icon: Gamepad2, title: "PLAY ANYWHERE", copy: "Play on a phone, tablet, or computer." },
  { Icon: MapPin, title: "A GAME BOARD", copy: "The physical board is an extra way to play together." },
];

export default function AquanautsHome({ onPlay }: Props) {
  const showCrew = () => document.getElementById("crew")?.scrollIntoView({ behavior: "smooth" });
  return <div className="aquanauts-home">
    <header className="aqua-nav">
      <button className="aqua-logo" onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}>
        <span className="aqua-logo-mark"><Moon /></span><span>AQUANAUTS</span>
      </button>
      <nav><button onClick={onPlay}>PLAY THE GAME</button><button onClick={showCrew}>MEET THE CREW</button></nav>
      <button className="aqua-menu" aria-label="Open menu"><span /><span /><span /></button>
    </header>

    <section className="aqua-hero">
      <div className="aqua-stars" aria-hidden="true" />
      <div className="aqua-hero-copy">
        <p className="aqua-kicker">A MOON BASE ADVENTURE FOR CURIOUS KIDS</p>
        <h1>SWIM THROUGH<br /><em>THE COSMOS</em></h1>
        <p className="aqua-lede">Aquanauts is an astronaut simulation game that teaches kids real-world problem solving.</p>
        <div className="aqua-actions"><button onClick={onPlay} className="aqua-primary"><Play fill="currentColor" /> PLAY THE GAME</button><button onClick={showCrew} className="aqua-secondary">MEET THE CREW <ArrowRight /></button></div>
      </div>
      <div className="aqua-hero-world" aria-label="Moonpool base on the Moon">
        <div className="aqua-moon" /><div className="aqua-dome"><span>MOONPOOL<br />BASE</span></div>
        <Guide world="tink" size={250} /><Guide world="bloop" size={170} />
        <div className="aqua-route route-one" /><div className="aqua-route route-two" />
      </div>
    </section>

    <section className="aqua-crew-section" id="crew">
      <p className="aqua-kicker">THE CREW</p><h2>MEET THE <em>AQUANAUTS</em></h2>
      <div className="aqua-crew-grid">{crewRoles.map(([world, name, role, copy]) => <article key={world} className="aqua-crew-card"><Guide world={world} size={128} /><div><h3>{name}</h3><b>{role}</b><p>{copy}</p></div></article>)}</div>
    </section>

    <section className="aqua-statement"><p>BE AN ASTRONAUT. WORK WITH THE CREW. SOLVE REAL PROBLEMS.</p></section>

    <section className="aqua-how">
      <div><p className="aqua-kicker">ABOUT THE GAME</p><h2>HOW THE GAME <em>WORKS</em></h2><p className="aqua-lede dark">Kids play as an astronaut living in the Aquanauts’ world. The sea-creature crew runs a base on the Moon, and each lesson gives you a problem to solve together.</p></div>
      <div className="aqua-steps">
        {[['01','MEET THE CREW','Each Aquanaut has a different job at the Moon base.'],['02','PLAY A LESSON','Read the problem, think it through, and decide what to do.'],['03','MOVE ON','Finish a lesson to earn a certificate and unlock the next mission.']].map(([n,title,copy]) => <article key={n}><span>{n}</span><div><h3>{title}</h3><p>{copy}</p></div></article>)}
      </div>
    </section>

    <section className="aqua-get"><p className="aqua-kicker">MORE ABOUT THE GAME</p><h2>WHAT YOU <em>GET</em></h2><div className="aqua-benefits">
      {benefits.map(({ Icon, title, copy }, i) => <article key={title}><span>{String(i+1).padStart(2,'0')}</span><Icon /><h3>{title}</h3><p>{copy}</p></article>)}
    </div></section>

    <section className="aqua-parent"><div className="aqua-parent-illustration"><Guide world="nori" size={220} /><Guide world="pebble" size={155} /></div><div><p className="aqua-kicker">FOR PARENTS AND TEACHERS</p><h2>EASY TO FOLLOW <em>ALONG</em></h2><div className="aqua-parent-points"><p><b>ONE ACCOUNT</b>Game progress and certificates save right in the browser.</p><p><b>EASY TO READ</b>Captions let kids revisit a line whenever they need.</p><p><b>NOTHING TO INSTALL</b>Open the game in a browser and start exploring.</p></div></div></section>

    <section className="aqua-faq"><p className="aqua-kicker">QUESTIONS</p><h2>GOOD TO <em>KNOW</em></h2>{[['What ages is it for?','Aquanauts is made for kids ages 7 to 12.'],['Do I need to download anything?','No. It runs in a browser, with no app store needed.'],['Do I need the game board to play?','No. The digital astronaut adventure works by itself.'],['How does my child move on?','They finish a mission, earn a certificate, and the next mission unlocks.']].map(([q,a]) => <details key={q}><summary>{q}<ChevronDown /></summary><p>{a}</p></details>)}</section>

    <section className="aqua-final"><Guide world="tink" size={180} /><div><p className="aqua-kicker">READY FOR LIFTOFF?</p><h2>START YOUR MOON<br /><em>MISSION</em></h2><button onClick={onPlay} className="aqua-primary">PLAY THE GAME <ArrowRight /></button></div></section>
    <footer className="aqua-footer"><b>AQUANAUTS</b><span>© 2026 Aquanauts · All rights reserved · Ages 7–12</span><button onClick={showCrew}>EXPLORE THE CREW</button></footer>
  </div>;
}
