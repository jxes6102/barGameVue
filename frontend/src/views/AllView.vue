<template>
    <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center">
        <div class="w-[90vw] h-[100vh] flex flex-wrap justify-center items-center max-w-[1200px]">
            <div class="w-[50%] h-auto flex flex-wrap justify-center items-center gap-y-2">
                <div class="w-[100%] h-auto pl-2 flex flex-wrap justify-start items-center font-extrabold text-base md:text-xl text-red-500">{{ displayTitle }}</div>
                <div 
                    v-for="(item,index) in drawResult" :key="item+index"
                    class="w-[10%] h-auto flex flex-wrap justify-center items-center "
                    >
                    <div class="w-[35px] h-[35px] bg-[#1687a7] rounded-[50%] flex justify-center items-center border-solid border-2 border-[#1687a7] font-bold text-[#fff]">
                        {{ item }}
                    </div>
                </div>
            </div>
            <div class="w-[25%] h-auto flex flex-wrap justify-center items-center gap-y-2">
                <div class="w-[100%] h-auto pl-2 flex flex-wrap justify-center items-center font-extrabold text-base md:text-xl text-red-500">{{ t('time') }}</div>
                <div class="w-[100%] h-auto pl-2 flex flex-wrap justify-center items-center font-extrabold text-base md:text-xl text-red-500">{{ displayTime }}</div>
            </div>
            <div class="w-[25%] h-auto">123</div>
            <!-- 新歷史紀錄 -->
            <div class="w-[800px] h-[60vh] flex flex-wrap justify-center items-center">
                <SmallHistory :tableData="sortData" tableHeight="60vh"></SmallHistory>
            </div>
        </div>
        <!-- 回上頁 -->
        <Back></Back>
        <load v-show="false"></load>
    </div>
</template>

<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref,watch,computed,onMounted,onBeforeUnmount } from 'vue'
import Back from '@/components/Back.vue'
import { useStore } from "vuex"
import load from '@/components/load.vue'
import { useI18n } from 'vue-i18n'
import SmallHistory from '@/components/smallHistory.vue'
export default {
  name: 'allView',
  components: {
    SmallHistory,
    Back,
    load
  },
  setup() {
    /**
     * 
     */
    const { t } = useI18n()
    const store = useStore()
    const isMobiles = computed(() => {
        return store.state.isMobile
    })
    const timer1 = ref(null)
    const timer2 = ref(null)
    const nowSeconds = ref(0)
    const drawData = ref(null)
    const runBallStatus = ref(false)
    const upStatus = ref(false)
    const historyData = computed(() => {
        let target = []
        if(!drawData.value) return target
        for(let key in drawData.value){
            let toSC = drawData.value[key][3]
            if(toSC === '小單') toSC = t('result2')
            else if(toSC === '單') toSC = t('result1')
            else if(toSC === '小雙') toSC = t('result4')
            else if(toSC === '雙') toSC = t('result5')
            else if(toSC === '和') toSC = t('result3')
            target.push({
            no:key,
            reward:drawData.value[key][0].split(' ').filter((item) => item),
            special:drawData.value[key][1],
            sizeDecision:drawData.value[key][2],
            singleDecision:toSC
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
    const drawSpecial = computed(() => {
        if(!newData.value) return []
        return newData.value.special
    })
    const sortData = computed(() => {
        if(!historyData.value) return []
        return JSON.parse(JSON.stringify(historyData.value)).reverse()
    })
    const otherBall = computed(() => {
        if(!drawResult.value.length) return []
        let target = []
        let nowArr = drawResult.value.map((item)=> parseInt(item))
        for(let i = 1;i<=80;i++){
            if(!nowArr.includes(i)){
                target.push(i)
            }
        }
        return target
    })
    const displayTitle = computed(() => {
        if(!newData.value?.no) return 0
        return t('title') + + (parseInt(newData.value.no))
    })
    const displayTime = computed(() => {
        return Math.floor(nowSeconds.value/60)+"分 : "+nowSeconds.value%60 + "秒"
    })
    // 監聽剩餘秒數
    watch(nowSeconds, (newVal,oldVal)=>{
        if(newVal === 0){
            getTime()
            ctrlRunBall(true)
        }
    })
    // 監聽api改變後拉桿
    watch(newData, (newVal,oldVal)=>{
      if(oldVal){
        if(parseInt(newVal.no) > parseInt(oldVal.no)) {
            openReward()
        }
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
        await store.dispatch('pyGet')
        drawData.value = store.state.todayrecord
    }
    //轉換格式
    const toStr = (val) => {
        return val.join(' ')
    }
    //開獎動畫
    const openReward = () => {
        if(upStatus.value) return false
        ctrlRunBall(true)
        setTimeout(function (){
            upStatus.value = true
            setTimeout(function (){
                upStatus.value = false
                ctrlRunBall(false)
            },1500)
        },2000)
    }
    //控制滾球狀態
    const ctrlRunBall = (status = false) => {
        runBallStatus.value = status
    }

    onMounted(() => {
        timer1.value = window.setInterval((async() => {
            await pyCatchNum()
        } ), 5500)

        // setTimeout(function (){
        //     // openReward()
        //     // runBallStatus.value = true
        // },1500)
        
    })

    onBeforeUnmount(() => {
        clearInterval(timer1.value)
        clearInterval(timer2.value)
    })

    //初始動作
    const init = () => {
        getTime()
        pyCatchNum()
        timer2.value = window.setInterval((async() => {
          nowSeconds.value--
        } ), 1000)
    }
    init()

    return {
        displayTitle,
        displayTime,
        drawResult,
        t,
        sortData
    }

  }
}
</script>
<style scoped>
</style>
