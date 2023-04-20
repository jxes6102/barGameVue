<template>
  <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center gap-[20px]">
     <el-button type="primary" size='large' style="font-size: 22px; width:100px;" @click="toLinkBar">bar</el-button>
     <el-button type="primary" size='large' style="font-size: 22px; width:100px;" @click="toLinkCapsule">capsule</el-button>
  </div>
</template>
<script>
// @ is an alias to /src
import { useRouter } from "vue-router";
export default {
  name: 'HomeView',
  components: {
    // HelloWorld
  },
  setup() {
    const router = useRouter();
    const toLinkBar = () => {
        router.push({ name: "bar" });
    }

    const toLinkCapsule = () => {
        router.push({ name: "capsule" });
    }
    
    return {
        toLinkBar,
        toLinkCapsule
    }

  }
}
</script>