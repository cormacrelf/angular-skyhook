declare module 'dnd-core' {
    interface ManagerContext {
        'window': Window;
    }
    class DragDropManager {
        constructor(backend: any, context: ManagerContext);
    }
}
