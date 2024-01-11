export function pointToLineDistance(x, y, x1, y1, x2, y2) {
  const A = x - x1;
  const B = y - y1;
  const C = x2 - x1;
  const D = y2 - y1;
  const dot = A * C + B * D;
  const lenSq = C * C + D * D;
  let param = -1;
  if (lenSq !== 0) { // 线段长度不为零
    param = dot / lenSq;
  }
  let xx, yy;
  if (param < 0) {
    xx = x1;
    yy = y1;
  } else if (param > 1) {
    xx = x2;
    yy = y2;
  } else {
    xx = x1 + param * C;
    yy = y1 + param * D;
  }
  const dx = x - xx;
  const dy = y - yy;
  return Math.sqrt(dx * dx + dy * dy);
}

export function doPolygonsIntersect(polygonA, polygonB) {
  let axes = getAxes(polygonA).concat(getAxes(polygonB));
  for (let i = 0; i < axes.length; i++) {
    let axis = axes[i];
    let projectionA = projectPolygon(axis, polygonA);
    let projectionB = projectPolygon(axis, polygonB);
    if (!doProjectionsOverlap(projectionA, projectionB)) {
      // 找到了分离轴，多边形不相交
      return false;
    }
  }
  // 没有找到分离轴，多边形相交
  return true;
}
function getAxes(polygon) {
  let axes = [];
  for (let i = 0; i < polygon.vertices.length; i++) {
    let p1 = polygon.vertices[i];
    let p2 = polygon.vertices[i + 1 == polygon.vertices.length ? 0 : i + 1];
    let edge = { x: p2.x - p1.x, y: p2.y - p1.y };
    let normal = { x: -edge.y, y: edge.x };
    axes.push(normalize(normal));
  }
  return axes;
}
function projectPolygon(axis, polygon) {
  let min = dot(axis, polygon.vertices[0]);
  let max = min;
  for (let i = 1; i < polygon.vertices.length; i++) {
    let p = dot(axis, polygon.vertices[i]);
    if (p < min) {
      min = p;
    } else if (p > max) {
      max = p;
    }
  }
  return { min: min, max: max };
}
function doProjectionsOverlap(projectionA, projectionB) {
  return !(projectionA.max < projectionB.min || projectionB.max < projectionA.min);
}
function dot(a, b) {
  return a.x * b.x + a.y * b.y;
}
function normalize(vector) {
  let length = Math.sqrt(vector.x * vector.x + vector.y * vector.y);
  return { x: vector.x / length, y: vector.y / length };
}