<template>
  <div class="home">
    <div v-show="false" class="showTime" id="showTimeA"> 
      <div class="showTime-text">開獎時間:</div>
      <div class="showTime-timer" id="showTime-timer"></div>
    </div>
    <div v-show="false" class="countdown" style="visibility: hidden;" id="countdownA"> 
      <div class="countdown-text">開獎倒數計時!!</div>
      <div class="countdown-timer" id="countdown-timer">10</div>
    </div>
    <div class="results r-1">
      <div v-for="(item,index) in 10" :key="item+index" class="result">
        <div v-for="(items) in 100" :key="items*2" class="result-txt" :id="'result-'+(items-1)">
            <div class="result-item" v-if="items === 1">?</div>
            <div class="result-item" v-else>{{items - 1}}</div>
        </div>
      </div>
    </div>
    <div class="results r-2">
      <div v-for="(item,index) in 10" :key="item+index" class="result">
        <div v-for="(items) in 100" :key="items*2" class="result-txt" :id="'result-'+(items-1)">
          <div class="result-item" v-if="items === 1">?</div>
          <div class="result-item" v-else>{{items - 1}}</div>
        </div>
      </div>
    </div> 
     <!--拉桿-->
    <div class="relative h-[400px] w-[40px] bg-[#666] top-[50px] left-[calc(100vw_-_90px)] cursor-pointer" @click="down">
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
// import {testa,getNum} from '../api/getNum'
import { ref,onMounted } from 'vue'
export default {
  name: 'HomeView',
  components: {
    // HelloWorld
  },
  setup() {
    // console.log('dd')
    // console.log('testa',testa())
    // console.log('getNum',getNum())
    let num=[];
    let drawTime;
    let countdown;
    const holdbar = ref(null)
    const hold = ref(null)
    // //開獎動畫
    // const startAnimation = () => {
    //   //輪盤轉動
    //   for (var j = 0; j <20; j++){
    //       document.getElementById(`result-${j}`).classList.add('is-play');
    //       document.getElementById(`result-${j}`).style.transform = 'none';
    //   }
    //   //停止動畫
    //   for (let i = 0; i < 20; i++) {
    //     setTimeout((i) => {
    //       document.getElementById(`result-${i}`).classList.remove('is-play');
    //       document.getElementById(`result-${i}`).style.transform = `translateY(${num[i]*-1}%)`;
    //     }, i*1000, i);
    //   }
    // }

    //拉手把動畫
    const downStatus = ref(false)
    const down = () => {
      // startAnimation()
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


      // //畫面初始化
      // //抓到最外層的div
      // var results = document.querySelector(".r-1");
      // //產生20個第2層div
      // for (let i = 0; i < 20; i++) {
      //   if (i>9){
      //     results=document.querySelector(".r-2");
      //     // console.log('results',results)
      //   }
      //   const newDiv = document.createElement("div");
      //   newDiv.classList.add("result");
      //   //產生1個第3層div
      //   const newindrDiv = document.createElement("div");
      //   newindrDiv.classList.add("result-txt");
      //   newindrDiv.id="result-"+i
      //   //產生10個第四層div
      //   for (let k = 0; k < 100; k++) {
      //     const newSubDiv = document.createElement("div");
      //     newSubDiv.classList.add("result-item");
      //     //第一個放問號
      //     if (k==0){
      //       newSubDiv.textContent = "?";
      //       newindrDiv.appendChild(newSubDiv);
      //     }
      //     //之後放數字，放到9
      //     else{
      //       newSubDiv.textContent = `${k}`;
      //       newindrDiv.appendChild(newSubDiv);
      //     }
      //   }
      //   newDiv.appendChild(newindrDiv);
      //   // console.log('results',results)
      //   // console.log('newDiv',newDiv)
      //   results.appendChild(newDiv);
      // }

    })

    return {
      holdbar,
      hold,
      downStatus,
      down
    }

  }
}
</script>
<style scoped>
.home{
  width: 100vw;
  height: 100vh;
  overscroll-behavior-x: none;
}
.results {
  display: flex;
  justify-content: center;
  align-items: center;
  height: 100vh;
  color: #fff;
}
/*強行換位置--start*/
.r-1{
  position: absolute;
  top: 25%;
  left: 50%;
  transform: translate(-50%, -50%);
}
.r-2{
  position: absolute;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
}
/*強行換位置--end*/

.result {
  width: 70px;
  height: 70px;
  background-color: gray;
  margin-right: 20px;
  border-radius: 4px;
  border: 2px solid gray;
  overflow: hidden;
}
.result-txt {
  background: linear-gradient(LightCoral, Gold, LightSkyBlue, LightCoral);
}

.result-item {
  font-size: 48px;
  display: flex;
  justify-content: center;
  line-height: 70px;
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
  animation: resultPlay 1s infinite linear;
}

@keyframes resultPlay {
  100% {
    transform: translateY(-90%)
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
