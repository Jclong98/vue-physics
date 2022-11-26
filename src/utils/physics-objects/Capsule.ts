import { useCapsuleInputs } from "@/composables/useInputs";
import { Vector, rotateMatrix } from "@/utils";

interface CapsuleProps {
  startPosition: Vector;
  endPosition: Vector;
  r: number;
  color?: string;
}

export class Capsule {
  startPosition: Vector;
  endPosition: Vector;
  r: number;
  position: Vector;
  length: number;
  direction: Vector;

  speed = 0.1;
  rotationSpeed = 0;
  acceleration: Vector = new Vector(0, 0);
  velocity: Vector = new Vector(0, 0);
  friction: number = 0.05;

  initialDirection: Vector;
  initialAngle: number;
  angle: number = 0;

  color: string;

  constructor({
    startPosition,
    endPosition,
    r,
    color = "royalblue",
  }: CapsuleProps) {
    this.startPosition = startPosition;
    this.endPosition = endPosition;

    this.position = startPosition.add(endPosition).divide(2);
    this.length = startPosition.distance(endPosition);
    this.direction = startPosition.subtract(endPosition).unit;

    this.r = r;
    this.color = color;

    this.initialDirection = this.endPosition.subtract(this.startPosition).unit;
    this.initialAngle = Math.acos(this.initialDirection.dot(new Vector(1, 0)));
    if (this.initialDirection.cross(new Vector(1, 0)) > 0) {
      this.initialAngle = -this.initialAngle;
    }
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (ctx === undefined) return;

    ctx.beginPath();

    ctx.arc(
      this.startPosition.x,
      this.startPosition.y,
      this.r,
      this.initialAngle + this.angle + Math.PI / 2,
      this.initialAngle + this.angle + (3 * Math.PI) / 2
    );
    ctx.arc(
      this.endPosition.x,
      this.endPosition.y,
      this.r,
      this.initialAngle + this.angle - Math.PI / 2,
      this.initialAngle + this.angle + Math.PI / 2
    );
    ctx.closePath();
    ctx.strokeStyle = this.color;
    ctx.stroke();

    // draw a dot at the center position
    ctx.beginPath();
    ctx.arc(this.position.x, this.position.y, 2, 0, 2 * Math.PI);
    ctx.fillStyle = this.color;
    ctx.fill();
  }

  reposition() {
    this.acceleration = this.acceleration.unit.multiply(this.speed);
    this.velocity = this.velocity.add(this.acceleration);
    this.velocity = this.velocity.multiply(1 - this.friction);
    this.position = this.position.add(this.velocity);

    this.angle += this.rotationSpeed;
    this.rotationSpeed *= 1 - this.friction;

    const rotationMatrix = rotateMatrix(this.angle);

    this.direction = rotationMatrix.multiplyVector(this.initialDirection);

    this.startPosition = this.position.add(
      this.direction.multiply(-this.length / 2)
    );
    this.endPosition = this.position.add(
      this.direction.multiply(this.length / 2)
    );
  }

  applyInput() {
    useCapsuleInputs(this);
  }
}
