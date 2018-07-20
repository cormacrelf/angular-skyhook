import { Backend, Unsubscribe } from 'dnd-core';
import areOptionsEqual from '../utils/areOptionsEqual';
import { DropTargetConnector } from '../connectors';

export class TargetConnector {
    private currentHandlerId: any;
    private currentDropTargetNode: any;
    private currentDropTargetOptions: any;
    private disconnectCurrentDropTarget: Unsubscribe | undefined;

    constructor(private backend: Backend) {}

    private reconnectDropTarget() {
        if (this.disconnectCurrentDropTarget) {
            this.disconnectCurrentDropTarget();
            this.disconnectCurrentDropTarget = null;
        }

        if (this.currentHandlerId && this.currentDropTargetNode) {
            this.disconnectCurrentDropTarget = this.backend.connectDropTarget(
                this.currentHandlerId,
                this.currentDropTargetNode,
                this.currentDropTargetOptions,
            );
        }
    }

    public receiveHandlerId(handlerId: any) {
        if (handlerId === this.currentHandlerId) {
            return;
        }

        this.currentHandlerId = handlerId;
        this.reconnectDropTarget();
    }

    public hooks: DropTargetConnector = {
        dropTarget: (nativeElement: any, options?: any) => {
            if (
                nativeElement === this.currentDropTargetNode &&
                areOptionsEqual(options, this.currentDropTargetOptions)
            ) {
                return;
            }

            this.currentDropTargetNode = nativeElement;
            this.currentDropTargetOptions = options;

            this.reconnectDropTarget();
        },
    };
}

export default function createTargetConnector(backend: Backend) {
    return new TargetConnector(backend);
}
