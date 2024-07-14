<template>
  <div class="form-field">
    <label v-show="props.showLabel" :for="props.name">{{ props.label }}</label>
    <input
      :disabled="props.disabled"
      :id="props.name"
      :name="props.name"
      v-model="editableValue"
      :type="props.type"
      :placeholder="props.placeholder"
      :required="props.required"
      class="form-control"
      v-bind="$attrs"
    />
  </div>
</template>

<script setup>
import { defineProps, defineEmits, computed } from "vue";

const props = defineProps({
  name: String,
  label: String,
  showLabel: { type: Boolean, default: true },
  value: { String, required: false },
  disabled: { type: Boolean, default: false },
  placeholder: { type: String, default: "Type.." },
  required: { type: Boolean, default: true },
  type: { type: String, default: "text" },
});

const emit = defineEmits(["onChangeValue", "update:value"]);

const editableValue = computed({
  get() {
    return props.value;
  },
  set(value) {
    emit("update:value", value);
    emit("onChangeValue", value);
  },
});
</script>
