<template>
    <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center gap-[20px]">
      <el-button
        v-loading.fullscreen.lock="fullscreenLoading"
        type="primary"
        @click="openFullScreen1"
      >
        As a directive
      </el-button>
      <el-button type="primary" @click="openFullScreen2"> As a service </el-button>
    </div>
</template>
<script>
/*eslint-disable*/
// @ is an alias to /src
import { ElLoading } from 'element-plus'
import { ref } from 'vue'
import { useRouter } from "vue-router";
export default {
  name: 'about',
  components: {
  },
  setup() {
    const tableData = ref([
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ])
    const router = useRouter();
    const toLinkBar = () => {
        router.push({ name: "bar" });
    }

    const toLinkCapsule = () => {
        router.push({ name: "capsule" });
    }
    const fullscreenLoading = ref(false)
    const openFullScreen1 = () => {
      fullscreenLoading.value = true
      setTimeout(() => {
        fullscreenLoading.value = false
      }, 2000)
    }

    const openFullScreen2 = () => {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      setTimeout(() => {
        loading.close()
      }, 2000)
    }
    
    return {
        toLinkBar,
        toLinkCapsule,
        tableData,
        fullscreenLoading,
        openFullScreen1,
        openFullScreen2
    }

  }
}
</script>
