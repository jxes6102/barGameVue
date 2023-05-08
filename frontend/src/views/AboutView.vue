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
      <div :class="strColor" class="w-[10vw] h-[10vh] glass"></div>
      <el-button type="primary" @click="colorGG">change color</el-button>
      <div>きんぎょ这感觉要学过UIUXt{{ t('message') }}</div>
      <div class="w-[60px] md:w-[80px] text-base md:text-2xl bg-[#8ac6d1] rounded-[5px] cursor-pointer hover:opacity-80" @click="changeLang">切換語言</div>
    </div>
</template>
<script>
/*eslint-disable*/
// @ is an alias to /src
import { ElLoading } from 'element-plus'
import { ref,computed } from 'vue'
import { useRouter } from "vue-router"
import { useI18n } from 'vue-i18n'
export default {
  name: 'about',
  components: {
  },
  setup() {
    const { t,locale } = useI18n()
    const strColor = ref('red')
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
    const colorStyle = computed(() => {
      return 'bg-['+strColor.value+']'
    });
    const colorGG = () => {
      console.log('colorGG')
      if(strColor.value === 'red') {
        strColor.value === 'blue'
      }else {
        strColor.value === 'red'
      }
    }

    const changeLang = () => {
      // console.log('changeLang')
      // locale.value = 'sc'
      // locale.value = 'en'
      locale.value = 'tc'
      console.log(locale.value)
      console.log(t('message'))
    }
    
    return {
        toLinkBar,
        toLinkCapsule,
        tableData,
        fullscreenLoading,
        openFullScreen1,
        openFullScreen2,
        colorGG,
        strColor,
        colorStyle,
        t,
        changeLang
    }

  }
}
</script>
<style scoped>
.glass{
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
  backdrop-filter: blur( 14px );
  -webkit-backdrop-filter: blur( 14px );
  border-radius: 10px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
}
</style>
