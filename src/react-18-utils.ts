import { createRoot, Root } from 'react-dom/client';

export function renderReactRoot(
  node: JSX.Element,
  container: HTMLElement,
  renderWeakMap: WeakMap<HTMLElement, Root>,
) {
  let root = renderWeakMap.get(container);
  if (!root) {
    renderWeakMap.set(container, (root = createRoot(container)));
  }
  root.render(node);
  return () => {
    root?.unmount();
  };
}
