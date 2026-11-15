# Moonpool: The Lunar Night Adventure

A first-person educational space-station adventure with eight original Aquanaut guides, one continuous story, free movement, carried objects, and a standalone digital control console.

## Play and controls

Enter the Moon base from the welcome page. You start inside the arrival corridor, with eight connected crew rooms to explore.

- WASD or arrow keys: walk forwards, backwards, and sideways.
- Hold the bottom console’s direction buttons for the same movement. Keyboard activation of a direction button makes a small step.
- Drag the 3D view to look. The console’s turn buttons and J/L turn left/right.
- E or the console action button: talk, inspect, pick up, carry, install, deliver, repair, test, or use an object within reach.
- The three on-screen dials operate equipment when you are facing the relevant controls. No physical device is needed.
- M opens the station map; Escape closes it or pauses. There is no automatic camera tour or station-selection movement.

The gold marker identifies the next story object. Other rooms remain accessible while the story is in progress. Your hand-drawn crewmate appears in their room and in the bottom-left dialogue overlay.

## Story

Prepare Moonpool for lunar night: repair Bloop’s air scrubber, plan essential power with Moss, water and harvest Nori’s crops, carry food to Luma’s shelter, fix Pip’s seal and backup connection, trace Skim’s water supplies, restore Pebble’s fan before its practice deadline, then complete Tank’s integrated rehearsal. The physical actions advance the existing mission simulation. Walking and reading do not spend mission resources or advance mission time.

Characters, music, and the original eight world GLBs are retained. The new traversable interior is built for human-scale movement and collision; the original world models remain available as overview environments in the handbook. Guides are hand-drawn billboards, not rigged 3D characters. The in-world material keys out the original screenshot’s white background at rendering time; the source PNG is unchanged.

## Development

Requires Node.js 22+ and npm.

```sh
npm ci
npm run dev
npm test
npm run build
```

`dist/` is the deployable static website. Relative asset URLs support a domain root or a subdirectory. Give your hosting provider the `dist` contents, or configure a Git-based host with install `npm ci`, build `npm run build`, output `dist`. No server, API keys, database, or physical device are required. Deployment to the user's website is pending hosting access; creating a public GitHub repository does not itself deploy a website.

## GitHub

The public repository is https://github.com/colton3733-web/moonpool-mission-trainer. Source, package-lock.json, supplied assets, tests, and model credits are included. Generated builds, dependencies, work files, caches, credentials, and private-preview hosting metadata are excluded. The GitHub Actions verification workflow tests and builds the static website; it does not deploy to your host.

## Save data

Adventure tasks, inventory, dial settings, and position are stored under `moonpool-adventure-v2` in browser localStorage. The game saves when tasks change, periodically while moving, and when leaving. Pause offers a confirmed new-story reset. Existing lesson badges use their separate progress save and are retained on a story reset. Saves are browser-local; no cloud accounts or analytics are implemented.

## Optional physical accessory

`src/panel.ts` defines `moonpool:panel-input` commands for movement press/release, look, interact, dials, and release-all. The game consumes them through the same movement and interaction rules. A future board-specific adapter must translate physical inputs to that contract. No firmware, Bluetooth, serial connection, or device permissions are configured yet. The digital console is fully standalone.

## Validation

51 automated tests pass. They cover mission outcomes and resource accounting, the complete eight-chapter physical task chain, inventory consumption, save restoration, collision, wall sliding, line-of-sight interaction, and reachable approaches to all 56 story/world targets. The production build includes TypeScript checks. Browser checks cover the connected interior, player-controlled movement into a room, NPC dialogue, and physical interactions; final all-eight-chapter and assistive-technology playthroughs remain required before calling this a finished release.

Narration uses an optional browser preview voice. NASA cards are reference material, not live telemetry. Mission values and time steps are simplified teaching scenarios.

## Asset rights

Free equipment models are from Kenney’s Space Kit under CC0. See `public/models/ASSET_CREDITS.md` and the included original license. Original character art, supplied music, original worlds, and application code are not automatically relicensed by the CC0 notice or by public repository visibility. No open-source license for those original materials has been selected.
