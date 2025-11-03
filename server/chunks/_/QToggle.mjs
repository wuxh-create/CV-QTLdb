import { computed, h } from 'vue';
import { _ as __nuxt_component_4 } from './QIcon.mjs';
import { u as useCheckboxEmits, a as useCheckboxProps, b as useCheckbox } from './use-checkbox.mjs';
import { g as createComponent } from '../build/server.mjs';

const __nuxt_component_1 = createComponent({
  name: 'QToggle',

  props: {
    ...useCheckboxProps,

    icon: String,
    iconColor: String
  },

  emits: useCheckboxEmits,

  setup (props) {
    function getInner (isTrue, isIndeterminate) {
      const icon = computed(() =>
        (isTrue.value === true
          ? props.checkedIcon
          : (isIndeterminate.value === true ? props.indeterminateIcon : props.uncheckedIcon)
        ) || props.icon
      );

      const color = computed(() => (isTrue.value === true ? props.iconColor : null));

      return () => [
        h('div', { class: 'q-toggle__track' }),

        h('div', {
          class: 'q-toggle__thumb absolute flex flex-center no-wrap'
        }, icon.value !== void 0
          ? [
              h(__nuxt_component_4, {
                name: icon.value,
                color: color.value
              })
            ]
          : void 0
        )
      ]
    }

    return useCheckbox('toggle', getInner)
  }
});

export { __nuxt_component_1 as _ };
//# sourceMappingURL=QToggle.mjs.map
