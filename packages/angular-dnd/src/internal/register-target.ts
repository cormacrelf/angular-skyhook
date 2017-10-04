// import { DragDropManager, DropTarget } from 'dnd-core';

export default function registerTarget(type, target: any, manager: any) {
  const registry = manager.getRegistry();
  const targetId = registry.addTarget(type, target);

  function unregisterTarget() {
    registry.removeTarget(targetId);
  }

  return {
    handlerId: targetId,
    unregister: unregisterTarget,
  };
}
