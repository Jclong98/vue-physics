import { rotateMatrix } from "@/utils";
import type { Vector } from "@/utils";
import { useWallInputs } from "@/composables/useInputs";

interface WallProps {
  startPosition: Vector;
  endPosition: Vector;

  rotationSpeed?: number;

  color?: string;
}

export class Wall {
  startPosition: Vector;
  endPosition: Vector;

  center: Vector;
  length: number;

  initialStart: Vector;
  initialEnd: Vector;
  initialUnit: Vector;

  angle: number;
  rotationSpeed: number;

  color: string;

  constructor({
    startPosition,
    endPosition,
    rotationSpeed = 0,
    color = "white",
  }: WallProps) {
    this.startPosition = startPosition;
    this.endPosition = endPosition;

    this.center = this.startPosition.add(this.endPosition).divide(2);
    this.length = this.startPosition.distance(this.endPosition);

    this.initialStart = startPosition;
    this.initialEnd = endPosition;
    this.initialUnit = this.unit;

    this.angle = 0;
    this.rotationSpeed = rotationSpeed;

    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (ctx === undefined) return;

    const rotationMatrix = rotateMatrix(this.angle);
    const newDirection = rotationMatrix.multiplyVector(this.initialUnit);

    this.startPosition = this.center.add(
      newDirection.multiply(-this.length / 2)
    );
    this.endPosition = this.center.add(newDirection.multiply(this.length / 2));

    ctx.beginPath();
    ctx.moveTo(this.startPosition.x, this.startPosition.y);
    ctx.lineTo(this.endPosition.x, this.endPosition.y);
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  get unit() {
    return this.endPosition.subtract(this.startPosition).unit;
  }

  applyInput() {
    useWallInputs(this);
  }

  reposition() {
    this.angle += this.rotationSpeed;
    this.rotationSpeed *= 0.99;
  }
}
