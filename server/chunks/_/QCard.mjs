import { getCurrentInstance, computed, h } from 'vue';
import { u as useDarkProps, a as useDark } from './use-dark.mjs';
import { g as createComponent } from '../build/server.mjs';
import { h as hSlot } from './render.mjs';

const __nuxt_component_2 = createComponent({
  name: 'QCard',

  props: {
    ...useDarkProps,

    tag: {
      type: String,
      default: 'div'
    },

    square: Boolean,
    flat: Boolean,
    bordered: Boolean
  },

  setup (props, { slots }) {
    const { proxy: { $q } } = getCurrentInstance();
    const isDark = useDark(props, $q);

    const classes = computed(() =>
      'q-card'
      + (isDark.value === true ? ' q-card--dark q-dark' : '')
      + (props.bordered === true ? ' q-card--bordered' : '')
      + (props.square === true ? ' q-card--square no-border-radius' : '')
      + (props.flat === true ? ' q-card--flat no-shadow' : '')
    );

    return () => h(props.tag, { class: classes.value }, hSlot(slots.default))
  }
});

export { __nuxt_component_2 as _ };
//# sourceMappingURL=QCard.mjs.map
