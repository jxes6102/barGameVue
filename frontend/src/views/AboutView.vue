<template>
    <div class="w-[100vw] h-[100vh] bg-yellow-400 flex flex-wrap justify-center items-center">
        <div class="absolute flex flex-wrap justify-center items-center w-[100vw] h-[75vh] md:w-[700px] md:h-[100vh] bg-no-repeat bg-contain bg-center bg-[url('/src/assets/images/background.png')]">
            <!-- 機器 -->
            <div class="absolute bg-[url('/src/assets/images/game_ndj.png')] bg-contain bg-center bg-no-repeat w-[100%] h-[85%] z-[3]">
                <div class="absolute w-[20vw] h-[20vw] md:w-[134px] md:h-[134px] top-[53%] left-[40vw] md:top-[53%] md:left-[285px] bg-[url('/src/assets/images/an_go.png')] bg-contain bg-center bg-no-repeat z-[4]"></div>
            </div>
            <!--球-->
            <div class="absolute w-[100%] h-[100%] overflow-hidden rounded-[240px_240px_0px_0px]">
                <span 
                    v-for="(item,index) in 80" :key="index"
                    class="z-[2] w-[40px] h-[40px]"
                    :class="'qiu_' + item + ' diaol_' + item + (runBallStatus ? ' wieyi_'+item : '')"
                ></span>
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

// import axios from 'axios';
export default {
  name: 'about',
  components: {
  },
  setup() {

    return {
    }

  }
}
</script>
