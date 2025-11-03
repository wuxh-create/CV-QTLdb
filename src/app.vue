<template>
  <NuxtLoadingIndicator />
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>

<style lang="scss">
body {
  overflow-x: hidden;
  overflow-y: scroll;
}

a,
a:link,
a:visited,
a:active {
  color: inherit;
  text-decoration: none;
}

::-webkit-scrollbar {
  border-radius: 10px;
  background-color: rgba($indigo-6, 0);
  width: 10px;
}

::-webkit-scrollbar-thumb {
  padding: 2px 2px;
  right: 4px;
  border-radius: 5px;
  background-color: rgba($primary, 0.75);
  width: 10px;
}
</style>
