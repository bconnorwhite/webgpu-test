
export function getDepthTextureView(canvas: HTMLCanvasElement, device: GPUDevice) {
  const depthTexture = device.createTexture({
    size: {
      width: canvas.width,
      height: canvas.height,
      depthOrArrayLayers: 1
    },
    format: "depth24plus-stencil8",
    usage: GPUTextureUsage.RENDER_ATTACHMENT
  });
  return depthTexture.createView();
}
