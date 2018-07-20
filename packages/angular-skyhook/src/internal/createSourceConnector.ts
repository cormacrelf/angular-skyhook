import { Backend, Unsubscribe } from 'dnd-core';
import areOptionsEqual from '../utils/areOptionsEqual';
import { DragSourceConnector } from '../connectors';
import { Reconnector } from './Reconnector';
import { DragPreviewOptions, DragSourceOptions } from '../connectors'

export class SourceConnector {
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

    public receiveHandlerId(handlerId: any) {
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
}

export default function createSourceConnector(backend: Backend) {
    return new SourceConnector(backend);
}
