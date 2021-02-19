import { createEngine } from "./engine";

interface HotModule extends NodeModule {
  hot: any;
}

type HotStatus = "idle" | "check" | "prepare" | "ready" | "dispose" | "apply";

const canvas = Array.from(document.getElementsByTagName("canvas")).find((item) => item.id === "canvas");

if((module as HotModule).hot) {
  (module as HotModule).hot.accept();
  (module as HotModule).hot.addStatusHandler((status: HotStatus) => {
    if(status === "dispose") {
      // TODO
    }
  });
}

if(canvas) {
  createEngine(canvas).then((engine) => {
    if(engine) {
      engine.resize();
      window.addEventListener("resize", () => {
        engine.resize();
      });
      const frame = () => {
        engine.render();
        // window.requestAnimationFrame(frame);
      };
      window.requestAnimationFrame(frame);
    }
  });
}
