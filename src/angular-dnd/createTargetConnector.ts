import areOptionsEqual from './utils/areOptionsEqual';

export default function createTargetConnector(backend) {
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

  function receiveHandlerId(handlerId) {
    if (handlerId === currentHandlerId) {
      return;
    }

    currentHandlerId = handlerId;
    reconnectDropTarget();
  }

  const hooks = {
    dropTarget: function connectDropTarget(nativeElement: any, options) {
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
