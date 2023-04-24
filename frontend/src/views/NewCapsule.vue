<template>
  <div class="w-[100vw] h-[100vh] overflow-hidden flex flex-wrap justify-center items-start">
    <!-- 主畫面 -->
    <SmallCapsule :allData="newData"></SmallCapsule>
    <!-- 新歷史紀錄 -->
    <div class="w-[800px] h-[25vh] flex flex-wrap justify-center items-center">
      <SmallHistory :isMobile="isMobile" :tableData="sortData"></SmallHistory>
    </div>
    <!-- 回上頁 -->
    <Back></Back>
  </div>
</template>
<script>
// @ is an alias to /src
import { ref,computed,onMounted,onBeforeUnmount } from 'vue'
// import axios from 'axios'
import Back from '@/components/Back.vue'
import SmallCapsule from '@/components/smallCapsule.vue'
import SmallHistory from '@/components/smallHistory.vue'
import { useStore } from "vuex";
export default {
  components: {
    Back,
    SmallCapsule,
    SmallHistory,
  },
  setup() {
    /**
     * historyItem 歷史紀錄區塊ref
     * timer1 設定timer 1/10s
     * drawData 原始api資料
     * historyData api資料整理
     * newData 最新一筆
     * drawResult 最新一筆號碼
     * termResult 最新一筆編號
     * specialPosition 最新一筆特別號位置
     * sortData 排序後資料
     * windowWidth 螢幕寬度
     * isMobile 判斷裝置
     */
    const store = useStore();
    const historyItem = ref(null)
    const timer1 = ref(null)
    const drawData = ref(null)
    const windowWidth = ref(0)
    const historyData = computed(() => {
      let target = []
      if(!drawData.value) return target
      for(let key in drawData.value){
        target.push({
          no:key,
          reward:drawData.value[key][0].split(' ').filter((item) => item),
          special:drawData.value[key][1],
          sizeDecision:drawData.value[key][2],
          singleDecision:drawData.value[key][3]
        })
      }
      return target
    })
    const newData = computed(() => {
      if(!historyData.value) return {}
      return historyData.value[historyData.value.length - 1]
    })
    const drawResult = computed(() => {
      if(!newData.value) return []
      return newData.value.reward
    })
    const termResult = computed(() => {
      if(!newData.value) return []
      return newData.value.no
    })
    const specialPosition = computed(() => {
      if(!newData.value) return -1
      return newData.value.reward.indexOf(newData.value.special)
    })
    const sortData = computed(() => {
      if(!historyData.value) return []
      return JSON.parse(JSON.stringify(historyData.value)).reverse()
    })
    const isMobile = computed(() => {
      return windowWidth.value <= 768 ? true : false
    })
    //pyapi拿獎項資料
    const pyCatchNum = async() => {
      await store.dispatch('pyGet')
      drawData.value = store.state.todayrecord
    }
    //轉換格式
    const toStr = (val) => {
      return val.join(' ')
    }
    //初始動作
    const init = () => {
      pyCatchNum()
    }
    init()

    onMounted(() => {
      timer1.value = window.setInterval((async() => {
        await pyCatchNum()
      } ), 5500)
      windowWidth.value = window.innerWidth
      window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth
      }, false);
    })

    onBeforeUnmount(() => {
      clearInterval(timer1.value)
    })

    return {
      historyItem,
      drawResult,
      termResult,
      historyData,
      specialPosition,
      sortData,
      newData,
      isMobile,
      toStr,
    }

  }
}
</script>
<style scoped>
</style>
