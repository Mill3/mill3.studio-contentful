import { ScrollbarPlugin } from 'smooth-scrollbar';

class ScrollbarPausePlugin extends ScrollbarPlugin {
  static pluginName = 'pause';

  static defaultOptions = {
    pause: false,
  };

  transformDelta(delta) {
    return this.options.pause ? {x: 0, y: 0} : delta
  }
}

export default ScrollbarPausePlugin
