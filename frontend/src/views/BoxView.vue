<template>
    <div class="w-[100%] h-[100%] overflow-x-hidden overflow-y-auto flex flex-wrap justify-center items-start bg-[url('/src/assets/images/black_backGround.png')] bg-contain bg-center">
      <!-- 主畫面 -->
      <div class="w-[100vw] h-[100vw] md:h-[90vh] flex-col flex flex-wrap justify-center items-center">
        <!-- 開獎訊息 -->
        <div v-if="!isMobiles" class="w-[100%] h-auto flex flex-wrap justify-center items-center z-[13]">
            <div class="w-[100%] text-base md:text-2xl font-bold text-[red]">{{ displayTitle }}</div>
            <div class="w-[100%] text-xs md:text-lg font-bold text-[red]">{{ statistics }}</div>
            <div class="w-[100%] text-xs md:text-lg font-bold text-[red]">{{ displayTime }}</div>
        </div>
        <div class="relative w-[100vw] h-[100vw] md:w-[800px] md:h-[450px] md:top-[0px] bg-cover bg-repeat bg-[url('/src/assets/images/box_fix.png')] md:bg-[url('/src/assets/images/boxbackground.jpg')] rounded-md md:rounded-xl">
            <div v-if="isMobiles" class="absolute w-[100%] h-auto top-[10%] flex flex-wrap justify-center items-center z-[13]">
                <div class="w-[100%] text-base font-bold text-[black]">{{ displayTitle }}</div>
                <div class="w-[100%] text-xs font-bold text-[black]">{{ statistics }}</div>
                <div class="w-[100%] text-xs font-bold text-[black]">{{ displayTime }}</div>
            </div>
            <div class="absolute w-[100%] h-auto top-[calc(10%_+_60px)] md:top-0 flex flex-wrap justify-around items-center">
                <div 
                    v-for="(item,index) in 10" :key="index"
                    class="bg-[url('/src/assets/images/guan.png')] bg-contain bg-center bg-no-repeat w-[30px] h-[30px] md:w-[80px] md:h-[80px] z-[4] flex flex-wrap justify-center items-center">
                    <div v-if="upStatus" class="w-[100%] h-[100%] flex flex-col flex-wrap justify-center items-center">
                        <span
                            v-for="(items,indexs) in 2" :key="indexs"
                            class="z-[5] w-[15px] h-[15px] md:w-[40px] md:h-[40px] rounded-[50%] font-bold text-[white] flex flex-wrap justify-center items-center text-[12px] md:text-lg"
                            :class="(drawResult[index+(indexs)*10] === drawSpecial ? 'ball-2' : 'ball-1') + ' getball_'+(index+(indexs)*10)"
                        >
                            {{ drawResult[index+(indexs)*10] }}
                        </span>
                    </div>
                    <div v-else-if="!runBallStatus && !upStatus" class="w-[100%] h-[100%] flex flex-col flex-wrap justify-center items-center">
                        <span
                            v-for="(items,indexs) in 2" :key="indexs"
                            class="z-[5] w-[15px] h-[15px] md:w-[40px] md:h-[40px] rounded-[50%] font-bold text-[white] flex flex-wrap justify-center items-center text-[12px] md:text-lg"
                            :class="drawResult[index+(indexs)*10] === drawSpecial ? 'ball-2' :  'ball-1'"
                        >
                            {{ drawResult[index+(indexs)*10] }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="absolute w-[100%] h-[100%] bottom-[5%] md:bottom-0 flex flex-wrap justify-center items-end">
                <div v-if="runBallStatus" class="w-[100%] h-auto flex flex-wrap justify-center items-end">
                    <span
                        v-for="(item,index) in 80" :key="index"
                        class="z-[2] w-[5vw] h-[5vw] md:w-[40px] md:h-[40px] rounded-[50%] font-bold text-[white] flex flex-wrap justify-center items-center text-[12px] md:text-lg ball-1"
                        :class="(!upStatus) || (otherBall.includes(item) && upStatus)  ? ('wieyi_'+item) : 'opacity-0'"
                    >
                        {{ item }}
                    </span>
                </div>
                <div v-else class="w-[100%] h-auto flex flex-wrap justify-center items-end">
                    <span
                        v-for="(item,index) in otherBall" :key="index"
                        class="z-[2] w-[5vw] h-[5vw] md:w-[40px] md:h-[40px] rounded-[50%] font-bold text-[white] flex flex-wrap justify-center items-center text-[12px] md:text-lg ball-1"
                        :class="'diaol_' + item"
                    >
                        {{ item }}
                    </span>
                </div>
            </div>
            <!-- 滾輪 -->
            <div class="absolute w-[100%] h-auto top-[40%] md:top-[20%] flex flex-wrap justify-center items-center gap-x-[5px] md:gap-x-[50px]">
                <div 
                    :class="runBallStatus ? 'rotateStyle1' : ''" 
                    class="w-[140px] h-[140px] md:w-[280px] md:h-[280px] bg-[url('/src/assets/images/rotate.png')] bg-contain bg-center bg-no-repeat z-[4]"
                ></div>
                <div 
                    :class="runBallStatus ? 'rotateStyle2' : ''" 
                    class="w-[140px] h-[140px] md:w-[280px] md:h-[280px] bg-[url('/src/assets/images/rotate.png')] bg-contain bg-center bg-no-repeat z-[4]"
                ></div>
            </div>
        </div>
      </div>
      <!-- 新歷史紀錄 -->
      <div class="w-[auto] h-[calc(100vh_-_100vw)] md:h-[50vh] flex flex-wrap justify-center items-center overflow-x-hidden z-[22]">
        <SmallHistory :tableData="sortData" :tableHeight="'calc(100vh-100vw)'"></SmallHistory>
      </div>
      <!-- 回上頁 -->
      <Back></Back>
      <load v-show="!historyData.length"></load>
    </div>
</template>
<script>
// @ is an alias to /src
/*eslint-disable*/
import { ref,computed,onMounted,onBeforeUnmount,watch } from 'vue'
import Back from '@/components/Back.vue'
import SmallHistory from '@/components/smallHistory.vue'
import load from '@/components/load.vue'
import { useStore } from "vuex"
import { useI18n } from 'vue-i18n'
export default {
components: {
    Back,
    SmallHistory,
    load
},
setup() {
    /**
     * timer1 設定timer 1/10s
     * historyData api資料整理
     * newData 最新一筆
     * drawResult 最新一筆號碼
     * sortData 排序後資料
     * nowSeconds 當前剩餘秒數
     * runBallStatus 滾球動畫狀態
     * upStatus 吸球動畫狀態
     * otherBall 除去中獎球陣列
     * displayTitle 期號訊息
     * displayTime 時間訊息
     */
    const { t } = useI18n()
    const store = useStore()
    const timer1 = ref(null)
    const runBallStatus = ref(false)
    const upStatus = ref(false)
    const historyData = ref([])
    const isMobiles = computed(() => {
        return store.state.isMobile
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
    // 監聽剩餘秒數
    watch(nowSeconds, (newVal,oldVal)=>{
        if(newVal === 0){
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
    //pyapi拿獎項資料
    const pyCatchNum = async() => {
        await store.dispatch('pyGet',{getText:t})
        historyData.value = store.state.todayrecord
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
    //初始動作
    const init = () => {
        pyCatchNum()
    }
    init()

    onMounted(() => {
        timer1.value = window.setInterval((async() => {
            await pyCatchNum()
        } ), 3500)

        setTimeout(function (){
            // openReward()
            // runBallStatus.value = true
        },1500)
        
    })

    onBeforeUnmount(() => {
        clearInterval(timer1.value)
    })

    return {
            drawResult,
            historyData,
            sortData,
            runBallStatus,
            upStatus,
            otherBall,
            displayTime,
            displayTitle,
            drawSpecial,
            statistics,
            isMobiles,
            toStr,
        }

    }
}
</script>
<style src="@/assets/css/runBox.css" scoped></style>
<style scoped>
    .ball-1{
        background:radial-gradient(circle at 35% 25%,#9b98f5 0,#716ddd 20%,#4743d0 40%,#1f19bf 90%,#302bc4 95%,#4743d0 100%);
    }
    .ball-2{
        background:radial-gradient(circle at 35% 25%,#f67b7b 0,#df5d5d 20%,#e14d4d 40%,#bb1919 90%,#d32f2f 95%,#e14d4d 100%);
    }
    @keyframes rotates1{
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    @keyframes rotates2{
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(-360deg);
        }
    }
    .rotateStyle1{
        animation: rotates1 1s linear infinite;
    }
    .rotateStyle2{
        animation: rotates2 1s linear infinite;
    }
</style>
