<template>
    <div class="w-[100vw] h-[100vh] overflow-hidden flex flex-wrap justify-center items-start">
      <!-- 主畫面 -->
      <!-- <SmallCapsule :allData="newData"></SmallCapsule> -->

      <div class="w-[100vw] h-[75vh] bg-[#FCF4D9] flex flex-wrap justify-center items-center">
        <div class="relative w-[300px] h-[250px] md:w-[800px] md:h-[500px] bg-[#CDFFFF] rounded-md md:rounded-xl">
            <div class="absolute w-auto h-auto flex flex-wrap justify-center items-center">
                <div 
                    v-for="(item,index) in 10" :key="index"
                    :class="'left-['+item*10+'px]'"
                    class="bg-[url('/src/assets/images/guan.png')] bg-contain bg-center bg-no-repeat w-[30px] h-[30px] md:w-[80px] md:h-[80px] z-[4] flex flex-wrap justify-center items-center">
                    <!-- <div class="w-[100%] h-[100%] flex flex-col flex-wrap justify-center items-center">
                        <span
                            v-for="(item,index) in 2" :key="index"
                            class="z-[5] w-[15px] h-[15px] md:w-[40px] md:h-[40px] bg-contain bg-center bg-no-repeat flex flex-wrap justify-center items-center text-[12px] md:text-lg"
                            :class="'ball-' + ((item%4)+1)"
                        >
                            {{ item*index }}
                        </span>
                    </div> -->
                </div>
            </div>
            <div class="absolute w-[100%] h-[100%] bottom-[0px] flex flex-wrap justify-center items-end">
                <div class="w-[100%] h-auto flex flex-wrap justify-center items-end">
                    <span
                        v-for="(item,index) in 80" :key="index"
                        class="z-[2] w-[15px] h-[15px] md:w-[40px] md:h-[40px] bg-contain bg-center bg-no-repeat flex flex-wrap justify-center items-center text-[12px] md:text-lg"
                        :class="'ball-' + ((item%4)+1) + (runBallStatus && item <= 40 ? ' wieyi_'+item : ' diaol_' + item )"
                    >
                        {{ item }}
                    </span>
                </div>
            </div>
            <!-- 滾輪 -->
            <div class="absolute w-[100%] h-auto top-[25%] flex flex-wrap justify-center items-center gap-x-[10px] md:gap-x-[50px]">
                <div 
                    :class="runBallStatus ? 'rotateStyle' : ''" 
                    class="w-[120px] h-[120px] md:w-[250px] md:h-[250px] bg-[url('/src/assets/images/rotate.png')] bg-contain bg-center bg-no-repeat z-[4]"
                ></div>
                <div 
                    :class="runBallStatus ? 'rotateStyle' : ''" 
                    class="w-[120px] h-[120px] md:w-[250px] md:h-[250px] bg-[url('/src/assets/images/rotate.png')] bg-contain bg-center bg-no-repeat z-[4]"
                ></div>
            </div>
        </div>
      </div>
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
// import SmallCapsule from '@/components/smallCapsule.vue'
import SmallHistory from '@/components/smallHistory.vue'
import { useStore } from "vuex";
export default {
components: {
    Back,
    // SmallCapsule,
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

        setTimeout(function (){
            runBallStatus.value = true
            upStatus.value = true
        },1500)
        
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
        runBallStatus,
        upStatus,
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
    @keyframes rotates{
        0% {
            transform: rotate(0deg);
        }
        100% {
            transform: rotate(360deg);
        }
    }
    .rotateStyle{
        animation: rotates 1s linear infinite;
    }
</style>
