import { Vector } from "@/utils";
import { mapGamepadToXbox360Controller } from "@vueuse/core";

import type { Ball, Wall } from "@/utils/physics-objects";
import type { MaybeComputedRef } from "@vueuse/core";

const { x, y } = useMouse();
const { w, a, s, d, current, arrowLeft, arrowRight } = useMagicKeys();
const { isSupported, gamepads } = useGamepad();
const gamepad = computed(() =>
  gamepads.value.find((g) => g.mapping === "standard")
);
const controller = mapGamepadToXbox360Controller(gamepad);

function applyDeadzone(value: number, threshold: number) {
  if (Math.abs(value) < threshold) return 0;
  return value;
}

export function useBallInputs(
  ball: Ball,
  mouseControls: MaybeComputedRef<Boolean>
) {
  if (w.value) ball.acceleration.y = -ball.speed;
  if (a.value) ball.acceleration.x = -ball.speed;
  if (s.value) ball.acceleration.y = ball.speed;
  if (d.value) ball.acceleration.x = ball.speed;

  if (!w.value && !s.value) ball.acceleration.y = 0;
  if (!a.value && !d.value) ball.acceleration.x = 0;

  // if (controller.value) {
  //   ball.acceleration.set(
  //     applyDeadzone(controller.value.stick.left.horizontal, 0.2) * ball.speed,
  //     applyDeadzone(controller.value.stick.left.vertical, 0.2) * ball.speed
  //   );
  // }

  ball.velocity = ball.velocity.add(ball.acceleration);
  ball.velocity = ball.velocity.multiply(1 - ball.friction);
  ball.position = ball.position.add(ball.velocity);

  // mouse control
  if (unref(mouseControls)) {
    const mouse = new Vector(x.value, y.value);

    ball.acceleration = mouse.subtract(ball.position).normalize().divide(2);
    ball.velocity = ball.velocity.add(ball.acceleration);
  }
}

export function useWallInputs(wall: Wall) {
  if (arrowLeft.value) wall.rotationSpeed -= 0.001;
  if (arrowRight.value) wall.rotationSpeed += 0.001;
}

export function drawInputs(ctx: CanvasRenderingContext2D, position: Vector) {
  if (isSupported.value && controller.value) {
    // draw a circle for the stick
    ctx.beginPath();
    ctx.arc(position.x, position.y, 50, 0, Math.PI * 2);

    ctx.fillStyle = "rgba(0, 0, 0, 0.5)";
    ctx.fill();

    // draw a line for the stick
    ctx.beginPath();
    ctx.moveTo(position.x, position.y);
    ctx.lineTo(
      position.x + controller.value.stick.left.horizontal * 50,
      position.y + controller.value.stick.left.vertical * 50
    );
    ctx.strokeStyle = "white";
    ctx.stroke();
  }
}
