<template>
    <div class="scale-[0.55] w-[100vw] h-[55vh] flex flex-wrap justify-center items-center">
        <div class="absolute flex flex-wrap justify-center items-center w-[100vw] h-[100vh] md:w-[700px] md:h-[100vh] bg-no-repeat bg-cover bg-center bg-[url('/src/assets/images/background.png')]">
            <!-- 機器 -->
            <div class="md:scale-[0.65] absolute bg-[url('/src/assets/images/game_ndj.png')] bg-contain bg-center bg-no-repeat w-[280px] h-[400px] md:w-[700px] md:h-[700px] z-[3]">
                <!-- 訊息 -->
                <div class="absolute top-[-100px] md:top-[-200px] md:left-[5%] w-[280px] md:w-[90%] h-8 md:h-16 bg-[#f3f1b0] rounded-lg shadow-2xl flex flex-wrap justify-center items-center font-extrabold text-base md:text-4xl text-red-500">
                    {{ displayTitle }}
                </div>
                <div class="absolute py-[5px] md:px-[60px] top-[-65px] md:top-[-120px] md:left-[5%] w-[280px] md:w-[90%] h-auto bg-[#f3f1b0] rounded-lg shadow-2xl flex flex-wrap justify-center items-center font-bold text-[12px] md:text-2xl break-all text-red-500">
                    {{ displayTime }}
                </div>
                <div class="absolute px-[10px] md:px-[60px] top-[-30px] md:top-[-60px] md:left-[5%] w-[280px] md:w-[90%] h-16 md:h-24 bg-[#f3f1b0] rounded-lg shadow-2xl flex flex-wrap justify-center items-center font-bold text-[12px] md:text-2xl break-all text-red-500">
                    {{ messageText }}
                </div>
                <!-- go標誌 -->
                <div class="absolute w-[70px] h-[70px] md:w-[124px] md:h-[124px] top-[53%] left-[105px] md:left-[290px] bg-[url('/src/assets/images/an_go.png')] bg-contain bg-center bg-no-repeat z-[4]"></div>
                <!--球-->
                <div class="absolute w-[260px] h-[230px] md:w-[450px] md:h-[405px] top-[0px] left-[10px]  md:left-[120px] overflow-hidden rounded-[240px_240px_0px_0px] ">
                    <span
                        v-for="(item,index) in 80" :key="index"
                        class="z-[2] w-[20px] h-[20px] md:w-[35px] md:h-[35px]"
                        :class="'qiu_' + item + ' diaol_' + item + (runBallStatus ? ' wieyi_'+item : '')"
                    ></span>
                </div>
                <!-- 滾輪 -->
                <div 
                    :class="runBallStatus ? 'rotateStyle' : ''" 
                    class="absolute w-[100px] h-[100px] md:w-[180px] md:h-[180px] top-[25%] left-[calc(50%-50px)] md:left-[calc(50%-90px)] bg-[url('/src/assets/images/rotate.png')] bg-contain bg-center bg-no-repeat z-[4]"
                ></div>
                <!--出口-->
                <div class="absolute w-[80px] h-[80px] left-[100px] top-[325px] md:w-[136px] md:h-[138px] md:left-[285px] md:top-[580px] z-[1]"><img src="@/assets/images/mendong.png"></div>
                <!--掉落物-->
                <div class="absolute w-[130px] h-[110px]  left-[85px] top-[325px] md:left-[290px] md:top-[610px] z-[2] flex flex-wrap justify-center items-center" :class="fallStatus ? 'dila_Y' : ''">
                    <span :data-content="fallNum" :class="fallStatus ? 'diaL_one' : ''"></span>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
/*eslint-disable*/
// @ is an alias to /src
import '@/assets/css/ball.css'
import '@/assets/css/run.css'
import '@/assets/css/style.css'
import { ref,computed,onMounted,watch,onBeforeUnmount } from 'vue'
// import axios from 'axios';
export default {
  name: 'capsuleComponent',
  components: {
  },
  props: {
    allData: {
        type: Object,
        default: {}
    }
  },
  setup(props) {
    let fallTimes = 0
    let runBallStatus = ref(false)
    let messageText = ref('')
    let fallNum = ref('')
    let fallStatus = ref(false)
    let nowSeconds = ref(0)
    let timer1 = ref(null)
    const displayTitle = computed(() => {
        return '台灣賓果 期號: ' + drawData.value.no
    })
    const displayTime = computed(() => {
        return '下期開獎時間: ' + Math.floor(nowSeconds.value/60)+":"+nowSeconds.value%60
    })
    const drawData = computed(() => {
        return props.allData
    });
    watch(drawData, (newVal,oldVal)=>{
        if(oldVal && (JSON.stringify(oldVal) !== '{}')){
            if(parseInt(newVal.no) > parseInt(oldVal.no)) {
                console.log('change',newVal)
                play()
                getTime()
            }else{
                controlMessage(drawData.value.reward.join(' , '))
            }
        }
    })
    watch(nowSeconds, (newVal,oldVal)=>{
        if(newVal === 0){
            getTime()
            controlRunBall(true)
        }
    })

    //掉球動作
    const fallBall = () => {
        if(fallTimes<20){
            // controlRunBall(true)
            setTimeout(function (){
                // 掉球
                let text = drawData.value.reward.slice(0,fallTimes+1).join(' , ')
                controlMessage(text)

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
    //控制開獎訊息
    const controlMessage = (text = '') => {
        messageText.value = text
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
    const getTime = () => {
        const time = new Date();
        let getMinutes = time.getMinutes();
        let getSeconds = time.getSeconds();
        nowSeconds.value = (4-getMinutes%5)*60+(60-getSeconds)
    }
    //初始動作
    const init = async() => {
        getTime()

        timer1.value = window.setInterval((async() => {
            nowSeconds.value--
        } ), 1000)
    }
    init()

    onMounted(() => {
        setTimeout(function (){
            // play()
            // controlRunBall(true)
        },2500)
    })
    onBeforeUnmount(() => {
      clearInterval(timer1.value)
    })

    return {
        runBallStatus,
        messageText,
        fallNum,
        fallStatus,
        displayTitle,
        drawData,
        displayTime,
    }

  }
}
</script>
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