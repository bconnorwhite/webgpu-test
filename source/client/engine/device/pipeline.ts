import { cubeVertexSize, cubePositionOffset, cubeUVOffset } from "../../meshes/cube";
import { SWAPCHAIN_FORMAT } from "../swap-chain";

const entryPoint = "main";

const vertex = `
[[block]] struct Uniforms {
  [[offset(0)]] modelViewProjectionMatrix : mat4x4<f32>;
};
[[binding(0), group(0)]] var<uniform> uniforms : Uniforms;

[[location(0)]] var<in> position : vec4<f32>;
[[location(1)]] var<in> uv : vec2<f32>;

[[builtin(position)]] var<out> Position : vec4<f32>;
[[location(0)]] var<out> fragUV : vec2<f32>;

[[stage(vertex)]]
fn main() -> void {
  Position = uniforms.modelViewProjectionMatrix * position;
  fragUV = uv;
  return;
}
`;

const fragment = `
[[binding(1), group(0)]] var mySampler: sampler;
[[binding(2), group(0)]] var myTexture: texture_2d<f32>;
[[location(0)]] var<in> fragUV: vec2<f32>;
[[location(0)]] var<out> outColor : vec4<f32>;
[[stage(fragment)]]
fn ${entryPoint}() -> void {
  outColor =  textureSample(myTexture, mySampler, fragUV);
  return;
}
`;

function getBindGroupLayout(device: GPUDevice) {
  return device.createBindGroupLayout({
    entries: [{
      binding: 0,
      visibility: GPUShaderStage.VERTEX,
      type: "uniform-buffer"
    }, {
      binding: 1,
      visibility: GPUShaderStage.FRAGMENT,
      type: "sampler"
    }, {
      binding: 2,
      visibility: GPUShaderStage.FRAGMENT,
      type: "sampled-texture"
    }]
  })
}

function getPipelineLayout(device: GPUDevice) {
  const bindGroupLayout = getBindGroupLayout(device);
  return device.createPipelineLayout({
    bindGroupLayouts: [bindGroupLayout]
  });
}

export function createPipeline(device: GPUDevice) {
  return device.createRenderPipeline({
    layout: getPipelineLayout(device),
    vertexStage: {
      module: device.createShaderModule({
        code: vertex
      }),
      entryPoint
    },
    fragmentStage: {
      module: device.createShaderModule({
        code: fragment
      }),
      entryPoint
    },
    primitiveTopology: "triangle-list",
    depthStencilState: {
      depthWriteEnabled: true,
      depthCompare: "less",
      format: "depth24plus-stencil8"
    },
    vertexState: {
      vertexBuffers: [{
        arrayStride: cubeVertexSize,
        attributes: [{ // position
          shaderLocation: 0,
          offset: cubePositionOffset,
          format: "float4"
        }, { // color
          shaderLocation: 1,
          offset: cubeUVOffset,
          format: "float2"
        }]
      }]
    },
    rasterizationState: {
      cullMode: "back"
    },
    colorStates: [{
      format: SWAPCHAIN_FORMAT
    }]
  });
}
