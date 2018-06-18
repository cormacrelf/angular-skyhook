# Monitoring State

## How to change your template depending on the drag state

1. Take any connection object, like `DragSource`
2. Call `.listen()` with a function that returns what information you want to
   monitor
3. Save the resulting Observable to an instance variable in your component
4. Use the observable via the `| async` pipe to render alternate content in
   your template.

Each type of connection gets a different set of information available on the
monitor. They are laid out in the three interfaces in this module:

- [DragSourceMonitor](../../interfaces/DragSourceMonitor.html)
- [DropTargetMonitor](../../interfaces/DropTargetMonitor.html)
- [DragLayerMonitor](../../interfaces/DragLayerMonitor.html)
- All three derive from [MonitorBase](../../interfaces/MonitorBase.html)

Note that all three monitors have very rapidly-changing information available on
them, such as the current viewport-mouse offset. The `.listen()` functions will
optimise component updates for you. You **don't** want to:

1. Subscribe to more properties than you need. This hinders performance.
2. Subscribe to the entire monitor object. It will only fire once, and then
   never again, because the monitor object itself is the same each time.

## Making decisions in the Spec based on current drag state

The other place you get access to a monitor is in the callbacks in each Spec.
Monitors carry some information only relevant and usable inside these callbacks.
Those methods are documented in the monitor interfaces, and particularly useful
methods are highlighted in each of the Spec callbacks, such as
`DropTargetSpec.drop`.
