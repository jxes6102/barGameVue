<template>
    <div class="scale-[0.85] w-[100vw] h-[100%] flex flex-wrap justify-center items-center">
        <div class="absolute flex flex-wrap justify-center items-center w-[100vw] h-[100vh] md:w-[700px] md:h-[900px] bg-no-repeat bg-cover bg-center bg-[url('/src/assets/images/background.png')]">
            <!-- 機器 -->
            <div class="md:scale-[0.65] absolute bg-[url('/src/assets/images/game_ndj.png')] bg-contain bg-center bg-no-repeat w-[280px] h-[400px] md:w-[700px] md:h-[700px] z-[3]">
                <!-- 訊息 -->
                <div class="absolute top-[-50px] md:top-[-150px] md:left-[5%] w-[280px] md:w-[90%] h-[100px] md:h-[200px] bg-[#f3f1b0] rounded-lg shadow-2xl flex flex-wrap justify-center items-center z-[11]">
                    <div class="w-[100%] h-1/4 font-extrabold text-base md:text-4xl text-red-500 flex flex-wrap justify-center items-center">{{ displayTitle }}</div>
                    <div class="w-[100%] h-1/4 font-extrabold text-xs md:text-2xl text-red-500 flex flex-wrap justify-center items-center">{{ displayTime }}</div>
                    <div class="w-[100%] h-1/2 px-[10px] md:px-[60px] font-extrabold text-xs md:text-2xl text-red-500 flex flex-wrap justify-center items-center">
                        <div v-for="(item,index) in messageText" :key="index" class="w-[10%] h-auto">{{ item }}</div>
                    </div>
                </div>
                <!-- go標誌 -->
                <div class="absolute w-[70px] h-[70px] md:w-[124px] md:h-[124px] top-[53%] left-[105px] md:left-[290px] bg-[url('/src/assets/images/an_go.png')] bg-contain bg-center bg-no-repeat z-[4]"></div>
                <!--球-->
                <div class="absolute w-[260px] h-[230px] md:w-[450px] md:h-[405px] top-[0px] left-[10px]  md:left-[120px] overflow-hidden rounded-[240px_240px_0px_0px] ">
                    <span
                        v-for="(item,index) in 80" :key="index"
                        class="z-[2] w-[20px] h-[20px] md:w-[35px] md:h-[35px] base_ball"
                        :class="'qiu_' + item + ' diaol_' + item + (runBallStatus ? ' wieyi_'+item : '')"
                    >{{ item }}</span>
                </div>
                <!-- 滾輪 -->
                <div 
                    :class="runBallStatus ? 'rotateStyle' : ''" 
                    class="absolute w-[100px] h-[100px] md:w-[180px] md:h-[180px] top-[25%] left-[calc(50%-50px)] md:left-[calc(50%-90px)] bg-[url('/src/assets/images/rotate.png')] bg-contain bg-center bg-no-repeat z-[4]"
                ></div>
                <!--出口-->
                <div class="absolute w-[80px] h-[80px] left-[100px] top-[325px] md:w-[136px] md:h-[138px] md:left-[285px] md:top-[580px] z-[1]"><img src="@/assets/images/mendong.png"></div>
                <!--掉落物-->
                <div v-show="fallStatus" class="absolute w-[130px] h-[110px] left-[85px] top-[325px] md:left-[290px] md:top-[610px] z-[2] flex flex-wrap justify-center items-center" :class="fallStatus ? 'dila_Y' : ''">
                    <span :data-content="fallNum" :class="fallStatus ? 'diaL_one' : ''">{{ fallNum }}</span>
                </div>
            </div>
        </div>
    </div>
    <load v-show="!messageText.length"></load>
</template>

<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref,computed,onMounted,watch,onBeforeUnmount } from 'vue'
import load from '@/components/load.vue'
import { useI18n } from 'vue-i18n'
import { useStore } from "vuex"
export default {
  name: 'capsuleComponent',
  components: {
    load
  },
  props: {
    allData: {
        type: Object,
        default: {}
    }
  },
  setup(props) {
    /**
     * fallTimes 掉球次數
     * runBallStatus 滾球動畫狀態
     * messageText 號碼訊息
     * fallNum  掉落數字
     * fallStatus 掉落動畫狀態
     * nowSeconds 剩餘秒數
     * displayTitle 期數
     * drawData 開獎資料
     * displayTitle 顯示期數訊息
     * displayTime 顯示時間訊息
     */
    const store = useStore()
    const { t } = useI18n()
    let fallTimes = 0
    const runBallStatus = ref(false)
    const messageText = ref('')
    const fallNum = ref('')
    const fallStatus = ref(false)
    const displayTitle = computed(() => {
        return (parseInt(drawData.value.no)) + t('title')
    })
    const displayTime = computed(() => {
        let target = store.state.originTime
        return t('time') + Math.floor(target/60)+"分 : "+target%60 + "秒"
    })
    const nowSeconds = computed(() => { 
        return store.state.originTime
    })
    const drawData = computed(() => {
        return props.allData
    });
    //監聽開獎資料改變
    watch(drawData, (newVal,oldVal)=>{
        if(oldVal && (JSON.stringify(oldVal) !== '{}')){
            if(parseInt(newVal.no) > parseInt(oldVal.no)) {
                play()
            }
        }else if(JSON.stringify(oldVal) === '{}'){
            messageText.value = newVal.reward
        }
    })
    //監聽秒數改變
    watch(nowSeconds, (newVal,oldVal)=>{
        if(newVal === 0){
            controlRunBall(true)
        }
    })

    //掉球動作
    const fallBall = () => {
        if(fallTimes<20){
            controlRunBall(true)
            setTimeout(function (){
                // 掉球
                messageText.value = drawData.value.reward.slice(0,fallTimes+1)
                fallNum.value = drawData.value.reward[fallTimes]
                fallStatus.value = true
                setTimeout(function (){
                    // 收球
                    fallStatus.value = false
                    fallTimes++
                    fallBall()
                },150)
            },50)
        }else {
            controlRunBall(false)
        }
    }
    // 控制滾球動畫
    let controlRunBall = (status = false) => {
        runBallStatus.value = status
    }
    // 開獎動作
    const play = () => {
        fallTimes = 0
        // 掉球和結果動畫
        fallBall()
    }
    //初始動作
    const init = async() => {
    }
    init()

    onMounted(() => {
        // setTimeout(function (){
        //     // play()
        //     // controlRunBall(true)
        // },2500)
    })
    onBeforeUnmount(() => {
    })

    return {
        runBallStatus,
        messageText,
        fallNum,
        fallStatus,
        displayTitle,
        displayTime,
    }

  }
}
</script>
<style src="@/assets/css/testBall.css" scoped></style>
<style src="@/assets/css/run.css" scoped></style>
<style src="@/assets/css/style.css" scoped></style>
<style scoped>
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