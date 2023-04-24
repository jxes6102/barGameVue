<template>
  <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center gap-[20px]">
      <div class="w-[80px] md:w-[100px] text-base md:text-2xl bg-[#8ac6d1] px-2 py-1 rounded-[5px] cursor-pointer hover:opacity-80" @click="toLinkBar">bar</div>
      <div class="w-[80px] md:w-[100px] text-base md:text-2xl bg-[#8ac6d1] px-2 py-1 rounded-[5px] cursor-pointer hover:opacity-80" @click="toLinkCapsule">capsule</div>
      <div class="w-[80px] md:w-[100px] text-base md:text-2xl bg-[#8ac6d1] px-2 py-1 rounded-[5px] cursor-pointer hover:opacity-80" @click="toLinkHistory">history</div>
  </div>
</template>
<script>
// @ is an alias to /src
import { useRouter } from "vue-router";
export default {
  name: 'HomeView',
  components: {
  },
  setup() {
    const router = useRouter();
    const toLinkBar = () => {
        router.push({ name: "bar" });
    }

    const toLinkCapsule = () => {
        router.push({ name: "capsule" });
    }

    const toLinkHistory = () => {
      router.push({ name: "allhistory" });
    }
    
    return {
        toLinkBar,
        toLinkCapsule,
        toLinkHistory
    }

  }
}
</script>