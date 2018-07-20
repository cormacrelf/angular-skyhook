import { Backend, Unsubscribe } from 'dnd-core';
import areOptionsEqual from '../utils/areOptionsEqual';
import { DropTargetConnector } from '../connectors';
import { Reconnector } from './Reconnector';

export class TargetConnector {
    private currentHandlerId: any;

    private dropTarget = new Reconnector<void>(
        (handlerId, node, options) => {
            return this.backend.connectDropTarget(handlerId, node, options);
        }
    );

    constructor(private backend: Backend) {}

    public receiveHandlerId(handlerId: any) {
        if (handlerId === this.currentHandlerId) {
            return;
        }
        this.currentHandlerId = handlerId;
        this.dropTarget.reconnect(handlerId);
    }

    public hooks: DropTargetConnector = {
        dropTarget: this.dropTarget.hook
    };
}

export default function createTargetConnector(backend: Backend) {
    return new TargetConnector(backend);
}
