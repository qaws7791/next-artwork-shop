import { useSyncExternalStore } from "react";

type Callback = () => void;

let store = {
  width: 0,
  height: 0,
};

function getServerSnapshot() {
  return store;
}

function getSnapshot() {
  return store;
}

function subscribe(callback: Callback) {
  const handleResize = () => {
    store = {
      width: window.innerWidth,
      height: window.innerHeight,
    };
    callback();
  };

  handleResize();
  window.addEventListener("resize", handleResize);

  return () => window.removeEventListener("resize", handleResize);
}

export default function useWindowSize() {
  const windowSize = useSyncExternalStore(
    subscribe,
    getSnapshot,
    getServerSnapshot,
  );

  return windowSize;
}
