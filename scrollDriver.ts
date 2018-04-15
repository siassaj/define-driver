import xs        from 'xstream'
import fromEvent from 'xstream/extra/fromEvent'
import { defineDriver,  Source } from './defineDriver'

import { Stream } from 'xstream'

//////////////////////////////////// Types  ////////////////////////////////////
export type Scroll$ = Stream<any>;
export class ScrollSource extends Source {
  scroll$: Stream<any>

  constructor(ownAndChildResults$$, options, config) {
    super(ownAndChildResults$$, options, config)
  }
}

////////////////////////////////// Operations //////////////////////////////////
export class ClientScrollSource extends ScrollSource {
  constructor(ownAndChildResults$$, options, config) {
    super(ownAndChildResults$$, options, config)

    this.scroll$ = fromEvent(window, 'scroll').
      map(e => ({
        x: window.scrollX,
        y: window.scrollY
      }))
  }
}

export class ServerScrollSource extends ScrollSource {
  constructor(ownAndChildResults$$, options, config) {
    super(ownAndChildResults$$, options, config)

    this.scroll$ = xs.of({x: 0, y: 0})
  }
}

export const makeScrollDriver = defineDriver({
  name: 'scrollDriver',
  source: ClientScrollSource,
  config: { isAlwaysListening: true },
  callbacks: {
    sinkNext: obj => window.requestAnimationFrame(_ => window.scrollTo(obj.scrollX, obj.scrollY)),
    start: () => {}
  }
})

export const makeServerScrollDriver = defineDriver({
  name: 'scrollDriver',
  source: ServerScrollSource,
  config: { isAlwaysListening: true },
  callbacks: {
    sinkNext: () => {},
    start: () => {}
  }
})

