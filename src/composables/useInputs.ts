import { Vector } from "@/utils/physics-objects";
import type { Ball } from "@/utils/physics-objects";
import type { MaybeComputedRef } from "@vueuse/core";

const { x, y } = useMouse();
const { w, a, s, d, current } = useMagicKeys();

export function useInputs(
  ball: Ball,
  mouseControls: MaybeComputedRef<Boolean>
) {
  if (w.value) ball.acceleration.y = -ball.speed;
  if (a.value) ball.acceleration.x = -ball.speed;
  if (s.value) ball.acceleration.y = ball.speed;
  if (d.value) ball.acceleration.x = ball.speed;

  if (!w.value && !s.value) ball.acceleration.y = 0;
  if (!a.value && !d.value) ball.acceleration.x = 0;

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
