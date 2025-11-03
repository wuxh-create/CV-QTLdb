<template>
  <q-page class="q-pl-lg">
    <div class="fullscreen text-center q-pa-md flex flex-center">
      <q-toggle
        :model-value="dark.isActive"
        checked-icon="dark_mode"
        unchecked-icon="light_mode"
        size="3rem"
        @update:model-value="(val) => dark.set(val)"
      />
      <div>
        <div style="font-size: 30vh">404</div>
        <div class="text-h2" style="opacity: 0.4">Oops. Nothing here...</div>
        <q-btn
          class="q-mt-xl"
          color="white"
          text-color="blue"
          unelevated
          to="/"
          label="Go Home"
          no-caps
        />
      </div>
    </div>
  </q-page>
</template>

<script setup>
import { useQuasar } from "quasar";

definePageMeta({
  layout: "empty",
});

const { dark } = useQuasar();
</script>
