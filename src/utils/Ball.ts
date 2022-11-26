import { Vector } from "@/utils/Vector";

interface BallProps {
  position: Vector;
  r: number;
  mass?: number;
  color?: string;
  isPlayer?: boolean;
  speed?: number;
  velocity?: Vector;
  friction?: number;
  elasticity?: number;
}

export class Ball {
  position: Vector;
  radius: number;
  mass: number;
  color: string;
  isPlayer: boolean;
  speed: number;
  velocity: Vector;
  acceleration: Vector = new Vector(0, 0);
  friction: number;
  elasticity: number;

  constructor({
    position,
    r,
    mass = 1,
    color = "red",
    isPlayer = false,
    velocity = new Vector(0, 0),
    speed = 0.05,
    friction = 0.01,
    elasticity = 1,
  }: BallProps) {
    this.position = position;

    this.radius = Math.max(r, 10);
    this.mass = mass;
    this.color = color;
    this.isPlayer = isPlayer;
    this.velocity = velocity;
    this.speed = speed;
    this.friction = friction;
    this.elasticity = elasticity;
  }

  get inverseMass() {
    if (this.mass === 0) return 0;
    return 1 / this.mass;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (ctx === undefined) return;

    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, this.radius, 0, Math.PI * 2);
    if (ctx) ctx.fillStyle = this.color;
    ctx.fill();
    ctx.closePath();
  }

  drawDebug(ctx: CanvasRenderingContext2D) {
    if (ctx === undefined) return;

    // draw coordinates for debugging
    ctx.fillStyle = "white";
    ctx.fillText(
      `x: ${this.position.x.toFixed(2)}, y: ${this.position.y.toFixed(2)}`,
      this.position.x - this.radius,
      this.position.y - this.radius - 5
    );

    // draw the acceleration for debugging
    this.drawVector(ctx, this.acceleration, 500, "white");

    // draw the velocity for debugging
    this.drawVector(ctx, this.velocity, 10, "blue");

    // draw the mass for debugging
    ctx.fillStyle = "white";
    ctx.fillText(
      `mass: ${this.mass.toFixed(2)}`,
      this.position.x - this.radius,
      this.position.y - this.radius - 20
    );

    // draw the elasticity for debugging
    ctx.fillStyle = "white";
    ctx.fillText(
      `elasticity: ${this.elasticity.toFixed(2)}`,
      this.position.x - this.radius,
      this.position.y - this.radius - 35
    );
  }

  drawVector(
    ctx: CanvasRenderingContext2D,
    vector: Vector,
    length: number,
    color: string = "white"
  ) {
    if (ctx === undefined) return;

    ctx.beginPath();
    ctx.moveTo(this.position.x, this.position.y);
    ctx.lineTo(
      this.position.x + vector.x * length,
      this.position.y + vector.y * length
    );
    ctx.strokeStyle = color;
    ctx.stroke();
  }

  reposition() {
    this.acceleration = this.acceleration.setMagnitude(1).multiply(this.speed);
    this.velocity = this.velocity.add(this.acceleration);
    this.velocity = this.velocity.multiply(1 - this.friction);
    this.position = this.position.add(this.velocity);
  }
}

export function isColliding(b1: Ball, b2: Ball) {
  return b1.position.distance(b2.position) < b1.radius + b2.radius;
}

export function resolvePenetration(b1: Ball, b2: Ball) {
  const distanceVector = b1.position.subtract(b2.position);
  const penetrationDepth = b1.radius + b2.radius - distanceVector.magnitude;
  const penetrationResolution = distanceVector
    .setMagnitude(1)
    .multiply(penetrationDepth / (b1.inverseMass + b2.inverseMass));

  b1.position = b1.position.add(penetrationResolution.multiply(b1.inverseMass));
  b2.position = b2.position.subtract(
    penetrationResolution.multiply(b2.inverseMass)
  );
}

export function resolveCollision(b1: Ball, b2: Ball) {
  const normal = b1.position.subtract(b2.position).setMagnitude(1);
  const relativeVelocity = b1.velocity.subtract(b2.velocity);
  const separationVelocity = relativeVelocity.dot(normal);
  const newSeparationVelocity =
    -separationVelocity * Math.min(b1.elasticity, b2.elasticity);

  const deltaVelocity = newSeparationVelocity - separationVelocity;
  const totalInverseMass = b1.inverseMass + b2.inverseMass;

  if (totalInverseMass <= 0) return;

  const impulse = deltaVelocity / totalInverseMass;
  const impulseVector = normal.multiply(impulse);

  b1.velocity = b1.velocity.add(impulseVector.multiply(b1.inverseMass));
  b2.velocity = b2.velocity.add(impulseVector.multiply(-b2.inverseMass));
}
