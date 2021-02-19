export const SWAPCHAIN_FORMAT = "bgra8unorm";

export function getSwapChain(canvas: HTMLCanvasElement, device: GPUDevice) {
  const context = canvas.getContext("gpupresent");
  if(context) {
    return context.configureSwapChain({
      device,
      format: SWAPCHAIN_FORMAT
    });
  } else {
    return console.error("Could not get context");
  }
}
