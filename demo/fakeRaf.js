let original;

let requesters = [];

function fakeRaf(fn) {
  requesters.push(fn);
  return requesters.length - 1;
}

export function use() {
  original = window.requestAnimationFrame;
  window.requestAnimationFrame = fakeRaf;
}

export function restore() {
  window.requestAnimationFrame = original;
}

export function step() {
  const cur = requesters;
  requesters = [];
  for (const f of cur) {
    f(16);
  }
}
export default {
    use, restore, step
}