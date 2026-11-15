/** Input contract shared by the standalone game and a future optional physical console.
 * No hardware connection or device permissions are required for digital play.
 */
export type MovementDirection =
  "forward" | "back" | "left" | "right" | "turnLeft" | "turnRight";
export type PanelCommand =
  | { type: "move"; direction: MovementDirection; pressed: boolean }
  | { type: "interact" }
  | { type: "look"; yaw: number; pitch?: number }
  | { type: "dial"; dial: "system" | "grow" | "shield"; value: number }
  | { type: "release" };
export function sendPanelCommand(command: PanelCommand) {
  window.dispatchEvent(
    new CustomEvent("moonpool:panel-input", { detail: command }),
  );
}
