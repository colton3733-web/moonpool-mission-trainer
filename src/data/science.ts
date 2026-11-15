/** Verified NASA references. These are reference cards, never live telemetry. */
export interface ScienceCard {
  level: number;
  title: string;
  fact: string;
  practiceDifference: string;
  sourceName: string;
  url: string;
  badge: string;
  verifiedOn: string;
  supportingSources?: { title: string; url: string }[];
}

export const science: ScienceCard[] = [
  {
    level: 1,
    title: 'Two different jobs keep air usable',
    fact: 'NASA life-support work includes separate systems for oxygen generation, carbon dioxide removal, and water recovery.',
    practiceDifference: 'Our oxygen and carbon dioxide meters are teaching indexes. They are not real spacecraft gas measurements or safe operating limits.',
    sourceName: 'NASA Johnson Space Center · Life Support Subsystems',
    url: 'https://www.nasa.gov/reference/jsc-life-support-subsystems/',
    badge: 'NASA reference · verified Nov 14, 2026', verifiedOn: '2026-11-14',
  },
  {
    level: 2,
    title: 'Planning for a long lunar night',
    fact: 'On much of the Moon, day and night each last about two Earth weeks. Lighting near the poles depends on the location and terrain.',
    practiceDifference: 'Two game turns stand in for a much longer dark period. Eight energy tokens are a practice budget, not a NASA battery capacity.',
    sourceName: 'NASA Science · Moonlight',
    url: 'https://science.nasa.gov/moon/moonlight/',
    badge: 'NASA reference · verified Nov 14, 2026', verifiedOn: '2026-11-14',
  },
  {
    level: 3,
    title: 'Real plants need real growing time',
    fact: 'NASA’s OSD-267 Veggie study records a 33-day growth period for Outredgeous red romaine lettuce grown for the space-station experiment.',
    practiceDifference: 'Our crop rounds are compressed teaching steps. Three or four rounds do not mean a real lunar crop grows that quickly.',
    sourceName: 'NASA Open Science Data Repository · OSD-267',
    url: 'https://osdr.nasa.gov/bio/repo/data/studies/OSD-267',
    badge: 'NASA study reference · verified Nov 14, 2026', verifiedOn: '2026-11-14',
  },
  {
    level: 4,
    title: 'Shielding and shelter help protect crews',
    fact: 'NASA uses space-radiation monitoring and operating procedures to help crews. During a solar particle event, astronauts may be directed to a more heavily shielded area.',
    practiceDifference: 'Practice dose points are made-up teaching units. This game does not estimate a person’s radiation dose or provide a real safety threshold.',
    sourceName: 'NASA Space Radiation Analysis Group',
    url: 'https://srag.jsc.nasa.gov/SpaceRadiation/How/How.cfm',
    badge: 'NASA reference · verified Nov 14, 2026', verifiedOn: '2026-11-14',
    supportingSources: [{ title: 'NASA · Space Radiation Won’t Stop NASA’s Human Exploration', url: 'https://www.nasa.gov/humans-in-space/space-radiation-wont-stop-nasas-human-exploration/' }],
  },
  {
    level: 5,
    title: 'Engineers inspect, test, and improve',
    fact: 'NASA systems engineering uses tests, analysis, inspection, and demonstrations to check that a design meets its requirements and works for its intended use.',
    practiceDifference: 'Our cable test is a small teaching example. A separate cable protects against the tested cable break; it does not make every part failure-proof.',
    sourceName: 'NASA · Systems Engineering Handbook',
    url: 'https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/',
    badge: 'NASA reference · verified Nov 14, 2026', verifiedOn: '2026-11-14',
  },
  {
    level: 6,
    title: 'Recover water instead of counting it twice',
    fact: 'In 2023 NASA reported achieving 98 percent water recovery aboard the U.S. segment of the International Space Station with its improved recovery system.',
    practiceDifference: 'Recovering three of four crew-used water tokens is our practice rule. It is not the real ISS recovery percentage, and it does not create new water.',
    sourceName: 'NASA · Water Recovery Milestone',
    url: 'https://www.nasa.gov/missions/station/iss-research/nasa-achieves-water-recovery-milestone-on-international-space-station/',
    badge: 'NASA reference · verified Nov 14, 2026', verifiedOn: '2026-11-14',
  },
  {
    level: 7,
    title: 'Moon messages take seconds, not ten minutes',
    fact: 'At typical Earth–Moon distance, radio signals take about 1.28 seconds to travel one way. A reply also needs its return journey and any time spent preparing the answer.',
    practiceDifference: 'Our ten-minute support-link delay is deliberately added for this training drill. It is not the real Earth–Moon radio travel time.',
    sourceName: 'NASA NTRS · Communication Limitations',
    url: 'https://ntrs.nasa.gov/api/citations/20240007214/downloads/NDE%20Needs%20to%20Enable%20Deep%20Space%20Exploration.pdf',
    badge: 'NASA reference · verified Nov 14, 2026', verifiedOn: '2026-11-14',
  },
  {
    level: 8,
    title: 'One outpost is a connected system',
    fact: 'NASA systems engineering considers how parts work together and balances performance, cost, time, and risk while checking the whole design.',
    practiceDifference: 'Our tokens, artificial support delay, deadlines, and short crop rounds are practice rules. They are not predictions for a real Moon base.',
    sourceName: 'NASA · Systems Engineering Handbook',
    url: 'https://www.nasa.gov/reference/2-0-fundamentals-of-systems-engineering/',
    badge: 'NASA reference · verified Nov 14, 2026', verifiedOn: '2026-11-14',
    supportingSources: [{ title: 'NASA CCMC · DONKI space-weather database', url: 'https://ccmc.gsfc.nasa.gov/tools/DONKI/' }],
  },
];

export const scienceByLevel: Record<number, ScienceCard> = Object.fromEntries(science.map(card => [card.level, card]));
export const nasaAttribution = 'This is an independent educational project. NASA does not endorse it.';
export const dataAvailability = {
  status: 'reference-only' as const,
  label: 'NASA reference cards',
  explanation: 'Live space-weather and dosimetry feeds could not be retrieved during this build. No current space-weather status or measured radiation number is shown.',
  attemptedOn: '2026-11-14',
  retrievalLog: '/nasa-snapshots/retrieval-status.json',
};
