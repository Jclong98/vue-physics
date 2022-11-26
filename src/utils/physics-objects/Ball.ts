import { Vector } from "./Vector";

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
    if (ctx) ctx.strokeStyle = this.color;
    // ctx.fill();
    ctx.stroke();
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

    // gravity
    this.velocity = this.velocity.add(new Vector(0, 0.01));
    this.position = this.position.add(this.velocity);
  }
}
