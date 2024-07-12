<template>
  <div class="wrapper">
    <div class="header">
      <slot name="header" />
    </div>

    <div class="main">
      <div class="content">
        <slot name="content" />
      </div>
    </div>

    <div class="footer">
      <slot name="footer" />
    </div>
  </div>
</template>

<style scoped>
.wrapper {
  width: 100%;
  height: 100%;
}

.main {
  height: 100%;
  width: 100%;
  display: flex;
}

.content {
  width: 100%;
}

.footer {
  width: 100%;
  display: flex;
}
</style>
