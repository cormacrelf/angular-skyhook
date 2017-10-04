export default {
  input: 'build/angular-hovercraft.js',
  output: {
    file: 'dist/angular-hovercraft.js',
    format: 'es',
  },
  name: 'angularhovercraft',
  sourceMap: false,
  onwarn: function(warning) {
    if (warning.code === 'THIS_IS_UNDEFINED') { return; }
    console.error(warning.message);
  },
  external: [
    'dnd-core',
    '@angular/core',
    'rxjs/Observable',
    'rxjs/Subscription',
    'rxjs/ReplaySubject',
    'rxjs/BehaviorSubject',
    'rxjs/add/operator/map',
    'rxjs/add/operator/switchMapTo',
    'rxjs/add/operator/take',
    'rxjs/add/operator/distinctUntilChanged'
  ]
}
