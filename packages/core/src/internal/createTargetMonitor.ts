import { invariant } from './invariant';
import { DragDropMonitor, Identifier } from 'dnd-core';
import { DropTargetMonitor } from '../target-monitor';

let isCallingCanDrop = false;

class DropTargetMonitorClass implements DropTargetMonitor {
    internalMonitor: DragDropMonitor;
    targetId: Identifier | undefined;

    constructor(manager: any) {
        this.internalMonitor = manager.getMonitor();
    }

    receiveHandlerId(targetId: Identifier | undefined) {
        this.targetId = targetId;
    }

    canDrop(): boolean {
        invariant(
            !isCallingCanDrop,
            'You may not call monitor.canDrop() inside your canDrop() implementation. ' +
            'Read more: http://react-dnd.github.io/react-dnd/docs-drop-target-monitor.html',
        );

        try {
            isCallingCanDrop = true;
            return this.internalMonitor.canDropOnTarget(this.targetId);
        } finally {
            isCallingCanDrop = false;
        }
    }

    isOver(options = { shallow: false }): boolean {
        return this.internalMonitor.isOverTarget(this.targetId, options);
    }

    getItemType() {
        return this.internalMonitor.getItemType();
    }

    getItem(): {} & any {
        return this.internalMonitor.getItem();
    }

    getDropResult() {
        return this.internalMonitor.getDropResult();
    }

    didDrop(): boolean {
        return this.internalMonitor.didDrop();
    }

    getInitialClientOffset() {
        return this.internalMonitor.getInitialClientOffset();
    }

    getInitialSourceClientOffset() {
        return this.internalMonitor.getInitialSourceClientOffset();
    }

    getSourceClientOffset() {
        return this.internalMonitor.getSourceClientOffset();
    }

    getClientOffset() {
        return this.internalMonitor.getClientOffset();
    }

    getDifferenceFromInitialOffset() {
        return this.internalMonitor.getDifferenceFromInitialOffset();
    }
}

export function createTargetMonitor(manager: any): DropTargetMonitor {
    return new DropTargetMonitorClass(manager);
}
