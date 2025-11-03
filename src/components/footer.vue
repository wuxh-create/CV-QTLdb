<template>
  <QFooter
    :bordered="$q.dark.isActive"
    class="row text-center q-pa-md justify-center"
    :class="$q.dark.isActive ? 'text-grey-2 bg-dark' : 'text-grey-7 bg-grey-3'"
  >
    <div class="col-12">
      {{ "Copyright © 2024 The Gong Lab. All rights reserved." }}
    </div>
  </QFooter>
</template>
<script setup lang="ts">
const $q = useQuasar();
</script>
