<template>
  <div class="w-[100vw] h-[100vh] overflow-hidden flex flex-wrap justify-center items-center">
    <!-- 主畫面 -->
    <div class="relative min-h-[360px] h-[100vh] w-[100vw] flex-col flex flex-wrap justify-center items-center">
      <!-- 訊息 -->
      <div class="w-full h-auto text-lg font-bold flex flex-wrap justify-center items-center">{{ displayTitle }}</div>
      <div class="w-full h-auto text-lg font-bold">{{ displayTime }}</div>
      <div class="flex flex-wrap justify-center items-center h-[300px] w-[250px] md:h-[400px] md:w-[800px] text-white">
        <div
          v-for="(item,index) in 20" :key="item+index"
          :class="(specialPosition === index) && !animationStatusArr[index] ? 'bg-rose-800' :'bg-[LightCoral]'"
          class="w-[40px] h-[40px] md:w-[70px] md:h-[70px] mr-[10px] md:mr-[10px] border-[gray] border-solid  border-[2px] rounded-[4px] overflow-hidden"
          >
          <div v-for="(items) in 100" :key="items*2"
            :class="animationStatusArr[index] ? 'is-play' : 'slowly'"
            :id="'result-'+(items-1)">
              <div v-if="items === 1">
                <div v-for="(num,numIndex) in 3" :key="num*2" class="flex justify-center text-[30px] md:text-[48px]">{{ drawResult[index] ? drawResult[index]-numIndex : '?' }}</div>
              </div>
              <div v-else>
                <div class="flex justify-center text-[30px] md:text-[48px]">{{items - 1}}</div>
              </div>
          </div>
        </div>
      </div>
      <!--拉桿-->
      <div class="absolute scale-[0.5] md:scale-100 h-[400px] w-[40px] bg-[#666] top-[10%] right-[5px] md:right-[5%] cursor-pointer">
        <div
          v-show="!downStatus" 
          class="absolute block w-[20px] h-[200px] bg-[#ccc] bottom-1/2 left-0 right-0 rounded-[10px] my-0 mx-auto">
        </div>
        <div 
          v-show="!downStatus" 
          class="absolute w-[80px] h-[80px] bg-[#faa] rounded-[50%] left-[-50%] top-[-10%] shadow-[0_10px_10px_0_#333] cursor-pointer">
        </div> 
        <Transition name="bar">
          <div
            v-show="downStatus" 
            class="absolute block w-[20px] h-[200px] bg-[#ccc] bottom-1/2 left-0 right-0 rounded-[10px] my-0 mx-auto">
          </div>
        </Transition>
        <Transition name="barCircle">
          <div 
            v-show="downStatus" 
            class="absolute w-[80px] h-[80px] bg-[#faa] rounded-[50%] left-[-50%] top-[-10%] shadow-[0_10px_10px_0_#333] cursor-pointer">
          </div>
        </Transition>
      </div>
    </div>
    <!-- 新歷史紀錄 -->
    <!-- <div class="w-[800px] h-[25vh] flex flex-wrap justify-center items-center">
      <SmallHistory :tableData="sortData"></SmallHistory>
    </div> -->
    <!-- 回上頁 -->
    <Back></Back>
    <load v-show="!sortData.length"></load>
  </div>
</template>
<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref,computed,onMounted,onBeforeUnmount,watch } from 'vue'
import Back from '@/components/Back.vue'
// import SmallHistory from '@/components/smallHistory.vue'
import load from '@/components/load.vue'
import { useStore } from "vuex"
import { useI18n } from 'vue-i18n'
export default {
  name: 'HomeView',
  components: {
    Back,
    // SmallHistory,
    load
  },
  setup() {
    /**
     * historyItem 歷史紀錄區塊ref
     * timer1 設定timer 1/10s
     * animationStatusArr 數字動畫狀態
     * downStatus 拉桿動畫狀態
     * historyData api資料整理
     * newData 最新一筆
     * drawResult 最新一筆號碼
     * specialPosition 最新一筆特別號位置
     * sortData 排序後資料
     * displayTime 顯示時間訊息
     * timer2 扣時timer
     * nowSeconds 剩餘秒數
     */
    const { t } = useI18n()
    const store = useStore()
    const nowSeconds = ref(0)
    const animationStatusArr = ref([])
    const historyItem = ref(null)
    const timer1 = ref(null)
    const timer2 = ref(null)
    const downStatus = ref(false)
    const historyData = ref([])
    const newData = computed(() => {
      if(!historyData.value) return {}
      return historyData.value[historyData.value.length - 1]
    })
    const drawResult = computed(() => {
      if(!newData.value) return []
      return newData.value.reward.map((item) => parseInt(item))
    })
    const specialPosition = computed(() => {
      if(!newData.value) return -1
      return newData.value.reward.indexOf(newData.value.special)
    })
    const sortData = computed(() => {
      if(!historyData.value) return []
      return JSON.parse(JSON.stringify(historyData.value)).reverse()
    })
    const displayTitle = computed(() => {
        if(!newData.value?.no) return 0
        return t('title') + (parseInt(newData.value.no)+1)
    })
    const displayTime = computed(() => {
        return t('time') + Math.floor(nowSeconds.value/60)+":"+nowSeconds.value%60
    })
    // 監聽api改變後拉桿
    watch(newData, (newVal,oldVal)=>{
      if(oldVal){
        // console.log(parseInt(newVal.no),parseInt(oldVal.no))
        if(parseInt(newVal.no) > parseInt(oldVal.no)) {
          down()
        }
      }
    })
    // 監聽剩餘秒數
    watch(nowSeconds, (newVal,oldVal)=>{
        if(newVal === 0){
            getTime()
            for(let i = 0;i<20;i++){
              animationStatusArr.value[i] = true
            }
            downStatus.value = true
            setTimeout(()=>{
              downStatus.value = false
            },1000)
        }
    })
    // 計算時間
    const getTime = () => {
        const time = new Date();
        let getMinutes = time.getMinutes();
        let getSeconds = time.getSeconds();
        nowSeconds.value = (4-getMinutes%5)*60+(60-getSeconds)
    }
    //pyapi拿獎項資料
    const pyCatchNum = async() => {
      await store.dispatch('pyGet',{getText:t})
      historyData.value = store.state.todayrecord
    }
    //開獎動畫
    const startAnimation = () => {
      for(let i = 0;i<20;i++){
        animationStatusArr.value[i] = true
      }
      for(let i = 0;i<20;i++){
        setTimeout((i) => {
          animationStatusArr.value[i] = false
          // if(i==19){
          //   historyItem.value.scrollTop = 0
          // }
        }, i*500, i)
      }
    }
    //拉手把動畫
    const down = () => {
      startAnimation()
      if(downStatus.value) return false
      downStatus.value = true
      setTimeout(()=>{
        downStatus.value = false
      },1000)
    }
    //轉換格式
    const toStr = (val) => {
      return val.join(' ')
    }
    //初始動作
    const init = () => {
      
      pyCatchNum()
      
      for(let i = 0;i<20;i++){
        animationStatusArr.value.push(false)
      }

      getTime()

      timer2.value = window.setInterval((async() => {
          nowSeconds.value--
      } ), 1000)
    }

    init()

    onMounted(() => {
      timer1.value = window.setInterval((async() => {
        await pyCatchNum()
      } ), 5500)

      // setTimeout(()=>{
      //   startAnimation()
      // },500)
    })

    onBeforeUnmount(() => {
      clearInterval(timer1.value)
      clearInterval(timer2.value)
    })

    return {
      historyItem,
      downStatus,
      drawResult,
      specialPosition,
      animationStatusArr,
      sortData,
      displayTitle,
      displayTime,
      toStr,
    }

  }
}
</script>
<style scoped>
/*手把 外觀與動畫--start*/

@keyframes down {
  0% {
      transform: translateY(0px) scale(1);
  }
  50% {
      transform: translateY(250px) scale(1.5);
  }
  100% {
    transform: translateY(0px) scale(1);
  }
}
@keyframes down2{
  0% {
      height: 200px;
  }
  50% {
      height: 20px;
  }
  100% {
      height: 200px;
  }
}

.bar-enter-active,.bar-leave-active {
  animation: down2 1s linear;
}

.bar-enter-from,.bar-leave-to {
  display: none;
  opacity: 0;
}
.barCircle-enter-active,.bar-leave-active {
  animation: down 1s linear;
}

.barCircle-enter-from,.bar-leave-to {
  display: none;
  opacity: 0;
}
/*手把外觀與動畫--end*/


/*輪盤轉動動畫---start*/
.is-play {
  animation: resultPlay 3s infinite linear;
}

@keyframes resultPlay {
  0% {
    transform: translateY(0%)
  }
  100% {
    transform: translateY(-9000%)
  }
}
/*輪盤轉動動畫---end*/

.slowly{
  animation: slowPlay 1s linear;
}
@keyframes slowPlay {
  0% {
    transform: translateY(-90%)
  }
  100% {
    transform: translateY(0%)
  }
}
</style>
