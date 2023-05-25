<template>
    <!-- <div>capsule</div> -->
        <div class="relative flex flex-wrap justify-center items-center w-[290px] h-[450px] md:w-[500px] md:h-[700px] bg-no-repeat bg-cover bg-center bg-[url('/src/assets/images/background.png')]">
            <div class="absolute bg-[url('/src/assets/images/game_ndj.png')] bg-contain bg-center bg-no-repeat top-[5%] w-[100%] h-[70%] z-[3]">

                <div class="absolute w-[55px] h-[55px] md:w-[90px] md:h-[90px] top-[53%] left-[41%] bg-[url('/src/assets/images/an_go.png')] bg-contain bg-center bg-no-repeat z-[4]"></div>

                <div class=" absolute w-[70%] h-[58%] md:w-[65%] md:h-[58%] top-0 left-[15%] md:left-[17%] overflow-hidden rounded-[200px_200px_0px_0px] ">
                    <span
                        v-for="(item,index) in 80" :key="index"
                        class="base_ball"
                        :class="item <= 80 ? 'qiu_' + item + ' diaol_' + item : ''"
                    >{{ item }}</span>
                </div>
                <!-- <div class="bg-white absolute w-[63%] h-[58%] top-0 left-[18%] overflow-hidden rounded-[200px_200px_0px_0px] ">
                    <span
                        v-for="(item,index) in 80" :key="index"
                        class="base_ball"
                        :class="'qiu_' + item + ' diaol_' + item + (runBallStatus ? ' wieyi_'+item : '')"
                    >{{ item }}</span>
                </div> -->

                <div
                    :class="runBallStatus ? 'rotateStyle' : ''" 
                    class="absolute w-[80px] h-[80px] md:w-[160px] md:h-[160px] top-[25%] md:top-[20%] left-[calc(50%-40px)] md:left-[calc(50%-80px)] bg-[url('/src/assets/images/rotate.png')] bg-contain bg-center bg-no-repeat z-[4]"
                ></div>

                <div class="absolute w-[65px] h-[65px] md:w-[90px] md:h-[90px] left-[40%] top-[81%] md:top-[84%] z-[1]"><img src="@/assets/images/mendong.png"></div>

                <!-- <div v-show="fallStatus" class="absolute w-[130px] h-[110px] left-[85px] top-[325px] md:left-[290px] md:top-[610px] z-[2] flex flex-wrap justify-center items-center" :class="fallStatus ? 'dila_Y' : ''">
                    <span :data-content="fallNum" :class="fallStatus ? 'diaL_one' : ''">{{ fallNum }}</span>
                </div> -->
            </div>
            <div class="absolute top-[10px] md:top-[20px] w-[80%] h-auto bg-[#f3f1b0] rounded-lg shadow-2xl flex flex-wrap justify-center items-center z-[11]">
                <div class="w-[100%] h-auto font-extrabold text-[14px] md:text-xl text-red-500 flex flex-wrap justify-center items-center ">{{ displayTitle }}</div>
                <div class="w-[100%] h-auto font-extrabold text-[12px] md:text-lg text-red-500 flex flex-wrap justify-center items-center">{{ t('time') + displayTime }}</div>
                <div class="w-[100%] h-1/2 px-[10px] md:px-[60px] font-extrabold text-[12px] md:text-lg text-red-500 flex flex-wrap justify-center items-center">
                    <div v-for="(item,index) in drawData.reward" :key="index" class="w-[10%] h-auto">{{ item }}</div>
                </div>
            </div>
        </div>
</template>

<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref,computed,onMounted,watch,onBeforeUnmount } from 'vue'
import load from '@/components/load.vue'
import { useI18n } from 'vue-i18n'
export default {
  name: 'capsuleView',
  components: {
    load
  },
  props: {
    allData: {
        type: Object,
        default: {}
    },
    displayTitle: {
        type: String,
        default: ''
    },
    displayTime: {
        type: String,
        default: ''
    }
  },
  setup(props) {
    /**
     * fallTimes 掉球次數
     * runBallStatus 滾球動畫狀態
     * messageText 號碼訊息
     * fallNum  掉落數字
     * fallStatus 掉落動畫狀態
     * timer1 扣時timer
     * displayTitle 期數
     * drawData 開獎資料
     * displayTitle 顯示期數訊息
     * displayTime 顯示時間訊息
     */
    const { t } = useI18n()
    let fallTimes = 0
    const runBallStatus = ref(false)
    const messageText = ref('')
    const fallNum = ref('')
    const fallStatus = ref(false)

    const drawData = computed(() => {
        // console.log('props.allData',props.allData)
        return props.allData
    });
    //監聽開獎資料改變
    watch(drawData, (newVal,oldVal)=>{
        if(oldVal && (JSON.stringify(oldVal) !== '{}')){
            if(parseInt(newVal.no) > parseInt(oldVal.no)) {
                play()
                getTime()
            }
        }else if(JSON.stringify(oldVal) === '{}'){
            messageText.value = newVal.reward
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
        getTime()

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
        drawData,
        t
    }

  }
}
</script>
<style src="@/assets/css/gameBall.css" scoped></style>
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
