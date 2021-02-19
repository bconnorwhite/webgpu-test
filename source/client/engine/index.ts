/* eslint-disable max-lines */
import { mat4, vec3 } from "gl-matrix";
import { resize, getAspectRatio } from "./canvas";
import {
  getDevice,
  getSampler,
  getUniformBuffer,
  createPipeline,
  getVertexBuffer
} from "./device";
import { getSwapChain } from "./swap-chain";
import { getProjectionMatrix } from "./geometry";
import { getDepthTextureView } from "./depth-texture";
import { getTexture } from "./texture";

type Engine = {
  resize: () => void;
  render: () => void;
}

function getTransformationMatrix(canvas: HTMLCanvasElement) {
  const aspectRatio = getAspectRatio(canvas);
  const projectionMatrix = getProjectionMatrix(aspectRatio);
  const viewMatrix = mat4.create();
  mat4.translate(viewMatrix, viewMatrix, vec3.fromValues(0, 0, -5));
  const now = Date.now() / 1000;
  mat4.rotate(
    viewMatrix,
    viewMatrix,
    1,
    vec3.fromValues(Math.sin(now), Math.cos(now), 0)
  );

  const modelViewProjectionMatrix = mat4.create();
  mat4.multiply(modelViewProjectionMatrix, projectionMatrix, viewMatrix);

  return modelViewProjectionMatrix as Float32Array;
}

export async function createEngine(canvas: HTMLCanvasElement): Promise<Engine | void> {
  const device = await getDevice();
  if(device) {
    const swapChain = getSwapChain(canvas, device);
    if(swapChain) {
      const vertexBuffer = getVertexBuffer(device);
      const pipeline = createPipeline(device);
      const depthTextureView = getDepthTextureView(canvas, device);
      const uniformBuffer = getUniformBuffer(device);
      const cubeTexture = await getTexture(device, "/assets/grass-block.png");
      const uniformBindGroup = device.createBindGroup({
        layout: pipeline.getBindGroupLayout(0),
        entries: [{
          binding: 0,
          resource: {
            buffer: uniformBuffer
          }
        }, {
          binding: 1,
          resource: getSampler(device)
        }, {
          binding: 2,
          resource: cubeTexture.createView()
        }]
      });

      const render = () => {
        const transformationMatrix = getTransformationMatrix(canvas);
        console.log(transformationMatrix);
        device.queue.writeBuffer(
          uniformBuffer,
          0,
          transformationMatrix.buffer,
          transformationMatrix.byteOffset,
          transformationMatrix.byteLength
        );
        const commandEncoder = device.createCommandEncoder();
        const passEncoder = commandEncoder.beginRenderPass({
          colorAttachments: [{
            attachment: swapChain.getCurrentTexture().createView(),
            loadValue: {
              r: 0.5,
              g: 0.5,
              b: 0.5,
              a: 1.0
            }
          }],
          depthStencilAttachment: {
            attachment: depthTextureView,
            depthLoadValue: 1.0,
            depthStoreOp: "store",
            stencilLoadValue: 0,
            stencilStoreOp: "store"
          }
        });
        passEncoder.setPipeline(pipeline);
        passEncoder.setBindGroup(0, uniformBindGroup);
        passEncoder.setVertexBuffer(0, vertexBuffer);
        passEncoder.draw(36, 1, 0, 0);
        passEncoder.endPass();

        device.queue.submit([commandEncoder.finish()]);
      };
      return {
        resize: () => {
          resize(canvas);
        },
        render
      }
    } else {
      return console.error("Could not get swapchain");
    }
  } else {
    return console.error("Could not create device");
  }
}
