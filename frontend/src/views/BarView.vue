<template>
  <div class="w-[100%] h-[100%] overflow-x-hidden overflow-y-auto flex flex-col justify-center items-center bg-[url('/src/assets/images/black_backGround.png')] bg-contain bg-center pb-[15vh] md:pb-0">
    <!-- 主畫面 -->
    <div class="relative min-h-[320px] h-[45vh] md:h-[auto] w-[100vw] my-1 md:my-2 flex flex-col justify-center items-center">
      <!-- 訊息 -->
      <div class="relative w-[280px] md:w-[400px] h-auto flex flex-col justify-center items-center border border-solid border-red-800 rounded-md">
        <img class="absolute w-[50px] h-[50px] md:w-[70px] md:h-[70px] left-0" src="@/assets/images/finger-4.png" alt="">
        <img class="absolute w-[50px] h-[50px] md:w-[70px] md:h-[70px] right-0" src="@/assets/images/finger-3.png" alt="">
        <div class="w-auto h-auto text-lg font-bold text-red-500">{{ displayTitle }}</div>
        <div class="w-auto h-auto text-lg font-bold text-red-500">{{ statistics }}</div>
        <div class="w-auto h-auto text-lg font-bold text-red-500">{{ displayTime }}</div>
      </div>
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
      <div class="absolute scale-[0.5] md:scale-100 h-[400px] w-[40px] bg-[#666] top-[calc(50%-200px)] right-0 md:right-[calc((100%-685px)/2-60px)] cursor-pointer">
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
    <div v-if="sortStatus" class="relative w-[90%] h-[auto] md:w-[auto] md:h-[auto] flex flex-wrap justify-center items-center mb-2 py-2 gap-x-2 border-2 border-solid border-red-800 rounded-md">
          <div class="w-[100%] text-base md:text-xl font-extrabold text-red-500">{{ t('sumArea') }}</div>
          <div 
              v-for="(item,index) in areaSumResult" 
              :key="index" 
              class="w-auto flex flex-wrap justify-around items-center">
              <div v-for="(thing,thingIndex) in item.title" :key="thing" class="w-auto flex flex-wrap justify-center items-center">
                  <div class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-[12px] md:text-[14px] text-white ball-color-3">{{ thing }}</div>
                  <div class="text-slate-100 font-black">{{(thingIndex !== item.title.length - 1) ? "+" : "="}}</div>
              </div>
              <div 
                  class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-[12px] md:text-[14px] text-white ball-color-4"
              >{{ item.number }}</div>
          </div>
          <Block :closeStatus="closeStatus" :drawStatus="drawStatus" :type="'all'"></Block>
    </div>
    <!-- 新歷史紀錄 -->
    <div class="w-[auto] h-[40vh] flex flex-wrap justify-center items-center">
      <SmallHistory :tableData="sortData" :tableHeight="'40vh'" @sortEvent="getSort"></SmallHistory>
    </div>
    <div class="w-[100%] my-2 h-auto flex flex-wrap justify-center items-center">
      <el-pagination
          small
          background
          :page-size="50"
          layout="prev, pager, next"
          :total="tableTotal"
          :current-page="page"
          @current-change="currentChange"
          :disabled="false"
      />
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
  </div>
</template>
<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref,computed,onMounted,onBeforeUnmount,watch } from 'vue'
import Back from '@/components/Back.vue'
import SmallHistory from '@/components/smallHistory.vue'
import load from '@/components/load.vue'
import Block from '@/components/Block.vue'
import { useStore } from "vuex"
import { useI18n } from 'vue-i18n'
export default {
  name: 'HomeView',
  components: {
    Back,
    SmallHistory,
    load,
    Block
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
    const page = ref(1)
    const drawStatus = ref(true)
    // let audio = new Audio(require("../assets/music/pullbgm.mp3"))
    const bingoLatest = computed(() => {
        return store.state.bingoLatest
    })
    const musicStatus = computed(() => {
        return store.state.musicStatus
    })
    const newData = computed(() => {
      if(!historyData.value) return {}
      return historyData.value[0]
    })
    const drawResult = computed(() => {
      if(!bingoLatest.value?.openShowOrder) return []
      return bingoLatest.value?.openShowOrder.map((item) => parseInt(item))
    })
    const specialPosition = computed(() => {
      if(!newData.value) return -1
      return newData.value.reward.indexOf(newData.value.special)
    })
    const sortData = computed(() => {
      if(!historyData.value) return []
      return JSON.parse(JSON.stringify(historyData.value))
    })
    const tableTotal = computed(() => {
        return store.state.dataTotal
    })
    const displayTitle = computed(() => {
      if(!bingoLatest.value?.drawTerm) return ''
      return (bingoLatest.value.drawTerm) + t('title') 
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
        return t('rewardLen',{existing:tableTotal.value,remain:203-tableTotal.value})
    })
    const areaSumResult = computed(() => {
        if(!bingoLatest.value?.openShowOrder) return []
        let target = []
        for(let i = 4;(i+2)<bingoLatest.value?.openShowOrder.length;i+=3){
            let sum = bingoLatest.value?.openShowOrder.slice(i-1,i+2).reduce((accumulator, currentValue) => accumulator + parseInt(currentValue),0)
            target.push({
                title:[i,i+1,i+2],
                number:sum
            })
        }
        return target
    })
    const closeStatus = computed(() => {
        return store.state.closeStatus
    })
    const today = computed(() => {
        let now = new Date()
        let nowDate = now.getFullYear() + "-" + (now.getMonth()+1)+"-"+now.getDate()
        return nowDate
    })
    // 監聽api改變後拉桿
    watch(newData, (newVal,oldVal)=>{
      if(oldVal){
        if((parseInt(newVal.no) > parseInt(oldVal.no)) && ((parseInt(newVal.no) - parseInt(oldVal.no)) == 1)) {
          drawStatus.value = true
          down()
        }
      }
    })
    // 監聽剩餘秒數
    watch(nowSeconds, (newVal,oldVal)=>{
        if(newVal === 0){
            drawStatus.value = false
            for(let i = 0;i<20;i++){
              animationStatusArr.value[i] = true
            }
            // downStatus.value = true
            // setTimeout(()=>{
            //   downStatus.value = false
            // },1000)
        }
    })
    const getLatest = async() => {
        await store.dispatch('getLatest')
    }
    //pyapi拿獎項資料
    const pyCatchNum = async() => {

      await store.dispatch('pyGet',{
          getText:t,
          date:today.value,
          page:page.value,
      })

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
          }
        }, i*500, i)
      }
    }
    //拉手把動畫
    const down = () => {
      if(musicStatus.value) {
        pullbgm.value.play()
      }
      // audio.play()
      
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
    const currentChange = (value) => {
        // console.log('value',value)
        page.value = value
        pyCatchNum()
    }
    //初始動作
    const init = () => {
      
      pyCatchNum()
      getLatest()
      
      for(let i = 0;i<20;i++){
        animationStatusArr.value.push(false)
      }

    }

    init()

    const sortStatus = ref(false)
    const getSort = (value) => {
      sortStatus.value = value
    }

    onMounted(() => {
      timer1.value = window.setInterval((async() => {
        await pyCatchNum()
        await getLatest()
      } ), 10000)

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
      areaSumResult,
      closeStatus,
      drawStatus,
      page,
      tableTotal,
      sortStatus,
      getSort,
      currentChange,
      t,
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
  animation: resultPlay 8s infinite linear;
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
.ball-color-3{
  background:radial-gradient(circle at 35% 25%,#fae771 0,#f7e35f 20%,#fce238 40%,#fbdd20 90%,#fcdc12 95%,#ffdf00 100%);
}
.ball-color-4{
  background:radial-gradient(circle at 35% 25%,#51cdc9 0,#3ed3ce 20%,#27aba6 40%,#14938f 90%,#077874 95%,#015856 100%);
}
</style>
