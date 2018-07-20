import { Backend, Unsubscribe } from 'dnd-core';
import areOptionsEqual from '../utils/areOptionsEqual';
import { DragSourceConnector } from '../connectors';

export class SourceConnector {
    private currentHandlerId: any;

    private currentDragSourceNode: any;
    private currentDragSourceOptions: any;
    private disconnectCurrentDragSource: Unsubscribe | undefined;

    private currentDragPreviewNode: any;
    private currentDragPreviewOptions: any;
    private disconnectCurrentDragPreview: Unsubscribe | undefined;

    constructor(private backend: Backend) {
    }

    private reconnectDragSource() {
        if (this.disconnectCurrentDragSource) {
            this.disconnectCurrentDragSource();
            this.disconnectCurrentDragSource = null;
        }

        if (this.currentHandlerId && this.currentDragSourceNode) {
            this.disconnectCurrentDragSource = this.backend.connectDragSource(
                this.currentHandlerId,
                this.currentDragSourceNode,
                this.currentDragSourceOptions,
            );
        }
    }

    private reconnectDragPreview() {
        if (this.disconnectCurrentDragPreview) {
            this.disconnectCurrentDragPreview();
            this.disconnectCurrentDragPreview = null;
        }

        if (this.currentHandlerId && this.currentDragPreviewNode) {
            this.disconnectCurrentDragPreview = this.backend.connectDragPreview(
                this.currentHandlerId,
                this.currentDragPreviewNode,
                this.currentDragPreviewOptions,
            );
        }
    }

    public receiveHandlerId(handlerId: any) {
        if (handlerId === this.currentHandlerId) {
            return;
        }

        this.currentHandlerId = handlerId;
        this.reconnectDragSource();
        this.reconnectDragPreview();
    }

    public hooks: DragSourceConnector = {
        dragSource: (nativeElement: any, options?: any) => {
            if (
                nativeElement === this.currentDragSourceNode &&
                areOptionsEqual(options, this.currentDragSourceOptions)
            ) {
                return;
            }

            this.currentDragSourceNode = nativeElement;
            this.currentDragSourceOptions = options;

            this.reconnectDragSource();
        },

        dragPreview: (nativeElement: any, options?: any) => {
            if (
                nativeElement === this.currentDragPreviewNode &&
                areOptionsEqual(options, this.currentDragPreviewOptions)
            ) {
                return;
            }

            this.currentDragPreviewNode = nativeElement;
            this.currentDragPreviewOptions = options;

            this.reconnectDragPreview();
        },
    };
}

export default function createSourceConnector(backend: Backend) {
    return new SourceConnector(backend);
}
