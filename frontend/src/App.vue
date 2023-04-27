<template>
  <router-view/>
</template>

<script>
import { ref,onMounted } from 'vue'
import { useStore } from "vuex";
export default {

  components: {
  },
  setup() {
    const store = useStore()
    const windowWidth = ref(0)

    const setWidth = () => {
      store.commit('setMobile',windowWidth.value)
    }
    onMounted(() => {
      windowWidth.value = window.innerWidth
      setWidth()
      window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth
        setWidth()
      }, false);
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
