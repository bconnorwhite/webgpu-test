import { SWAPCHAIN_FORMAT } from "./swap-chain";

export async function getTexture(device: GPUDevice, path: string) {
  const img = document.createElement("img");
  img.src = path;
  await img.decode();
  const imageBitmap = await window.createImageBitmap(img);
  const size = [
    imageBitmap.width,
    imageBitmap.height,
    1
  ];
  const texture = device.createTexture({
    size,
    format: SWAPCHAIN_FORMAT,
    // eslint-disable-next-line no-bitwise
    usage: GPUTextureUsage.SAMPLED | GPUTextureUsage.COPY_DST
  });
  device.queue.copyImageBitmapToTexture({
    imageBitmap
  }, {
    texture
  }, size);
  return texture;
}
