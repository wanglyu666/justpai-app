/** 跨端下一帧等待：App WebView 偶发无 rAF 时回退到 setTimeout */

type FrameCallback = (time: number) => void;

const scheduleFrame = (cb: FrameCallback) => {
  if (typeof requestAnimationFrame === 'function') {
    return requestAnimationFrame(cb);
  }
  return setTimeout(() => cb(Date.now()), 16) as unknown as number;
};

export const waitFrames = (count = 1) =>
  new Promise<void>((resolve) => {
    let left = Math.max(1, count);
    const tick = () => {
      left -= 1;
      if (left <= 0) {
        resolve();
        return;
      }
      scheduleFrame(tick);
    };
    scheduleFrame(tick);
  });
