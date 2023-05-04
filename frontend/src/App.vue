<template>
  <router-view/>
</template>

<script>
import { ref,reactive,onMounted } from 'vue'
import { useStore } from "vuex";
export default {

  components: {
  },
  setup() {
    const store = useStore()
    const windowWidth = ref(0)
    const states = reactive({
      deferredPrompt: null,
    });

    const setWidth = () => {
      store.commit('setMobile',windowWidth.value)
    }
    onMounted(() => {
      // 監聽螢幕寬度
      windowWidth.value = window.innerWidth
      setWidth()
      window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth
        setWidth()
      }, false);
      // PWA相關
      window.addEventListener("beforeinstallprompt", e => {
        e.preventDefault();
        states.deferredPrompt = e;
      });
      window.addEventListener("appinstalled", () => {
        states.deferredPrompt = null;
      });
      document.querySelector("#app").addEventListener("click", () => {
        // if (states.deferredPrompt) {
        //   states.deferredPrompt.prompt();
        //   states.deferredPrompt = null;
        // }
      });

    })
    return {
    }
  }
}
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
}
</style>
