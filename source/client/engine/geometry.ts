import { mat4 } from "gl-matrix";

function degreesToRadians(degrees: number) {
  return (2*Math.PI) / (360 / degrees);
}

export function getProjectionMatrix(aspectRatio: number, fieldOfView=72) {
  return mat4.perspective(mat4.create(), degreesToRadians(fieldOfView), aspectRatio, 1, 100);
}
