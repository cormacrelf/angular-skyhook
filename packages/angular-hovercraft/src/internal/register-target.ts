// import { DragDropManager, DropTarget } from 'dnd-core';

export default function registerTarget(type: any, target: any, manager: any) {
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
