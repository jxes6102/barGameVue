<template>
    <div id="simulate" class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-col justify-center items-center gap-10">
      <!-- <div class="w-[250px] h-[250px] md:w-[650px] md:h-[550px] bg-no-repeat bg-cover bg-center bg-[url('/src/assets/images/slotbackground.png')]">

      </div> -->
      <!-- <el-button
        v-loading.fullscreen.lock="fullscreenLoading"
        type="primary"
        @click="openFullScreen1"
      >
        As a directive
      </el-button>
      <el-button type="primary" @click="openFullScreen2"> As a service </el-button>
      <div :class="strColor" class="w-[10vw] h-[10vh] glass"></div>
      <el-button type="primary" @click="colorGG">change color</el-button>
      <div>きんぎょ这感觉要学过UIUXt{{ t('message') }}</div>
      <div class="w-[60px] md:w-[80px] text-base md:text-2xl bg-[#8ac6d1] rounded-[5px] cursor-pointer hover:opacity-80" @click="changeLang">切換語言</div>
      <div @click="ggtest">gg</div> -->
      <!-- <div class="w-[300px] h-[200px] md:w-[800px] md:h-[450px] bg-cover bg-no-repeat bg-[url('/src/assets/images/boxbackground.jpg')]"></div>
      <input ref="checkItem" type="checkbox" name="vehicle" value="Car"  /> I have a car -->
      <!-- <div>
        <input :type="inputType ? 'password' : 'text'">
      </div> -->
      <!-- <div>
        <input ref="inputType">
      </div> -->
      <!-- <input id="myTextField" value="Text field." /> -->
      <!-- <div class="w-[100vw] h-[100vh] bg-white">
        <div v-html="strAns">
        </div>
      </div> -->

      <div class="">
        <!-- <audio
          controls
          muted
          autoplay
          loop
          ref="musicItem"
        >
          <source  src="../assets/music/pullbgm.mp3" type="audio/mpeg">
        </audio> -->
        <video 
          ref="musicItem" 
          controls
          muted
          autoplay
          loop
          class=""
        >
          <source :src="require('../assets/music/time.mp3')" type="audio/mpeg">
        </video>
      </div>
      <div class="w-auto h-auto p-[10px] bg-amber-300 rounded-md">
        <button @click="playSound">dodo</button>
      </div>
      
    </div>
</template>
<script>
/*eslint-disable*/
// @ is an alias to /src
import { ElLoading } from 'element-plus'
import { ref,computed,onMounted } from 'vue'
import { useRouter } from "vue-router"
import { useI18n } from 'vue-i18n'
import axios from 'axios'
export default {
  name: 'about',
  components: {
  },
  setup() {
    console.log('123qweasdzxc')
    const { t,locale } = useI18n()
    const strColor = ref('red')
    const tableData = ref([
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ])
    const router = useRouter();
    const toLinkBar = () => {
        router.push({ name: "bar" });
    }

    const toLinkCapsule = () => {
        router.push({ name: "capsule" });
    }
    const fullscreenLoading = ref(false)
    const openFullScreen1 = () => {
      fullscreenLoading.value = true
      setTimeout(() => {
        fullscreenLoading.value = false
      }, 2000)
    }

    const openFullScreen2 = () => {
      const loading = ElLoading.service({
        lock: true,
        text: 'Loading',
        background: 'rgba(0, 0, 0, 0.7)',
      })
      setTimeout(() => {
        loading.close()
      }, 2000)
    }
    const colorStyle = computed(() => {
      return 'bg-['+strColor.value+']'
    });
    const colorGG = () => {
      console.log('colorGG')
      if(strColor.value === 'red') {
        strColor.value === 'blue'
      }else {
        strColor.value === 'red'
      }
    }

    const changeLang = () => {
      // console.log('changeLang')
      // locale.value = 'sc'
      // locale.value = 'en'
      locale.value = 'tc'
      console.log(locale.value)
      console.log(t('message'))
    }
    let ggStr = 'size'
    const ggtest = () => {
      console.log('ggtest')
      if(ggStr === 'size') ggStr = 'order'
      else ggStr = 'size'
      axios.post('http://127.0.0.1:5000/getallhistory', {
        sortType: ggStr,
      },{
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded'
        }
      })
      .then(function (response) {
        console.log(response.data.split('\n'));
      })
      .catch(function (error) {
        console.log(error);
      });
    }
    const checkStatus = ref(false)
    const checkItem = ref(null)
    // setTimeout(() => {
    //   // checkItem.value.click()
    //   checkItem.value.checked = true
    //   setTimeout(() => {
    //     checkItem.value.checked = false
    //   }, 2000)
    // }, 2000)

    const str = ref('臺灣南投地方法院民事裁定 111年度司促字第7675號 聲 請 人 即債權人 固德資產管理顧問股份有限公司 法定代理人 王鈺喬 上列債權人聲請對債務人林祐霆發支付命令事件，本院裁定如下 ： 主 文 聲請駁回。 程序費用由債權人負擔。 理 由 一、按督促程序支付命令之送達，應依公示送達為之者，不得行 之，民事訴訟法第509條定有明文。又支付命令之聲請不合 於同法第508條至第511條之規定者，法院應以裁定駁回之， 同法第513條亦有明定。 二、本件債權人聲請對債務人林祐霆發支付命令，惟查債務')
    const strRed = ref('林祐霆')
    const strAns = computed(() => {
      let pattern = new RegExp('('+strRed.value+')', 'gi')
      let target = str.value
      target = target.replace(pattern, '<span style="color:red">'+strRed.value+'</span>');
      return target;
    });

    const inputType = ref(true)
    // const inputType = ref(null)

    const musicItem = ref(null)
    const musicUrl = ref(require('../assets/music/openbgm.mp3'))

    onMounted(() => {
      console.log('musicItem',musicItem.value)
      // musicItem.value.play()
      // setTimeout(function() {
      //   musicItem.value.play()
      // }, 0);
      setTimeout(() => {
        // document.getElementById('simulate').click()
        // musicItem.value.muted = false
        // musicItem.value.play()
        
      }, 2000)
      // window.setInterval((() => {
      //   playSound()
      // } ), 2500)


      // console.log('inputType.value',inputType.value)
      
      // setTimeout(() => {
      //   if(inputType.value.type = 'password') inputType.value.type  = 'text'
      //   else inputType.value.type  = 'password'
      //   console.log('inputType.value',inputType.value.type)
      //   setTimeout(() => {
      //     if(inputType.value.type = 'password') inputType.value.type = 'text'
      //     else inputType.value.type = 'password'
      //     console.log('inputType.value',inputType.value.type)
      //     setTimeout(() => {
      //       if(inputType.value.type = 'password') inputType.value.type = 'text'
      //       else inputType.value.type = 'password'
      //       console.log('inputType.value',inputType.value.type)
      //       setTimeout(() => {
      //         if(inputType.value.type = 'password') inputType.value.type = 'text'
      //         else inputType.value.type = 'password'
      //         console.log('inputType.value',inputType.value.type)
      //       }, 2000)
      //     }, 2000)
      //   }, 2000)
      // }, 2000)

      // setTimeout(() => {
      //   inputType.value = !inputType.value
      //   setTimeout(() => {
      //     inputType.value = !inputType.value
      //     setTimeout(() => {
      //       inputType.value = !inputType.value
      //       setTimeout(() => {
      //         inputType.value = !inputType.value
      //       }, 2000)
      //     }, 2000)
      //   }, 2000)
      // }, 2000)
    })

    let playSoundStatus = false
    const playSound = () => {
      if(playSoundStatus) return false

      playSoundStatus = true
      musicItem.value.currentTime = 20
      musicItem.value.muted = false
      
      setTimeout(() => {
        musicItem.value.muted = true
        playSoundStatus = false
      }, 3000)
      console.log('playSound')
    }
    
    
    return {
        toLinkBar,
        toLinkCapsule,
        tableData,
        fullscreenLoading,
        openFullScreen1,
        openFullScreen2,
        colorGG,
        strColor,
        colorStyle,
        t,
        changeLang,
        ggtest,
        checkStatus,
        checkItem,
        inputType,
        str,
        strAns,
        musicUrl,
        musicItem,
        playSound
    }

  }
}
</script>
<style scoped>
.glass{
  box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
  backdrop-filter: blur( 14px );
  -webkit-backdrop-filter: blur( 14px );
  border-radius: 10px;
  border: 1px solid rgba( 255, 255, 255, 0.18 );
}

mark { 
  background-color: white;
  color: red;
}

.ggg{ 
  background-color: white;
  color: red;
}
</style>
