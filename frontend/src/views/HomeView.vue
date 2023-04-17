<template>
  <div class="w-[100vw] h-[100vh] overflow-hidden flex flex-wrap justify-center items-start">
    <div class="w-auto h-auto my-2 text-lg font-bold">{{ '編號: ' + termResult }}</div>
    <!-- 主畫面 -->
    <div class="h-auto w-[100vw] flex flex-wrap justify-center items-center">
      <div class="flex flex-wrap justify-center items-center h-[300px] w-[250px] md:h-[400px] md:w-[800px] text-white">
        <div
          v-for="(item,index) in 20" :key="item+index"
          :class="(specialPosition === index) && !animationStatusArr[index] ? 'bg-rose-800' :'bg-[LightCoral]'"
          class="w-[40px] h-[40px] md:w-[70px] md:h-[70px] mr-[10px] md:mr-[10px] border-[gray] border-solid  border-[2px] rounded-[4px] overflow-hidden"
          >
          <div v-for="(items) in 100" :key="items*2"
            class="result-txt"
            :class="animationStatusArr[index] ? 'is-play' : ''"
            :id="'result-'+(items-1)">
              <div class="flex justify-center text-[30px] md:text-[48px]" v-if="items === 1">{{ drawResult ? drawResult[index] : '?' }}</div>
              <div class="flex justify-center text-[30px] md:text-[48px]" v-else>{{items - 1}}</div>
          </div>
        </div>
      </div>
    </div>
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
    <!--拉桿-->
    <div class="scale-[0.5] md:scale-100 fixed h-[400px] w-[40px] bg-[#666] top-[20vh] md:top-[25vh] left-[85vw] md:left-[90vw] cursor-pointer">
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
</template>
<script>
// @ is an alias to /src
import { ref,computed,onMounted,onBeforeUnmount,watch } from 'vue'
import axios from 'axios';
export default {
  name: 'HomeView',
  components: {
    // HelloWorld
  },
  setup() {
    /**
     * historyItem 歷史紀錄區塊ref
     * timer1 設定timer 1/10s
     * animationStatusArr 數字動畫狀態
     * downStatus 拉桿動畫狀態
     * drawData 原始api資料
     * historyData api資料整理
     * newData 最新一筆
     * drawResult 最新一筆號碼
     * termResult 最新一筆編號
     * specialPosition 最新一筆特別號位置
     * sortData 排序後資料
     */
    const animationStatusArr = ref([])
    const historyItem = ref(null)
    const timer1 = ref(null)
    const drawData = ref(null)
    const downStatus = ref(false)
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
    watch(newData, (newVal,oldVal)=>{
      if(oldVal){
        // console.log(parseInt(newVal.no),parseInt(oldVal.no))
        if(parseInt(newVal.no) > parseInt(oldVal.no)) {
          down()
        }
      }
    })
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

      axios.get('https://e9af-114-46-175-180.ngrok-free.app/gethistory')
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
      downStatus,
      drawResult,
      termResult,
      historyData,
      specialPosition,
      animationStatusArr,
      sortData,
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
.is-play.result-txt {
  animation: resultPlay 2s infinite linear;
}

@keyframes resultPlay {
  100% {
    transform: translateY(-9000%)
  }
}
/*輪盤轉動動畫---end*/
</style>
