/**
 * @private
 */
/** a second comment */

import areOptionsEqual from '../utils/areOptionsEqual';
import { DropTargetConnector } from '../connectors';

export default function createTargetConnector(backend: any) {
  let currentHandlerId: any;

  let currentDropTargetNode: any;
  let currentDropTargetOptions: any;
  let disconnectCurrentDropTarget: any;

  function reconnectDropTarget() {
    if (disconnectCurrentDropTarget) {
      disconnectCurrentDropTarget();
      disconnectCurrentDropTarget = null;
    }

    if (currentHandlerId && currentDropTargetNode) {
      disconnectCurrentDropTarget = backend.connectDropTarget(
        currentHandlerId,
        currentDropTargetNode,
        currentDropTargetOptions,
      );
    }
  }

  function receiveHandlerId(handlerId: any) {
    if (handlerId === currentHandlerId) {
      return;
    }

    currentHandlerId = handlerId;
    reconnectDropTarget();
  }

  const hooks: DropTargetConnector = {
    dropTarget: function connectDropTarget(nativeElement: any, options?: any) {
      if (
        nativeElement === currentDropTargetNode &&
        areOptionsEqual(options, currentDropTargetOptions)
      ) {
        return;
      }

      currentDropTargetNode = nativeElement;
      currentDropTargetOptions = options;

      reconnectDropTarget();
    },
  };

  return {
    receiveHandlerId,
    hooks,
  };
}
