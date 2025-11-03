import { computed, h } from 'vue';
import { g as createComponent } from '../build/server.mjs';
import { h as hSlot } from './render.mjs';

const __nuxt_component_3 = createComponent({
  name: 'QCardSection',

  props: {
    tag: {
      type: String,
      default: 'div'
    },

    horizontal: Boolean
  },

  setup (props, { slots }) {
    const classes = computed(() =>
      'q-card__section'
      + ` q-card__section--${ props.horizontal === true ? 'horiz row no-wrap' : 'vert' }`
    );

    return () => h(props.tag, { class: classes.value }, hSlot(slots.default))
  }
});

export { __nuxt_component_3 as _ };
//# sourceMappingURL=QCardSection.mjs.map
