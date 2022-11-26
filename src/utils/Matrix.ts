import { Vector } from "@/utils";

export class Matrix {
  rows: number;
  columns: number;
  data: number[][] = [];

  constructor(rows: number, columns: number) {
    this.rows = rows;
    this.columns = columns;

    this.generateMatrix();
  }

  generateMatrix() {
    for (let i = 0; i < this.rows; i++) {
      this.data[i] = [];
      for (let j = 0; j < this.columns; j++) {
        this.data[i][j] = 0;
      }
    }
  }

  multiplyVector(vector: Vector) {
    const result = new Vector(0, 0);

    result.set(
      this.data[0][0] * vector.x + this.data[0][1] * vector.y,
      this.data[1][0] * vector.x + this.data[1][1] * vector.y
    );

    return result;
  }
}

export function rotateMatrix(angle: number) {
  const matrix = new Matrix(2, 2);

  matrix.data[0][0] = Math.cos(angle);
  matrix.data[0][1] = -Math.sin(angle);
  matrix.data[1][0] = Math.sin(angle);
  matrix.data[1][1] = Math.cos(angle);

  return matrix;
}
