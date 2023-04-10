<template>
  <div class="w-[100vw] h-[100vh] overscroll-x-none">
    <div v-show="false" class="showTime" id="showTimeA"> 
      <div class="showTime-text">開獎時間:</div>
      <div class="showTime-timer" id="showTime-timer"></div>
    </div>
    <div v-show="false" class="countdown" style="visibility: hidden;" id="countdownA"> 
      <div class="countdown-text">開獎倒數計時!!</div>
      <div class="countdown-timer" id="countdown-timer">10</div>
    </div>
    <!-- 主畫面 -->
    <div class="h-auto w-[100vw] flex flex-wrap justify-center items-center">
      <div class="results">
        <div v-for="(item,index) in 20" :key="item+index" class="result">
          <div v-for="(items) in 100" :key="items*2"
            class="result-txt"
            :class="animationStatus ? 'is-play' : ''"
            :id="'result-'+(items-1)">
              <div class="flex justify-center text-[48px]" :ref="setItemRef" v-if="items === 1">{{ drawResult ? drawResult[index] : '?' }}</div>
              <div class="flex justify-center text-[48px]" v-else>{{items - 1}}</div>
          </div>
        </div>
      </div>
    </div>
    <div>{{ drawResult }}</div>
    <!--拉桿-->
    <div class="scale-50 md:scale-100 fixed h-[400px] w-[40px] bg-[#666] top-[50px] left-[85vw] md:left-[90vw] cursor-pointer" @click="down">
      <div
        ref="holdbar" 
        v-show="!downStatus" 
        class="absolute block w-[20px] h-[200px] bg-[#ccc] bottom-1/2 left-0 right-0 rounded-[10px] my-0 mx-auto">
      </div>
      <div 
        ref="hold" 
        v-show="!downStatus" 
        class="absolute w-[80px] h-[80px] bg-[#faa] rounded-[50%] left-[-50%] top-[-10%] shadow-[0_10px_10px_0_#333] cursor-pointer">
      </div> 
      <Transition name="bar">
        <div 
          ref="holdbar"
          v-show="downStatus" 
          class="absolute block w-[20px] h-[200px] bg-[#ccc] bottom-1/2 left-0 right-0 rounded-[10px] my-0 mx-auto">
        </div>
      </Transition>
      <Transition name="barCircle">
        <div 
          ref="hold" 
          v-show="downStatus" 
          class="absolute w-[80px] h-[80px] bg-[#faa] rounded-[50%] left-[-50%] top-[-10%] shadow-[0_10px_10px_0_#333] cursor-pointer">
        </div>
      </Transition>
    </div>
  </div>
</template>
<script>
// @ is an alias to /src
import { ref,onMounted } from 'vue'
export default {
  name: 'HomeView',
  components: {
    // HelloWorld
  },
  setup() {
    let num=[];
    let drawTime;
    let countdown;
    const holdbar = ref(null)
    const hold = ref(null)
    let refArr = ref([])
    const animationStatus = ref(false)
    const ansStatus = ref(false)
    const drawResult = ref(null)
    // console.log('dd')

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
          console.log('in fetch',res.data[0])
          drawResult.value = res.data[0].drawResult.split(',')
          console.log('drawResult',drawResult.value)
        }
      }).catch((error) => {
        console.error("Error:", error)
      })
    }

    getNum()

    const setItemRef = el => {
        if (el) {
          refArr.value.push(el)
        }
    }
    // //開獎動畫
    const startAnimation = () => {
      if(animationStatus.value) return false
      getNum()
      animationStatus.value = true
      setTimeout(() => {
        animationStatus.value = false
      }, 2000);
      // //輪盤轉動
      // for (var j = 0; j <20; j++){
      //     document.getElementById('result-'+j).classList.add('is-play');
      //     document.getElementById(`result-${j}`).style.transform = 'none';
      // }
      // //停止動畫
      // for (let i = 0; i < 20; i++) {
      //   setTimeout((i) => {
      //     document.getElementById('result-'+i).classList.remove('is-play');
      //     document.getElementById(`result-${i}`).style.transform = `translateY(${num[i]*-1}%)`;
      //   }, i*1000, i);
      // }
    }

    //拉手把動畫
    const downStatus = ref(false)
    const down = () => {
      startAnimation()
      if(downStatus.value) return false
      downStatus.value = true
      setTimeout(()=>{
        downStatus.value = false
      },1000)
    }

    onMounted(() => {
      //api 連接--start
      const xhr = new XMLHttpRequest();
      xhr.open('GET', 'https://globalcaipiaokong.com/api/trial/draw-result?code=twklb&rows=1');
      xhr.send();

      xhr.onreadystatechange = function() {
        if (xhr.readyState === 4 && xhr.status === 200) {
          const response = JSON.parse(xhr.responseText);
          //拿取開獎號碼
          num=response.data[0].drawResult.split(',').map(Number);
          console.log(num)
          //拿取開獎時間
          drawTime = response.data[0].endTime;
          
          drawTime = new Date(drawTime);

          countdown=new Date(drawTime.getTime() + 7 * 60 * 1000+3*1000);
          console.log("倒數動畫播放時間:",countdown);
          var hours = countdown.getHours();
          var minutes = countdown.getMinutes();
          var timeString = hours.toString().padStart(2, '0') + ':' + minutes.toString().padStart(2, '0');

          // 獲取要更新的 DOM 元素，並將時間字符串設置為其內容
          var timeElement = document.getElementById('showTime-timer');
          timeElement.innerHTML = timeString;//印在網頁上

          console.log("預計開獎時間:",timeString)
          drawTime=new Date(drawTime.getTime() + 7 * 60 * 1000+15*1000);
          console.log("實際開獎時間:",drawTime);
        }
      };
      //api 連接--end
      //列出ref
      // refArr.value.forEach((item)=> {
      //   console.log('item',item)
      // })
      console.log('refArr',refArr.value)
      // refArr.value[4].innerText = 'sad'
    })

    return {
      holdbar,
      hold,
      downStatus,
      down,
      setItemRef,
      refArr,
      animationStatus,
      ansStatus,
      drawResult
    }

  }
}
</script>
<style scoped>
.results {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  align-items: center;
  height: 500px;
  width: 900px;
  color: #fff;
}

.result {
  width: 70px;
  height: 70px;
  background-color: gray;
  margin-right: 20px;
  border-radius: 4px;
  border: 2px solid gray;
  overflow: hidden;
  background: LightCoral;
}

/*手把 外觀與動畫--start*/

@keyframes down {
  0% {
      transform: translateY(0px) scale(1);
  }

  100% {
      transform: translateY(250px) scale(1.5);
  }
}
@keyframes down2{
  0% {
      height: 200px;
  }

  100% {
      height: 20px;
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

/*倒數--start*/
.countdown {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  height: 10px;
}

.countdown-text {
  font-size: 24px;
  margin-bottom: 10px;
}

.countdown-timer {
  font-size: 64px;
  font-weight: bold;
  color: red;
  animation-name: countdown-animation;
  animation-duration: 1s ;
  animation-timing-function: linear;
  animation-iteration-count: 11;
}

@keyframes countdown-animation {
  from {
    transform: scale(1);
  }
  to {
    transform: scale(0);
  }
}
/*倒數--end*/

/*開獎時間的位置*/
.showTime {
  display: flex;
  justify-content: center; /* 將容器內元素水平置中 */
  align-items: center; /* 將容器內元素垂直置中 */
  height: 20vh; /* 設定容器高度，讓元素在頁面中央 */
  visibility: visible;
}

/*開獎時間的位置--end*/
</style>
