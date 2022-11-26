import type { Vector } from "./Vector";

export class Wall {
  startPosition: Vector;
  endPosition: Vector;
  color: string;

  constructor(startPosition: Vector, endPosition: Vector, color = "white") {
    this.startPosition = startPosition;
    this.endPosition = endPosition;
    this.color = color;
  }

  draw(ctx: CanvasRenderingContext2D) {
    if (ctx === undefined) return;

    ctx.beginPath();
    ctx.moveTo(this.startPosition.x, this.startPosition.y);
    ctx.lineTo(this.endPosition.x, this.endPosition.y);
    ctx.strokeStyle = this.color;
    ctx.stroke();
  }

  get unit() {
    return this.endPosition.subtract(this.startPosition).unit;
  }
}
