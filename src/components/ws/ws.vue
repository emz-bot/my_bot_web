<template></template>
  
<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const globalMessages = ref([]);

const wsService = {
  socket: null,
  connect: function () {
    return new Promise((resolve, reject) => {
      this.socket = new WebSocket(window.gurl.WS_BASE_URL + "/ws");
      this.socket.onopen = resolve;
      this.socket.onerror = reject;
      this.socket.onmessage = (event) => {
        const messageJson = JSON.parse(event.data);
        globalMessages.value.push(messageJson);
      };
    });
  },
  disconnect: function () {
    if (this.socket) {
      this.socket.close();
    }
  },
};

onMounted(async () => {
  try {
    await wsService.connect();
  } catch (error) {
    console.error("WebSocket connection failed:", error);
  }
});

onUnmounted(() => {
  wsService.disconnect();
});
</script>