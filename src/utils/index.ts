import { Ball, Wall } from "./physics-objects";

export * from "./physics-objects";
export * from "./Vector";
export * from "./Matrix";

export function randomInt(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function isColliding(obj1: Ball, obj2: Ball | Wall) {
  if (obj2 instanceof Ball) {
    return obj1.position.distance(obj2.position) < obj1.radius + obj2.radius;
  }

  const closestPoint = findClosestPoint(obj1, obj2);
  return obj1.position.distance(closestPoint) <= obj1.radius;
}

export function resolvePenetration(obj1: Ball, obj2: Ball | Wall) {
  if (obj2 instanceof Ball) {
    const distanceVector = obj1.position.subtract(obj2.position);
    const penetrationDepth =
      obj1.radius + obj2.radius - distanceVector.magnitude;
    const penetrationResolution = distanceVector
      .setMagnitude(1)
      .multiply(penetrationDepth / (obj1.inverseMass + obj2.inverseMass));

    obj1.position = obj1.position.add(
      penetrationResolution.multiply(obj1.inverseMass)
    );
    obj2.position = obj2.position.subtract(
      penetrationResolution.multiply(obj2.inverseMass)
    );
  }

  if (obj2 instanceof Wall) {
    const penetrationVector = obj1.position.subtract(
      findClosestPoint(obj1, obj2)
    );
    obj1.position = obj1.position.add(
      penetrationVector.unit.multiply(obj1.radius - penetrationVector.magnitude)
    );
  }
}

export function resolveCollision(obj1: Ball, obj2: Ball | Wall) {
  if (obj2 instanceof Ball) {
    const normal = obj1.position.subtract(obj2.position).setMagnitude(1);
    const relativeVelocity = obj1.velocity.subtract(obj2.velocity);
    const separationVelocity = relativeVelocity.dot(normal);
    const newSeparationVelocity =
      -separationVelocity * Math.min(obj1.elasticity, obj2.elasticity);

    const deltaVelocity = newSeparationVelocity - separationVelocity;
    const totalInverseMass = obj1.inverseMass + obj2.inverseMass;

    if (totalInverseMass <= 0) return;

    const impulse = deltaVelocity / totalInverseMass;
    const impulseVector = normal.multiply(impulse);

    obj1.velocity = obj1.velocity.add(impulseVector.multiply(obj1.inverseMass));
    obj2.velocity = obj2.velocity.add(
      impulseVector.multiply(-obj2.inverseMass)
    );
  }

  if (obj2 instanceof Wall) {
    const normal = obj1.position.subtract(findClosestPoint(obj1, obj2)).unit;
    const separationVelocity = obj1.velocity.dot(normal);
    const newSeparationVelocity = -separationVelocity * obj1.elasticity;
    const vSeperationDifference = separationVelocity - newSeparationVelocity;
    obj1.velocity = obj1.velocity.add(normal.multiply(-vSeperationDifference));
  }
}

export function findClosestPoint(b: Ball, w: Wall) {
  const ballToWallStart = w.startPosition.subtract(b.position);
  if (w.unit.dot(ballToWallStart) > 0) return w.startPosition;

  const wallEndToBall = b.position.subtract(w.endPosition);
  if (w.unit.dot(wallEndToBall) > 0) return w.endPosition;

  const closestDistance = w.unit.dot(ballToWallStart);
  const closestVector = w.unit.multiply(closestDistance);
  return w.startPosition.subtract(closestVector);
}
