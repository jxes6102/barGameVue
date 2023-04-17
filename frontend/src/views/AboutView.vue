<template>
    <div class="w-[100vw] h-[100vh] bg-yellow-400 flex flex-wrap justify-center items-center">
        <div class="absolute flex flex-wrap justify-center items-center w-[100vw] h-[75vh] md:w-[700px] md:h-[80vh] bg-no-repeat bg-contain bg-center bg-[url('/src/assets/images/background.png')]">
            <div class="absolute bg-[url('/src/assets/images/game_ndj.png')] bg-contain bg-center bg-no-repeat w-[100%] h-[100%] z-[3]">
                <!-- <div class="game_go"></div> -->
            </div>
        </div>
    </div>
    <!-- width:134px; 
	height:134px; 
	position:absolute; 
	left:210px; 
	bottom:225px;
	background:url(../images/an_go.png) no-repeat; 
	font-size:18px; 
	color:#fff; 
	text-align:center;  -->
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
