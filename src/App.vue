<script setup lang="ts">
import { randomInt } from "./utils";
import {
  Ball,
  isColliding,
  resolvePenetration,
  resolveCollision,
} from "@/utils/Ball";
import { Vector } from "@/utils/Vector";

const showDebug = ref(false);
const mouseControls = ref(true);

const canvas = ref<HTMLCanvasElement>();
const ctx = computed(() => canvas.value?.getContext("2d"));

const { width, height } = useWindowSize();
const { x, y } = useMouse();
const fps = useFps();

const { w, a, s, d, current } = useMagicKeys();

const player = new Ball({
  position: new Vector(100, 100),
  r: 30,
  color: "lime",
  isPlayer: true,
});

const balls: Ball[] = [];

for (let i = 0; i < 100; i++) {
  const size = randomInt(10, 50);

  balls.push(
    new Ball({
      position: new Vector(
        randomInt(size, width.value - size),
        randomInt(size, height.value - size)
      ),
      r: size,
      color: "red",
      mass: size / 10,
      elasticity: Math.random(),
    })
  );
}

balls.push(player);

function applyInputs(ball: Ball) {
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
  if (mouseControls.value) {
    const mouse = new Vector(x.value, y.value);

    ball.acceleration = mouse.subtract(ball.position).normalize().divide(2);
    ball.velocity = ball.velocity.add(ball.acceleration);
  }
}

useRafFn(() => {
  ctx.value?.clearRect(0, 0, width.value, height.value);

  for (const ball of balls) {
    if (ball.isPlayer) applyInputs(ball);
    ball.draw(ctx.value!);

    if (showDebug.value) {
      ball.drawDebug(ctx.value!);
    }

    for (const otherBall of balls) {
      if (ball == otherBall) continue;

      if (isColliding(ball, otherBall)) {
        resolvePenetration(ball, otherBall);
        resolveCollision(ball, otherBall);
      }
    }

    ball.reposition();

    // gravity
    // ball.velocity.add(new Vector(0, 0.1));
    // ball.position.add(ball.velocity);
  }
});
</script>

<template>
  <div
    class="of-auto max-h-screen absolute right-2 top-2 p-4 rounded-xl bg-stone-700 text-stone-50 shadow"
  >
    <label>
      <input type="checkbox" v-model="showDebug" />
      Show debug
    </label>

    <label>
      <input type="checkbox" v-model="mouseControls" />
      Mouse controls
    </label>

    <p>{{ fps }} fps</p>
    <p>{{ { x, y } }}</p>
    <p>currentKeys: {{ [...current.values()] }}</p>
    <!-- <pre>{{ player }}</pre> -->
  </div>

  <canvas
    class="bg-stone-800"
    ref="canvas"
    :height="height"
    :width="width"
  ></canvas>
</template>
