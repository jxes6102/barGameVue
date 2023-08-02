<template>
    <div class="fixed top-0 left-0 cursor-pointer z-[9999]" @click="toLinkBack">
        <el-icon :size="40" color="#fc3a52"><Back /></el-icon>
    </div>
</template>
<script>
import { useRouter } from "vue-router";
export default {
  name: 'backComponent',
  components: {
  },
  setup() {
    const router = useRouter();
    const toLinkBack = () => {
        router.push({ path: "/" });
    }
    return {
        toLinkBack
    }
  }
}
</script>
  