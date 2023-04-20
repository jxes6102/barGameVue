<template>
  <div class="w-[100vw] h-[100vh] overflow-hidden flex flex-wrap justify-center items-start">
    <!-- 主畫面 -->
    <SmallCapsule :allData="newData"></SmallCapsule>
    <!-- 歷史紀錄 -->
    <div class="w-[100%] h-auto flex flex-wrap justify-center items-center">
      <div class="w-[70vw] h-auto flex flex-wrap border-b-2 border-solid border-black">
        <div class="w-[20%] md:w-[15%] h-auto">編號</div>
        <div class="w-[60%] md:w-[70%] h-auto">號碼</div>
        <div class="w-[20%] md:w-[15%] h-auto">特別號</div>
        <!-- <div class="w-[20%] md:w-[10%] h-auto">大小</div>
        <div class="w-[20%] md:w-[10%] h-auto">單雙</div> -->
      </div>
      <div ref="historyItem" class="w-[70vw] h-[40vh] flex flex-wrap overflow-x-hidden overflow-y-auto">
        <div class="flex flex-wrap justify-center items-center">
          <div
            v-for="(item,index) in sortData" :key="index"
            class="w-[100%] flex flex-wrap justify-center items-center border-t-2 border-solid border-black"
          >
            <div class="w-[20%] md:w-[15%] h-auto break-all">{{ item.no }}</div>
            <div class="w-[60%] md:w-[70%] h-auto break-all border-x-2 border-solid border-black">{{ toStr(item.reward) }}</div>
            <div class="w-[20%] md:w-[15%] h-auto break-all">{{ item.special }}</div>
            <!-- <div class="w-[10%] h-auto">{{ item.sizeDecision }}</div>
            <div class="w-[10%] h-auto">{{ item.singleDecision }}</div> -->
          </div>
        </div>
      </div>
    </div>
    <!-- 回上頁 -->
    <Back></Back>
  </div>
</template>
<script>
// @ is an alias to /src
import { ref,computed,onMounted,onBeforeUnmount } from 'vue'
import axios from 'axios'
import Back from '@/components/Back.vue'
import SmallCapsule from '@/components/smallCapsule.vue'
export default {
  components: {
    Back,
    SmallCapsule
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
     */
    const historyItem = ref(null)
    const timer1 = ref(null)
    const drawData = ref(null)
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
    // 監聽api改變後拉桿
    // watch(newData, (newVal,oldVal)=>{
    //   if(oldVal){
    //     // console.log(parseInt(newVal.no),parseInt(oldVal.no))
    //     if(parseInt(newVal.no) > parseInt(oldVal.no)) {
    //     }
    //   }
    // })
    //pyapi拿獎項資料
    const pyCatchNum = () => {
      // fetch('http://127.0.0.1:5000/gethistory', {
      //   headers: {
      //     'content-type': 'application/json' // 這一欄一定要設定！
      //   },
      //   method: 'GET',
      // })
      // .then(response => response.json()) // 輸出成 json
      // .then(res => {
      //   drawData.value = res 
      //   // console.log('gethistory',res)
      // }).catch((error) => {
      //   console.error("Error:", error)
      // })

      axios.get('http://127.0.0.1:5000/gethistory')
      .then((response) => {
        // handle success
        drawData.value = response.data 
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
      .finally(()=> {
        // always executed
        // console.log('always executed')
      });

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
      historyItem,
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
