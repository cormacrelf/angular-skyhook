import areOptionsEqual from '../utils/areOptionsEqual';

export default function createSourceConnector(backend: any) {
  let currentHandlerId: any;

  let currentDragSourceNode: any;
  let currentDragSourceOptions: any;
  let disconnectCurrentDragSource: any;

  let currentDragPreviewNode: any;
  let currentDragPreviewOptions: any;
  let disconnectCurrentDragPreview: any;

  function reconnectDragSource() {
    if (disconnectCurrentDragSource) {
      disconnectCurrentDragSource();
      disconnectCurrentDragSource = null;
    }

    if (currentHandlerId && currentDragSourceNode) {
      disconnectCurrentDragSource = backend.connectDragSource(
        currentHandlerId,
        currentDragSourceNode,
        currentDragSourceOptions,
      );
    }
  }

  function reconnectDragPreview() {
    if (disconnectCurrentDragPreview) {
      disconnectCurrentDragPreview();
      disconnectCurrentDragPreview = null;
    }

    if (currentHandlerId && currentDragPreviewNode) {
      disconnectCurrentDragPreview = backend.connectDragPreview(
        currentHandlerId,
        currentDragPreviewNode,
        currentDragPreviewOptions,
      );
    }
  }

  function receiveHandlerId(handlerId: any) {
    if (handlerId === currentHandlerId) {
      return;
    }

    currentHandlerId = handlerId;
    reconnectDragSource();
    reconnectDragPreview();
  }

  const hooks = {
    dragSource: function connectDragSource(nativeElement: any, options?: any) {
      if (
        nativeElement === currentDragSourceNode &&
        areOptionsEqual(options, currentDragSourceOptions)
      ) {
        return;
      }

      currentDragSourceNode = nativeElement;
      currentDragSourceOptions = options;

      reconnectDragSource();
    },

    dragPreview: function connectDragPreview(nativeElement: any, options?: any) {
      if (
        nativeElement === currentDragPreviewNode &&
        areOptionsEqual(options, currentDragPreviewOptions)
      ) {
        return;
      }

      currentDragPreviewNode = nativeElement;
      currentDragPreviewOptions = options;

      reconnectDragPreview();
    },
  };

  return {
    receiveHandlerId,
    hooks,
  };
}
