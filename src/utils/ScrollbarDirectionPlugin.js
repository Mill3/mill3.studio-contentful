import { ScrollbarPlugin } from 'smooth-scrollbar'

class ScrollbarDirectionPlugin extends ScrollbarPlugin {
  static pluginName = 'direction'

  static defaultOptions = {
    direction: 'down',
    offset: {
      x: 0,
      y: 0,
    },
  }

  onInit() {
    this.scrollbar.direction = this.options.direction
  }

  onRender() {
    this.scrollbar.direction = this.scrollbar.offset.y > this.options.offset.y ? `down` : `up`
  }

  onUpdate() {
    if (this.options.offset.y !== this.scrollbar.offset.y) this.options.offset.y = this.scrollbar.offset.y
  }
}

export default ScrollbarDirectionPlugin
