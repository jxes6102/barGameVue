<template>
    <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center">
        <div class="absolute flex flex-wrap justify-center items-center w-[100vw] h-[75vh] md:w-[700px] md:h-[100vh] bg-no-repeat bg-contain bg-center bg-[url('/src/assets/images/background.png')]">
            <!-- 機器 -->
            <div class="absolute bg-[url('/src/assets/images/game_ndj.png')] bg-contain bg-center bg-no-repeat w-[280px] h-[400px] md:w-[700px] md:h-[700px] z-[3]">
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
            <!--號碼訊息-->
            <div
                class="absolute w-[270px] h-[270px] md:w-[500px] md:h-[500px] left-[calc(50%-135px)] top-[calc(50%-135px)] md:left-[calc(50%-250px)] md:top-[calc(50%-250px)] z-[4] flex flex-wrap justify-center items-center" 
                id="jianpin_one" v-show="messageStatus"
            >
                <div class="tc_anima absolute w-[250px] h-[175px] md:w-[450px] md:h-[286px] rounded-[10px] bg-[#fff] py-2">
                    <em class="absolute h-[95px] right-0 top-[-40px] md:top-[-50px]">
                        <img src="@/assets/images/close.png" @click="close">
                    </em>
                    <h2 
                        class="text-[22px] md:text-[38px] text-[#ff1a4b] text-center leading-[40px] md:leading-[60px] flex flex-wrap justify-center items-center break-all"
                        id="message" 
                        v-html="messageText"
                    >
                    </h2>
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
import { ref,onMounted,onBeforeUnmount } from 'vue'
// import axios from 'axios';
export default {
  name: 'capsule',
  components: {
  },
  setup() {
    let drawResult = ref('')
    let cycleNo = 0
    let openStatus = true
    let fallTimes = 0
    let messageArr = ref([])
    let runBallStatus = ref(false)
    let timeout8 = ref(null)
    let messageStatus = ref(false)
    let messageText = ref('')
    let fallNum = ref('')
    let fallStatus = ref(false)

    // 拿開獎數字
    const getNum = async() => {
        await fetch('https://globalcaipiaokong.com/api/trial/draw-result?code=twklb&rows=1', {
            headers: {
                'content-type': 'application/json' // 這一欄一定要設定！
            },
            method: 'GET',
        })
        .then(response => response.json()) // 輸出成 json
        .then(res => {

            if(res.msg === '成功') {
                if(cycleNo === res.data[0].cycleNo) {
                    openStatus = false
                }else{
                    cycleNo = res.data[0].cycleNo
                    openStatus = true
                }
                
                drawResult.value = res.data[0].drawResult
                messageArr.value = res.data[0].drawResult.split(',')
            }

        }).catch((error) => {
            console.error("Error:", error)
        })
    }
    //掉球動作
    const fallBall = () => {
        if(fallTimes<20){
            setTimeout(function (){
                // 掉球
                let text = messageArr.value.slice(0,fallTimes+1).join(',')
                controlMessage(true,text,cycleNo)

                fallNum.value = drawResult.value.split(',')[fallTimes]
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
    //控制開獎視窗
    const controlMessage = (status = false,text = '',title = '') => {
        messageStatus.value = status
        if(title) {
            messageText.value = '編號'+title+":"+"<br>"+text
        } else {
            messageText.value = text
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
    // 關閉獎項視窗
    const close = () => {
        messageStatus.value = false
    }
    //初始動作
    const init = async() => {
        await getNum()
    }
    init()

    onMounted(() => {
        setTimeout(function (){
            controlMessage(true,drawResult.value,cycleNo)
        },1500)

        timeout8.value = window.setInterval((async() => {
            await getNum()
            if(openStatus) {
                controlRunBall(true)
                play()
            }
        } ), 10000)
    })

    onBeforeUnmount(() => {
        clearInterval(timeout8.value)
    })

    return {
        runBallStatus,
        messageStatus,
        messageText,
        fallNum,
        fallStatus,
        close
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