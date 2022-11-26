<script setup lang="ts">
import {
  Ball,
  Capsule,
  isColliding,
  randomInt,
  resolvePenetration,
  resolveCollision,
  Vector,
  Wall,
} from "@/utils";
import { drawInputs } from "@/composables/useInputs";

const mouseControls = ref(false);

const canvas = ref<HTMLCanvasElement>();
const ctx = computed(() => canvas.value?.getContext("2d"));

const { width, height } = useWindowSize();
const { x, y } = useMouse();
const { current } = useMagicKeys();
const fps = useFps();

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

const wall = new Wall({
  startPosition: new Vector(600, 600),
  endPosition: new Vector(700, 800),
  color: "white",
});

// walls that line the canvas
const walls = computed<Wall[]>(() => [
  new Wall({
    startPosition: new Vector(0, 0),
    endPosition: new Vector(width.value, 0),
    color: "white",
  }),
  new Wall({
    startPosition: new Vector(width.value, 0),
    endPosition: new Vector(width.value, height.value),
    color: "white",
  }),
  new Wall({
    startPosition: new Vector(width.value, height.value),
    endPosition: new Vector(0, height.value),
    color: "white",
  }),
  new Wall({
    startPosition: new Vector(0, height.value),
    endPosition: new Vector(0, 0),
    color: "white",
  }),
  wall,
]);

const capsule = new Capsule({
  startPosition: new Vector(100, 100),
  endPosition: new Vector(200, 200),
  r: 30,
});

const capsules = computed<Capsule[]>(() => [capsule]);

// main loop
useRafFn(() => {
  if (!ctx.value) return;

  // clear canvas
  ctx.value.clearRect(0, 0, width.value, height.value);

  // update walls
  for (const wall of walls.value) {
    for (const ball of balls) {
      if (isColliding(ball, wall)) {
        resolvePenetration(ball, wall);
        resolveCollision(ball, wall);
      }
    }

    wall.reposition();
    wall.draw(ctx.value);
  }

  wall.applyInput();

  // update balls
  for (const ball of balls) {
    for (const otherBall of balls) {
      if (ball == otherBall) continue;

      if (isColliding(ball, otherBall)) {
        resolvePenetration(ball, otherBall);
        resolveCollision(ball, otherBall);
      }
    }

    ball.reposition();
    ball.draw(ctx.value!);
  }

  // update capsules
  for (const capsule of capsules.value) {
    capsule.reposition();
    capsule.draw(ctx.value);
  }

  capsule.applyInput();

  drawInputs(ctx.value, new Vector(100, 100));
});
</script>

<template>
  <div
    class="of-auto max-h-screen absolute right-2 top-2 p-4 rounded-xl bg-stone-700 text-stone-50 shadow"
  >
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
