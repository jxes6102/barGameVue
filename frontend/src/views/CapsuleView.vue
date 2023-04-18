<template>
    <div class="w-[100vw] h-[100vh] bg-yellow-400 flex flex-wrap justify-center items-center">
        <div class="niu_danji absolute w-[100vh] md:w-[640px] h-[100vh] bg-[url('/src/assets/images/background.png')] m-[0_auto] overflow-hidden">
            <!--机器-->
            <div class="game_qu absolute bg-[url('/src/assets/images/game_ndj.png')] bg-no-repeat w-[553px] h-[767px] left-[47px] top-[74px] z-[3]">
                <div class="game_go"></div>
            </div>
            <!--球-->
            <div class="dan_gund">
                <span 
                    v-for="(item,index) in 80" :key="index"
                    :class="'qiu_' + item + ' diaol_' + item + (runBallStatus ? ' wieyi_'+item : '')"
                ></span>
            </div>

            <!--中奖掉落-->
            <div class="medon"><img src="@/assets/images/mendong.png"></div>
            <div class="zjdl " :class="fallStatus ? 'dila_Y' : ''">
                <span :data-content="fallNum" :class="fallStatus ? 'diaL_one' : ''"></span>
            </div>
            
        </div>

        <div class="zonj_zezc" id="jianpin_one" v-show="messageStatus">
            <div class="jpzs aiqiyi tc_anima">
                <em><img src="@/assets//images/close.png" @click="close"></em>
                <h2 id="message" v-html="messageText"></h2>
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
  name: 'HomeView',
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
