<template>
  <div class="w-[100%] h-[100%] overflow-x-hidden overflow-y-auto flex flex-wrap justify-center items-center bg-[url('/src/assets/images/black_backGround.png')] bg-contain bg-center">
    <!-- 主畫面 -->
    <div class="relative min-h-[320px] h-[auto] md:h-[90vh] w-[100vw] flex-col flex flex-wrap justify-center items-center">
      <!-- 訊息 -->
      <div class="w-full h-auto text-lg font-bold flex flex-wrap justify-center items-center text-red-500">{{ displayTitle }}</div>
      <div class="w-full h-auto text-lg font-bold flex flex-wrap justify-center items-center text-red-500">{{ statistics }}</div>
      <div class="w-full h-auto text-lg font-bold text-red-500">{{ displayTime }}</div>
      <div class="h-[215px] w-[265px] md:w-[685px] md:h-[550px] text-white bg-no-repeat bg-cover bg-center bg-[url('/src/assets/images/slotbackground.png')]">
        <div class="relative flex flex-wrap justify-center items-center top-[45%] left-[18%] md:top-[46%] md:left-[18%] w-[171px] h-[48px] md:w-[440px] md:h-[120px] bg-[#040d26] gap-[1px] md:gap-[5px]">
          <div
            v-for="(item,index) in 20" :key="item+index"
            :class="(specialPosition === index) && !animationStatusArr[index] ? 'bg-rose-800' :'bg-[LightCoral]'"
            class="w-[16px] h-[16px] md:w-[38px] md:h-[38px] border-[gray] border-solid border-[1px] md:border-[2px] rounded-[4px] overflow-hidden"
            >
            <div v-for="(items) in 100" :key="items*2"
              :class="animationStatusArr[index] ? 'is-play' : 'slowly'"
              :id="'result-'+(items-1)">
                <div v-if="items === 1">
                  <div v-for="(num,numIndex) in 3" :key="num*2" class="flex justify-center text-[12px] md:text-[26px]">{{ drawResult[index] ? drawResult[index]-numIndex : '?' }}</div>
                </div>
                <div v-else>
                  <div class="flex justify-center text-[12px] md:text-[26px]">{{items - 1}}</div>
                </div>
            </div>
          </div>
        </div>
      </div>
      <!--拉桿-->
      <div class="absolute scale-[0.5] md:scale-100 h-[400px] w-[40px] bg-[#666] top-[calc(50%-200px)] right-[calc((100%-265px)/2-35px)] md:right-[calc((100%-685px)/2-60px)] cursor-pointer">
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
    <div class="w-[auto] h-[50vh] flex flex-wrap justify-center items-center">
      <SmallHistory :tableData="sortData" :tableHeight="'45vh'"></SmallHistory>
    </div>
    <!-- 回上頁 -->
    <Back></Back>
    <load v-show="!sortData.length"></load>
    <audio
      hidden="true"
      ref="pullbgm"
    >
      <source  src="../assets/music/pullbgm.mp3" type="audio/mpeg">
    </audio>
    <!-- <audio
      loop
      hidden="true"
      ref="rollbgm"
    >
      <source  src="../assets/music/rollbgm.mp3" type="audio/mpeg">
    </audio> -->
  </div>
</template>
<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref,computed,onMounted,onBeforeUnmount,watch } from 'vue'
import Back from '@/components/Back.vue'
import SmallHistory from '@/components/smallHistory.vue'
import load from '@/components/load.vue'
import { useStore } from "vuex"
import { useI18n } from 'vue-i18n'
export default {
  name: 'HomeView',
  components: {
    Back,
    SmallHistory,
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
     * nowSeconds 剩餘秒數
     */
    const { t } = useI18n()
    const store = useStore()
    const animationStatusArr = ref([])
    const historyItem = ref(null)
    const timer1 = ref(null)
    const downStatus = ref(false)
    const historyData = ref([])
    const pullbgm = ref(null)
    // const rollbgm = ref(null)
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
        return (parseInt(newData.value.no)) + t('title')
    })
    const nowSeconds = computed(() => { 
        return store.state.originTime
    })
    const displayTime = computed(() => {
        let target = store.state.originTime
        return t('time') + Math.floor(target/60)+"分 : "+target%60 + "秒"
    })
    const statistics = computed(() => {
        if(!historyData.value) return ''
        return t('rewardLen',{existing:(historyData.value?.length || 0),remain:203-(historyData.value?.length || 0)})
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
            for(let i = 0;i<20;i++){
              animationStatusArr.value[i] = true
            }
            // downStatus.value = true
            // setTimeout(()=>{
            //   downStatus.value = false
            // },1000)
            // rollbgm.value.play()
        }
    })
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
          if(i==19){
            // historyItem.value.scrollTop = 0
            // rollbgm.value.pause()
          }
        }, i*500, i)
      }
    }
    //拉手把動畫
    const down = () => {
      // rollbgm.value.pause()
      pullbgm.value.play()
      // setTimeout(()=>{
      //   rollbgm.value.play()
      // },1000)
      
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

    }

    init()

    onMounted(() => {
      timer1.value = window.setInterval((async() => {
        await pyCatchNum()
      } ), 3500)

      // setTimeout(()=>{
      //   // startAnimation()
      //   // down()
      // },1500)
      
    })

    onBeforeUnmount(() => {
      clearInterval(timer1.value)
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
      pullbgm,
      statistics,
      // rollbgm,
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
