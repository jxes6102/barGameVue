<template>
  <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center md:gap-[20px]">
      <div class="w-[50%] md:w-auto h-auto flex flex-wrap justify-center items-center">
        <div class="w-[80px] md:w-[100px] text-base md:text-2xl bg-[#8ac6d1] px-2 py-1 rounded-[5px] cursor-pointer hover:opacity-80" @click="toLinkBar">bar</div>
      </div>
      <div class="w-[50%] md:w-auto h-auto flex flex-wrap justify-center items-center">
        <div class="w-[80px] md:w-[100px] text-base md:text-2xl bg-[#8ac6d1] px-2 py-1 rounded-[5px] cursor-pointer hover:opacity-80" @click="toLinkCapsule">capsule</div>
      </div>
      <div class="w-[50%] md:w-auto h-auto flex flex-wrap justify-center items-center">
        <div class="w-[80px] md:w-[100px] text-base md:text-2xl bg-[#8ac6d1] px-2 py-1 rounded-[5px] cursor-pointer hover:opacity-80" @click="toLinkHistory">history</div>
      </div>
      <div class="w-[50%] md:w-auto h-auto flex flex-wrap justify-center items-center">
        <div class="w-[80px] md:w-[100px] text-base md:text-2xl bg-[#8ac6d1] px-2 py-1 rounded-[5px] cursor-pointer hover:opacity-80" @click="toLinkBox">box</div>
      </div>
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

    const toLinkBox= () => {
      router.push({ name: "boxView" });
    }
    
    return {
        toLinkBar,
        toLinkCapsule,
        toLinkHistory,
        toLinkBox
    }

  }
}
</script>