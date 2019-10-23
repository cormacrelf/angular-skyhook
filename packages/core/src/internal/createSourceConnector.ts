import { Backend, Identifier } from 'dnd-core';
import { DragSourceConnector } from '../connectors';
import { Reconnector } from './Reconnector';
import { DragPreviewOptions, DragSourceOptions } from '../connectors'

export interface Connector<TConnector> {
    hooks: TConnector;
    receiveHandlerId(handlerId: Identifier | null): void;
    reconnect(): void;
}

export class SourceConnector implements Connector<DragSourceConnector> {
    private currentHandlerId: any;

    private dragSource = new Reconnector<DragSourceOptions>(
        (handlerId, node, options) => {
            return this.backend.connectDragSource(handlerId, node, options);
        }
    );
    private dragPreview = new Reconnector<DragPreviewOptions>(
        (handlerId, node, options) => {
            return this.backend.connectDragPreview(handlerId, node, options);
        }
    );

    constructor(private backend: Backend) {}

    public receiveHandlerId(handlerId: Identifier | null) {
        if (handlerId === this.currentHandlerId) {
            return;
        }
        this.currentHandlerId = handlerId;
        this.dragSource.reconnect(handlerId);
        this.dragPreview.reconnect(handlerId);
    }

    public hooks: DragSourceConnector = {
        dragSource: this.dragSource.hook,
        dragPreview: this.dragPreview.hook,
    };

    public reconnect() {
        this.dragSource.reconnect(this.currentHandlerId);
        this.dragPreview.reconnect(this.currentHandlerId);
    }
}

export default function createSourceConnector(backend: Backend) {
    return new SourceConnector(backend);
}
