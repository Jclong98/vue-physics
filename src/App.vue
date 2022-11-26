<script setup lang="ts">
import {
  randomInt,
  isColliding,
  resolvePenetration,
  resolveCollision,
  findClosestPoint,
} from "@/utils";
import { Ball, Wall, Vector } from "@/utils/physics-objects";
import { useInputs } from "@/composables/useInputs";

const showDebug = ref(false);
const mouseControls = ref(false);

const canvas = ref<HTMLCanvasElement>();
const ctx = computed(() => canvas.value?.getContext("2d"));

const { width, height } = useWindowSize();
const { x, y } = useMouse();
const fps = useFps();

const { current } = useMagicKeys();

const player = new Ball({
  position: new Vector(299, 100),
  r: 30,
  color: "lime",
  isPlayer: true,
  elasticity: 0.5,
});

const balls: Ball[] = [player];

for (let i = 0; i < 50; i++) {
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

// walls that line the canvas
const walls = computed<Wall[]>(() => [
  new Wall(new Vector(0, 0), new Vector(width.value, 0), "white"),
  new Wall(
    new Vector(width.value, 0),
    new Vector(width.value, height.value),
    "white"
  ),
  new Wall(
    new Vector(width.value, height.value),
    new Vector(0, height.value),
    "white"
  ),
  new Wall(new Vector(0, height.value), new Vector(0, 0), "white"),
]);

// main loop
useRafFn(() => {
  ctx.value?.clearRect(0, 0, width.value, height.value);

  for (const wall of walls.value) {
    wall.draw(ctx.value!);

    for (const ball of balls) {
      if (isColliding(ball, wall)) {
        resolvePenetration(ball, wall);
        resolveCollision(ball, wall);
      }
    }
  }

  for (const ball of balls) {
    if (ball.isPlayer) useInputs(ball, mouseControls);

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
