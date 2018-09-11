When using `@angular-skyhook`, you follow this general pattern:

1. Create a connection and specify its behaviour: [Creating Connections](guide/1.-creating-connections.html)
2. Use directives or methods to connect it to real DOM elements:
   [Connecting to DOM](guide/2.-connecting-to-dom.html)
3. Use the connection's `listen` method to listen for relevant state changes, and respond to them:
   [Monitoring State](guide/3.-monitoring-state.html)
4. Remember to destroy the connection in `ngOnDestroy()`. Refer to [part 1](guide/1.-creating-connections.html)

