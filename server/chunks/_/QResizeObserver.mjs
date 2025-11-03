import { g as createComponent, B as noop } from '../build/server.mjs';

const QResizeObserver = createComponent({
  name: 'QResizeObserver',

  props: {
    debounce: {
      type: [ String, Number ],
      default: 100
    }
  },

  emits: [ 'resize' ],

  setup (props, { emit }) {
    { return noop }
  }
});

export { QResizeObserver as Q };
//# sourceMappingURL=QResizeObserver.mjs.map
