
export function resize(canvas: HTMLCanvasElement) {
  canvas.height = window.innerHeight * window.devicePixelRatio;
  canvas.width = window.innerWidth * window.devicePixelRatio;
}

export function getAspectRatio(canvas: HTMLCanvasElement) {
  return Math.abs(canvas.width / canvas.height);
}
