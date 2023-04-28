<template>
    <div class="w-[100vw] h-[100vh] overflow-hidden flex flex-wrap justify-center items-start">
      <!-- 主畫面 -->
      <div class="w-[100vw] h-[75vh] bg-[#FCF4D9] flex flex-wrap justify-center items-center">
        <div class="relative w-[300px] h-[250px] md:w-[800px] md:h-[500px] bg-[#CDFFFF] rounded-md md:rounded-xl">
            <div class="absolute w-auto h-auto flex flex-wrap justify-center items-center">
                <div 
                    v-for="(item,index) in 10" :key="index"
                    :class="'left-['+item*10+'px]'"
                    class="bg-[url('/src/assets/images/guan.png')] bg-contain bg-center bg-no-repeat w-[30px] h-[30px] md:w-[80px] md:h-[80px] z-[4] flex flex-wrap justify-center items-center">
                    <div v-if="upStatus" class="w-[100%] h-[100%] flex flex-col flex-wrap justify-center items-center">
                        <span
                            v-for="(items,indexs) in 2" :key="indexs"
                            class="z-[5] w-[15px] h-[15px] md:w-[40px] md:h-[40px] bg-contain bg-center bg-no-repeat flex flex-wrap justify-center items-center text-[12px] md:text-lg"
                            :class="'ball-' + ((indexs)+2)+ ' getball_'+(index+(indexs)*10)"
                        >
                            {{ drawResult[index+(indexs)*10] }}
                        </span>
                    </div>
                    <div v-else-if="!runBallStatus && !upStatus" class="w-[100%] h-[100%] flex flex-col flex-wrap justify-center items-center">
                        <span
                            v-for="(items,indexs) in 2" :key="indexs"
                            class="z-[5] w-[15px] h-[15px] md:w-[40px] md:h-[40px] bg-contain bg-center bg-no-repeat flex flex-wrap justify-center items-center text-[12px] md:text-lg"
                            :class="'ball-' + ((indexs)+2)"
                        >
                            {{ drawResult[index+(indexs)*10] }}
                        </span>
                    </div>
                </div>
            </div>
            <div class="absolute w-[100%] h-[100%] bottom-[0px] flex flex-wrap justify-center items-end">
                <div v-if="runBallStatus" class="w-[100%] h-auto flex flex-wrap justify-center items-end">
                    <span
                        v-for="(item,index) in 80" :key="index"
                        class="z-[2] w-[15px] h-[15px] md:w-[40px] md:h-[40px] bg-contain bg-center bg-no-repeat flex flex-wrap justify-center items-center text-[12px] md:text-lg"
                        :class="(item <= 50)? ('ball-' + ((item%4)+1) + ' wieyi_'+item) : ''"
                    >
                        {{ item }}
                    </span>
                </div>
                <div v-else class="w-[100%] h-auto flex flex-wrap justify-center items-end">
                    <span
                        v-for="(item,index) in otherBall" :key="index"
                        class="z-[2] w-[15px] h-[15px] md:w-[40px] md:h-[40px] bg-contain bg-center bg-no-repeat flex flex-wrap justify-center items-center text-[12px] md:text-lg"
                        :class="'ball-' + ((item%4)+1)+' diaol_' + item"
                    >
                        {{ item }}
                    </span>
                </div>
            </div>
            <!-- 滾輪 -->
            <div class="absolute w-[100%] h-auto top-[25%] flex flex-wrap justify-center items-center gap-x-[10px] md:gap-x-[50px]">
                <div 
                    :class="runBallStatus ? 'rotateStyle1' : ''" 
                    class="w-[120px] h-[120px] md:w-[250px] md:h-[250px] bg-[url('/src/assets/images/rotate.png')] bg-contain bg-center bg-no-repeat z-[4]"
                ></div>
                <div 
                    :class="runBallStatus ? 'rotateStyle2' : ''" 
                    class="w-[120px] h-[120px] md:w-[250px] md:h-[250px] bg-[url('/src/assets/images/rotate.png')] bg-contain bg-center bg-no-repeat z-[4]"
                ></div>
            </div>
            <!-- 開獎訊息 -->
            <div class="absolute w-[100%] h-auto top-[-45px] md:top-[-60px] flex flex-wrap justify-center items-center ">
                <div class="w-[100%] text-base md:text-2xl font-bold text-[red]">{{ displayTitle }}</div>
                <div class="w-[100%] text-xs md:text-lg font-bold text-[red]">{{ displayTime }}</div>
            </div>
        </div>
      </div>
      <!-- 新歷史紀錄 -->
      <div class="w-[800px] h-[25vh] flex flex-wrap justify-center items-center">
        <SmallHistory :tableData="sortData"></SmallHistory>
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
import { useStore } from "vuex";
export default {
components: {
    Back,
    SmallHistory,
    load
},
setup() {
    /**
     * historyItem 歷史紀錄區塊ref
     * timer1 設定timer 1/10s
     * timer2 扣時timer
     * drawData 原始api資料
     * historyData api資料整理
     * newData 最新一筆
     * drawResult 最新一筆號碼
     * termResult 最新一筆編號
     * specialPosition 最新一筆特別號位置
     * sortData 排序後資料
     * nowSeconds 當前剩餘秒數
     * runBallStatus 滾球動畫狀態
     * upStatus 吸球動畫狀態
     * otherBall 除去中獎球陣列
     * displayTitle 期號訊息
     * displayTime 時間訊息
     */
    const nowSeconds = ref(0)
    const store = useStore();
    const historyItem = ref(null)
    const timer1 = ref(null)
    const timer2 = ref(null)
    const drawData = ref(null)
    const runBallStatus = ref(false)
    const upStatus = ref(false)
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
        if(!newData.value?.no) return ''
        return '台灣賓果 期號: ' + newData.value.no
    })
    const displayTime = computed(() => {
      return '下期開獎時間: ' + Math.floor(nowSeconds.value/60)+":"+nowSeconds.value%60
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
            runBallStatus.value = false
            ctrlRunBall(false)
            upStatus.value = true
            setTimeout(function (){
                upStatus.value = false
            },1000)
        },1000)
    }
    //控制滾球狀態
    const ctrlRunBall = (status = false) => {
        runBallStatus.value = status
    }
    //初始動作
    const init = () => {
        getTime()
        pyCatchNum()
        timer2.value = window.setInterval((async() => {
          nowSeconds.value--
        } ), 1000)
    }
    init()

    onMounted(() => {
        // timer1.value = window.setInterval((async() => {
        //     await pyCatchNum()
        // } ), 5500)

        setTimeout(function (){
            runBallStatus.value = true
        },1500)
        
    })

    onBeforeUnmount(() => {
        clearInterval(timer1.value)
        clearInterval(timer2.value)
    })

    return {
        historyItem,
        drawResult,
        termResult,
        historyData,
        specialPosition,
        sortData,
        newData,
        runBallStatus,
        upStatus,
        otherBall,
        displayTime,
        displayTitle,
        openReward,
        toStr,
        }

    }
}
</script>
<style src="@/assets/css/runBox.css" scoped></style>
<style scoped>
    .ball-1{
        background-image: url('/src/assets/images/canpin_1.png');
    }
    .ball-2{
        background-image: url('/src/assets/images/canpin_2.png');
    }
    .ball-3{
        background-image: url('/src/assets/images/canpin_3.png');
    }
    .ball-4{
        background-image: url('/src/assets/images/canpin_4.png');
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
