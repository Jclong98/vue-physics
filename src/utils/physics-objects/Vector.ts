export class Vector {
  x: number;
  y: number;

  constructor(x: number, y: number) {
    this.x = x;
    this.y = y;
  }

  set(x: number, y: number) {
    this.x = x;
    this.y = y;
    return this;
  }

  add(vector: Vector) {
    return new Vector(this.x + vector.x, this.y + vector.y);
  }

  subtract(vector: Vector) {
    return new Vector(this.x - vector.x, this.y - vector.y);
  }

  multiply(scalar: number) {
    return new Vector(this.x * scalar, this.y * scalar);
  }

  divide(scalar: number) {
    return new Vector(this.x / scalar, this.y / scalar);
  }

  distance(vector: Vector) {
    return Math.sqrt(
      Math.pow(this.x - vector.x, 2) + Math.pow(this.y - vector.y, 2)
    );
  }

  get magnitude() {
    return Math.sqrt(this.x ** 2 + this.y ** 2);
  }

  get unit(): Vector {
    if (this.magnitude === 0) return this;
    return this.divide(this.magnitude);
  }

  setMagnitude(magnitude: number) {
    const currentMagnitude = this.magnitude;

    if (currentMagnitude === 0) return this;

    return this.multiply(magnitude / currentMagnitude);
  }

  limit(maxMagnitude: number) {
    if (this.magnitude > maxMagnitude) {
      this.setMagnitude(maxMagnitude);
    }
    return this;
  }

  normalize() {
    const currentMagnitude = this.magnitude;
    if (currentMagnitude === 0) return this;
    return this.divide(currentMagnitude);
  }

  dot(vector: Vector) {
    return this.x * vector.x + this.y * vector.y;
  }

  draw(ctx: CanvasRenderingContext2D, to: Vector, color = "white") {
    if (ctx === undefined) return;

    ctx.beginPath();
    ctx.moveTo(this.x, this.y);
    ctx.lineTo(to.x, to.y);
    ctx.strokeStyle = color;
    ctx.stroke();
  }
}
