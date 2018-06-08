/**
 * @private
 */
/** a second comment */

import { DragDropManager, DragSource } from 'dnd-core';

export default function registerSource(type: any, source: DragSource, manager: DragDropManager<any>) {
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
