import areOptionsEqual from './utils/areOptionsEqual';

export default function createSourceConnector(backend) {
  let currentHandlerId;

  let currentDragSourceNode;
  let currentDragSourceOptions;
  let disconnectCurrentDragSource;

  let currentDragPreviewNode;
  let currentDragPreviewOptions;
  let disconnectCurrentDragPreview;

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

  function receiveHandlerId(handlerId) {
    if (handlerId === currentHandlerId) {
      return;
    }

    currentHandlerId = handlerId;
    reconnectDragSource();
    reconnectDragPreview();
  }

  const hooks = {
    dragSource: function connectDragSource(nativeElement: any, options) {
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

    dragPreview: function connectDragPreview(nativeElement: any, options) {
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
