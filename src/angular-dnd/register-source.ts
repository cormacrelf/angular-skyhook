import { DragDropManager, DragSource } from 'dnd-core';

export default function registerSource(type: any, source: DragSource, manager: DragDropManager) {
  const registry = manager.getRegistry();
  const sourceId = registry.addSource(type, source);

  function unregisterSource() {
    registry.removeSource(sourceId);
  }

  return {
    handlerId: sourceId,
    unregister: unregisterSource,
  };
}
