<template>
  <div class="w-[100vw] h-[100vh] overflow-x-hidden overflow-y-auto flex flex-wrap justify-center items-start bg-[url('/src/assets/images/black_backGround.png')] bg-contain bg-center">
    <!-- 主畫面 -->
    <SmallCapsule :allData="newData"></SmallCapsule>
    <!-- 新歷史紀錄 -->
    <div class="w-[800px] h-[50vh] md:h-[60vh] flex flex-wrap justify-center items-center z-[9999]">
      <SmallHistory :tableData="sortData" :tableHeight="'45vh'"></SmallHistory>
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
import { useStore } from "vuex"
import { useI18n } from 'vue-i18n'
export default {
  components: {
    Back,
    SmallCapsule,
    SmallHistory,
  },
  setup() {
    /**
     * timer1 設定timer 1/10s
     * historyData api資料整理
     * newData 最新一筆
     * drawResult 最新一筆號碼
     * termResult 最新一筆編號
     * specialPosition 最新一筆特別號位置
     * sortData 排序後資料
     */
    const { t } = useI18n()
    const store = useStore()
    const timer1 = ref(null)
    const historyData = ref([])
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
    //pyapi拿獎項資料
    const pyCatchNum = async() => {
      await store.dispatch('pyGet',{getText:t})
      historyData.value = store.state.todayrecord
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
    })

    onBeforeUnmount(() => {
      clearInterval(timer1.value)
    })

    return {
      drawResult,
      termResult,
      historyData,
      specialPosition,
      sortData,
      newData,
      toStr,
    }

  }
}
</script>
<style scoped>
</style>
