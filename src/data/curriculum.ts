/** Draft teaching copy drawn from the supplied build specification.
 * The exact supplied lesson document/narration may override this copy when ingested.
 * User overrides: original Moonpool guides; every location is on the Moon.
 */
export interface QuizQuestion {
  question: string;
  options: [string, string, string];
  correct: number;
  explanation: string;
}
export interface CurriculumLevel {
  id: number;
  title: string;
  topic: string;
  guide: string;
  world: string;
  accent: string;
  intro: string;
  lessons: [{ title: string; body: string }, { title: string; body: string }, { title: string; body: string }];
  quiz: [QuizQuestion, QuizQuestion, QuizQuestion];
  finalCheck: QuizQuestion;
  certificateTitle: string;
  briefing: string;
  site: 'Moon';
}

export const curriculum: CurriculumLevel[] = [
  {
    id: 1, title: 'Keep Your Habitat Safe', topic: 'Life support', guide: 'Bloop', world: 'bloop', accent: '#d4e95d', site: 'Moon',
    intro: 'Welcome to Bloop’s Bubble Dome! Our Moon habitat gives the crew air, water, and a safe place to live. An air reading needs attention. Read both air meters, find the machine that controls the changing condition, and choose your first repair.',
    lessons: [
      { title: 'Read Both Air Readings', body: 'The oxygen unit supplies oxygen. The scrubber removes carbon dioxide. Those are separate jobs, so always check both readings.' },
      { title: 'Reuse Water Carefully', body: 'Used water goes to a used-water tank. A recycler cleans some of it and returns it to storage. It does not make a second copy of the same water.' },
      { title: 'Choose the Right Repair', body: 'A broken lamp matters, but the pantry already has food for now. Match the urgent reading to the equipment that can change it.' },
    ],
    quiz: [
      { question: 'Carbon dioxide is rising. Which machine controls it?', options: ['Oxygen equipment', 'Carbon dioxide scrubber', 'Water recycler'], correct: 1, explanation: 'A scrubber removes carbon dioxide. Supplying more oxygen does a different job.' },
      { question: 'What does a water recycler do?', options: ['Makes brand-new water', 'Throws all used water away', 'Returns part of the used water to the clean tank'], correct: 2, explanation: 'Recovered water returns to the supply after cleaning. It is the same water moving through the system.' },
      { question: 'The crop lamps are broken, but the pantry is full. What comes first?', options: ['Address the rising carbon dioxide', 'Ignore every warning', 'Assume all food is gone'], correct: 0, explanation: 'Stored food covers the crop delay. The rising air reading is the more urgent problem.' },
    ],
    finalCheck: { question: 'Water is falling, but both air readings are suitable. Should you automatically make more oxygen?', options: ['Yes, every warning needs oxygen', 'No. Check water use, leaks, and recycling', 'Turn every machine off'], correct: 1, explanation: 'Match the changing condition to the system that controls it.' },
    certificateTitle: 'Life Support Cadet',
    briefing: 'Practice values: oxygen is 6 and carbon dioxide is 6. The scrubber is offline. You have one priority action before the next turn. Get the scrubber running and make the carbon dioxide trend improve.',
  },
  {
    id: 2, title: 'Power Your Outpost', topic: 'Energy systems', guide: 'Moss', world: 'moss', accent: '#7be2ca', site: 'Moon',
    intro: 'Moss’s Solar Ridge is entering lunar night. Solar panels cannot generate electricity without sunlight, but a charged battery still holds energy. You will plan two dark turns, protect essentials, and decide which optional work can wait.',
    lessons: [
      { title: 'Generate, Store, Supply', body: 'Solar panels generate electricity in sunlight. A battery stores energy for later. Adding an empty battery gives more storage space, not more stored energy.' },
      { title: 'Count Supply and Demand', body: 'Demand is how much equipment needs. Each extra lamp or rover job uses part of the same limited supply. Preview the whole plan before spending.' },
      { title: 'Plan Beyond This Turn', body: 'Essentials must run on both dark turns. You may light crops on either turn, charge the rover once, or keep a larger reserve. More than one useful plan can succeed.' },
    ],
    quiz: [
      { question: 'Solar output is zero at night. What can still power the outpost?', options: ['Stored battery energy', 'An empty battery', 'A larger battery outline'], correct: 0, explanation: 'A charged battery can supply stored energy when solar generation is unavailable.' },
      { question: 'You switch on an extra lamp. What happens to demand?', options: ['It disappears', 'It goes down', 'It goes up'], correct: 2, explanation: 'The lamp needs electricity, so total demand increases.' },
      { question: 'You add a bigger, empty battery. How much extra energy do you have right now?', options: ['A full battery', 'None until it is charged', 'Unlimited energy'], correct: 1, explanation: 'Storage capacity and stored energy are different things.' },
    ],
    finalCheck: { question: 'Will an empty extra battery immediately solve tonight’s shortage?', options: ['Yes, its size makes energy', 'Yes, night charges it', 'No. Energy must be stored in it first'], correct: 2, explanation: 'A battery can only supply energy that has been stored.' },
    certificateTitle: 'Lunar Energy Planner',
    briefing: 'Practice values: start with 8 energy tokens. Essentials need 2 per turn for two turns. Crop lighting costs 1 per lit turn. Rover charging costs 4 once. Keep both essential turns supplied.',
  },
  {
    id: 3, title: 'Grow Food and Plan Ahead', topic: 'Agriculture and food', guide: 'Nori', world: 'nori', accent: '#b4df67', site: 'Moon',
    intro: 'Nori’s Spiral Greenhouse has a crop already growing. The crew needs meals before that crop is ready. Compare a normal-lighting plan with a dim-lighting plan, then use the pantry and emergency locker to bridge the gap.',
    lessons: [
      { title: 'Plants Need the Right Conditions', body: 'Plants need water, light, nutrients, and time. If a crop has no water, adding more nutrients does not fix the missing water connection.' },
      { title: 'Growing Takes Time', body: 'An existing harvest may help later. Extra seeds planted today cannot fix a meal needed tomorrow. Our rounds shorten the growing time only for practice.' },
      { title: 'Bridge the Food Gap', body: 'Put each meal and harvest on the calendar. Normal and dim lighting produce the same harvest, but at different times. Keep ordinary food and emergency food in separate stores.' },
    ],
    quiz: [
      { question: 'A bed has no water. Will extra fertilizer fix it?', options: ['Yes, nutrients replace water', 'No. It needs water', 'Only if the lights are brighter'], correct: 1, explanation: 'Each plant need has its own job. Nutrients cannot replace water.' },
      { question: 'Will extra seeds planted today fix a shortage tomorrow?', options: ['Always', 'Only if you tap them quickly', 'No. New plants need time to grow'], correct: 2, explanation: 'Use stored food or an already-growing crop to cover a near-term food gap.' },
      { question: 'What is stored food for?', options: ['Bridging the gap between harvests', 'Making plants grow instantly', 'Replacing every future harvest'], correct: 0, explanation: 'Stored food supplies meals while the next crop is growing.' },
    ],
    finalCheck: { question: 'Why might planting seeds fail to fix tomorrow’s food shortage?', options: ['Seeds are never useful', 'Plants need time, so stored food must cover the gap', 'Meals can be skipped without a cost'], correct: 1, explanation: 'The timing of a useful harvest matters as much as its size.' },
    certificateTitle: 'Greenhouse Planner',
    briefing: 'Practice values: 5 ordinary food, 2 emergency food, and 4 meals needing 2 tokens each. Normal lighting brings 4 harvest tokens before meal 3. Dim lighting brings the same harvest before meal 4.',
  },
  {
    id: 4, title: 'Protect Your Crew', topic: 'Space environments and hazards', guide: 'Luma', world: 'luma', accent: '#b49aff', site: 'Moon',
    intro: 'Luma’s Shadow Crater has a prepared shelter and a calm training alert. Bring the crew inside, supply essential equipment, and decide whether a robot should finish the sample job. Shelter reduces further exposure; it does not erase what was already received.',
    lessons: [
      { title: 'Read the Local Conditions', body: 'Moon sunlight changes with the time and location. Check the correct local report. Radiation is shown here as a labeled instrument reading, not a glowing cloud.' },
      { title: 'Rate and Total Are Different', body: 'Exposure rate says how quickly more exposure arrives. Accumulated exposure is the total already received. Going into shelter lowers the rate, while the total stays and may still increase.' },
      { title: 'Protect People, Then Plan Work', body: 'Shielding material does not need electricity to stay in place. Equipment inside the shelter still needs energy. A robot can collect a sample while the crew stay protected, but its trip has a cost.' },
    ],
    quiz: [
      { question: 'Why do solar panels stop generating during lunar night?', options: ['The Sun is below the local horizon', 'The battery gets larger', 'Radiation is a cloud covering the Moon'], correct: 0, explanation: 'Solar panels need sunlight. Radiation is not a weather cloud blocking the Sun.' },
      { question: 'When the crew enter shelter, what lowers?', options: ['All exposure already received', 'The rate of further exposure', 'The cost of every machine'], correct: 1, explanation: 'Shelter reduces further exposure. It does not reset the accumulated total.' },
      { question: 'Does shielding material need electricity to keep working?', options: ['Yes, every wall needs a motor', 'Only while someone looks at it', 'No. The equipment inside still needs energy'], correct: 2, explanation: 'The shielding material and the powered equipment do different jobs.' },
    ],
    finalCheck: { question: 'Should accumulated exposure fall when the crew enter shelter?', options: ['No. Shelter reduces further exposure', 'Yes, it resets to zero', 'Yes, the battery erases it'], correct: 0, explanation: 'Exposure already received remains part of the total.' },
    certificateTitle: 'Crew Protection Specialist',
    briefing: 'Practice values: start with 6 energy. Shelter essentials need 4. A robot sample trip costs 2 once. Protect the crew and supply essentials. Dose points are teaching units, not real radiation measurements.',
  },
  {
    id: 5, title: 'Build a Reliable Outpost', topic: 'Engineering and infrastructure', guide: 'Pip', world: 'pip', accent: '#ff977a', site: 'Moon',
    intro: 'Pip’s Lava Tube Workshop has a leaking seal and two pumps sharing one cable. A second pump is not a useful backup if the same cable break stops both. Inspect, improve, and test your design before adding a new science room.',
    lessons: [
      { title: 'Trace Every Connection', body: 'Follow each pump’s cable back to its supply. A shared connection is a place where one break can affect both machines.' },
      { title: 'Give the Backup Its Own Route', body: 'A useful backup needs a working route to what it depends on. A new cable ending on the same failed branch does not solve that branch failure.' },
      { title: 'Test, Repair, Retest', body: 'A test shows whether a stated requirement is met. Fix the weak part and repeat the test. A successful cable test does not prove that every possible failure is covered.' },
    ],
    quiz: [
      { question: 'Two pumps share a cable. The cable breaks. What can happen?', options: ['Only the newest pump stops', 'The pumps make their own electricity', 'Both pumps may stop'], correct: 2, explanation: 'Both depend on the same broken connection.' },
      { question: 'What does a good backup need?', options: ['A working route to what it depends on', 'Only a different color', 'A cable ending on the same failed branch'], correct: 0, explanation: 'The backup route must avoid the connection being tested.' },
      { question: 'A test fails. What should you do?', options: ['Hide the result', 'Find the weak part, fix it, and test again', 'Build a new room first'], correct: 1, explanation: 'Testing helps you improve the design and check the repair.' },
    ],
    finalCheck: { question: 'Why might two pumps fail at the same time?', options: ['Backups never help', 'They may share a cable, source, pipe, or controller', 'Every pump always stops together'], correct: 1, explanation: 'Look for shared dependencies instead of counting machines alone.' },
    certificateTitle: 'Outpost Systems Engineer',
    briefing: 'Practice values: 6 materials and 3 work shifts. The seal costs 2 materials and 1 shift. A separate backup route costs 4 and 2. The science room also costs 4 and 2. Pass both safety tests within the budget.',
  },
  {
    id: 6, title: 'Make Your Supplies Last', topic: 'Resources and sustainability', guide: 'Skim', world: 'skim', accent: '#83d8ff', site: 'Moon',
    intro: 'Skim’s Salvage Yard tracks every water token. Supply the crew and existing crops, recover eligible used water, and protect the next period’s reserve. Recycling helps, but it spends energy and cannot count the same water twice.',
    lessons: [
      { title: 'Follow the Same Water', body: 'Water moves from the clean tank to use and then to the used-water store. A returned token must leave its old store before it appears in the clean tank.' },
      { title: 'Recovery Has a Cost', body: 'A recycler needs working equipment and energy. Compare the clean water it can return with the energy it spends.' },
      { title: 'Keep Tomorrow’s Reserve', body: 'Water held by crops or a new planter is not available in the clean tank. An optional planter may be useful and still leave too little for next period.' },
    ],
    quiz: [
      { question: 'You recover four water tokens. Are they brand-new water?', options: ['Yes, recycling creates water', 'Only if they change color', 'No. They came from used water'], correct: 2, explanation: 'Recovery returns part of the water already in the system.' },
      { question: 'Can water in a new planter also count in the clean tank?', options: ['No. It cannot be in both places', 'Yes, count it twice', 'Yes, if the planter is optional'], correct: 0, explanation: 'Every token belongs to exactly one store at a time.' },
      { question: 'What does recycling cost?', options: ['Nothing', 'Energy and working equipment', 'A new Moon'], correct: 1, explanation: 'Recovering one resource may require spending another.' },
    ],
    finalCheck: { question: 'Can recovered water count as both used and clean at the same time?', options: ['Yes, recovery doubles it', 'No. It moves between stores', 'Only during a preview'], correct: 1, explanation: 'The total stays conserved. Each token is counted once.' },
    certificateTitle: 'Resource Steward',
    briefing: 'Practice values: 12 clean water and 2 energy. Crew need 4 water; existing crops hold 3. Recycling returns 3 crew-used water for 1 energy, once. Finish with 8 clean water. A new planter would use 2 more.',
  },
  {
    id: 7, title: 'Make a Mission Plan', topic: 'Mission planning', guide: 'Pebble', world: 'pebble', accent: '#e9a0d3', site: 'Moon',
    intro: 'Pebble’s Lookout has stopped airflow and a practice deadline. Use a trained local procedure, then send an accurate report. This drill adds an artificial ten-minute support-link delay each way. Real Earth–Moon radio travel takes about 1.28 seconds one way.',
    lessons: [
      { title: 'Choose the Urgent Job', body: 'The fan protects a current crew need. Rover charging and research photos can be useful without being the first job. Check the local deadline before waiting.' },
      { title: 'Count Both Message Journeys', body: 'A reply needs the outward trip, preparation time, and the return trip. The ten-minute journeys in this exercise are an artificial training delay, not Moon radio travel time.' },
      { title: 'Act, Check, Report', body: 'Starting a backup takes two practice minutes. Choose its power source, advance the clock, check airflow, then report the actual time and action from the log.' },
    ],
    quiz: [
      { question: 'Which job comes first: airflow, rover charging, or research photographs?', options: ['Research photographs', 'Restoring airflow', 'Rover charging'], correct: 1, explanation: 'Airflow has the urgent crew deadline.' },
      { question: 'In this training drill, a message takes ten minutes each way. What is the earliest reply?', options: ['Ten minutes', 'Immediately', 'Twenty minutes'], correct: 2, explanation: 'Count both ten-minute journeys. The drill delay is artificial.' },
      { question: 'What does pausing the research camera cost?', options: ['Research photographs are postponed', 'All stored battery energy vanishes', 'The fan cannot run'], correct: 0, explanation: 'Pausing the camera frees its allocation, but the research work waits.' },
    ],
    finalCheck: { question: 'A practice message takes seven minutes each way, plus two minutes to prepare a reply. When can it return?', options: ['Nine minutes', 'Fourteen minutes', 'Sixteen minutes'], correct: 2, explanation: 'Seven out, two preparing, and seven back make sixteen practice minutes.' },
    certificateTitle: 'Mission Planning Officer',
    briefing: 'Practice values: restore airflow by minute 6. Backup startup takes 2 minutes and 3 energy. Pause the camera to use its allocation, or draw from the 5-token battery. Send an accurate update. Support-link delay is artificially set to 10 minutes each way.',
  },
  {
    id: 8, title: 'Run the Whole Outpost', topic: 'Outpost command', guide: 'Tink', world: 'tink', accent: '#ffc16f', site: 'Moon',
    intro: 'Tink’s Mission Control brings the whole crew together. Protect people, supply essentials, repair the pump, plan meals, and finish useful science. Every choice changes what remains for another system. Explain what your plan protects and what it costs.',
    lessons: [
      { title: 'Protect the Crew First', body: 'Start the shelter transfer early enough to meet the practice deadline. Advance simulated minutes to move the crew, then report what actually happened. Waiting for the artificial support reply cannot replace the local procedure.' },
      { title: 'Separate Once and Every Round', body: 'Pump repair and robot deployment are one-time costs. Essentials and crop lights are charged each crisis round. Keep already-paid costs in the history, not in the next bill.' },
      { title: 'Follow the Consequences', body: 'Keeping both crisis rounds lit brings an earlier harvest. Robot observations use energy that could power lights. Solar supply returns in round 3 as a separate change; it does not refill the battery or make plants grow instantly.' },
    ],
    quiz: [
      { question: 'The robot costs two energy. Is that once or every round?', options: ['Every time you inspect it', 'Once when deployed', 'Every round forever'], correct: 1, explanation: 'Deployment is a one-time cost and must not be charged twice.' },
      { question: 'If the crop lights pause in a crisis round, what changes?', options: ['The harvest arrives later', 'Plants grow instantly', 'The pantry doubles'], correct: 0, explanation: 'A delayed harvest may make emergency food necessary for meal three.' },
      { question: 'Can the crew wait for the artificial support reply before sheltering?', options: ['Yes, the deadline pauses while waiting', 'Yes, science always comes first', 'No. The local shelter deadline comes first'], correct: 2, explanation: 'Use the practiced local procedure while the delayed message travels.' },
    ],
    finalCheck: { question: 'Why can using the robot change your food plan?', options: ['Robots eat every crop', 'Its energy cost can reduce lighting and delay harvest', 'The emergency locker makes unlimited food'], correct: 1, explanation: 'Systems share resources. A later harvest may need emergency food to bridge the gap.' },
    certificateTitle: 'Moonpool Outpost Commander',
    briefing: 'Practice values: Phase A uses minutes—shelter all four crew by minute 5 and send an update. Phase B uses three separate crop rounds: start with 8 energy, 5 ordinary food, 2 emergency food, and 1 spare pump. Supply essentials, repair by round 2, keep 1 energy after round 2, feed everyone, and collect the sample by round 3.',
  },
];

export const curriculumById: Record<number, CurriculumLevel> = Object.fromEntries(curriculum.map(level => [level.id, level]));
export const practiceNotice = 'Practice values: tokens, deadlines, artificial support delays, and short crop rounds are teaching rules, not NASA measurements.';
