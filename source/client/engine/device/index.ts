import { cubeVertexArray } from "../../meshes/cube";

const UNIFORM_BUFFER_SIZE = 4 * 16; // 4x4 matrix

export async function getDevice() {
  if(navigator.gpu) {
    const adapter = await navigator.gpu.requestAdapter();
    if(adapter) {
      return adapter.requestDevice();
    } else {
      return console.error("Could not request adapter");
    }
  } else {
    return console.error("WebGPU is not supported");
  }
}

export function getVertexBuffer(device: GPUDevice) {
  const vertexBuffer = device.createBuffer({
    size: cubeVertexArray.byteLength,
    usage: GPUBufferUsage.VERTEX,
    mappedAtCreation: true
  });
  new Float32Array(vertexBuffer.getMappedRange()).set(cubeVertexArray);
  vertexBuffer.unmap();
  return vertexBuffer;
}

export function getUniformBuffer(device: GPUDevice) {
  return device.createBuffer({
    size: UNIFORM_BUFFER_SIZE,
    // eslint-disable-next-line no-bitwise
    usage: GPUBufferUsage.UNIFORM | GPUBufferUsage.COPY_DST | 0
  });
}

export function getSampler(device: GPUDevice) {
  return device.createSampler({
    magFilter: "linear",
    minFilter: "linear"
  });
}

export { createPipeline } from "./pipeline";
