<script setup lang="ts">
import { ref } from 'vue';

export interface Props {
  title?: string;
  message?: string;
  buttonText?: string;
}

withDefaults(defineProps<Props>(), {
  title: 'My Component',
  message: 'This is a sample component from the Vue plugin template',
  buttonText: 'Click me',
});

const emit = defineEmits<{
  click: [message: string];
}>();

const clickCount = ref(0);

const handleClick = () => {
  clickCount.value++;
  emit('click', `Button clicked ${clickCount.value} times`);
};
</script>

<template>
  <div class="my-component">
    <h2>{{ title }}</h2>
    <p>{{ message }}</p>
    <button @click="handleClick">
      {{ buttonText }}
    </button>
  </div>
</template>

<style scoped>
.my-component {
  padding: 1.5rem;
  border: 2px solid #42b883;
  border-radius: 8px;
  background-color: #f9f9f9;
  text-align: center;
  max-width: 400px;
  margin: 0 auto;
}

.my-component h2 {
  color: #42b883;
  margin-top: 0;
}

.my-component p {
  color: #333;
  line-height: 1.6;
}

.my-component button {
  padding: 0.5rem 1.5rem;
  background-color: #42b883;
  color: white;
  border: none;
  border-radius: 4px;
  cursor: pointer;
  font-size: 1rem;
  transition: background-color 0.3s;
}

.my-component button:hover {
  background-color: #35a372;
}

.my-component button:active {
  transform: translateY(1px);
}
</style>
