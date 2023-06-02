<template>
    <!-- <div>chest123</div> -->
    <div>
        <!-- <el-alert title="warning alert" type="warning" effect="dark" /> -->
        <div  class="w-[100%] text-xs md:text-lg font-bold bg-[#ff165d] text-[#e3eff3]">{{ displayTitle }}</div>
        <div  class="w-[100%] text-xs md:text-lg font-bold bg-[#ff165d] text-[#e3eff3]">{{ displayTime }}</div>
        <div class="relative flex flex-wrap justify-center items-center w-[300px] h-[200px] md:w-[800px] md:h-[450px] bg-no-repeat bg-cover bg-center bg-[url('/src/assets/images/boxbackground.jpg')]">
            <div class="absolute w-auto h-auto flex flex-wrap justify-center items-center">
                <div 
                    v-for="(item,index) in 1" :key="index"
                    :class="'left-['+item*10+'px]'"
                    class="relative bg-[url('/src/assets/images/guan.png')] bg-contain bg-center bg-no-repeat w-[30px] h-[30px] md:w-[80px] md:h-[80px] z-[4] top-0 flex flex-wrap justify-center items-center">
                    <!-- <div v-if="upStatus" class="w-[100%] h-[100%] flex flex-col flex-wrap justify-center items-center">
                        <span
                            v-for="(items,indexs) in 2" :key="indexs"
                            class="z-[5] w-[15px] h-[15px] md:w-[40px] md:h-[40px] rounded-[50%] font-bold text-[white] flex flex-wrap justify-center items-center text-[12px] md:text-lg"
                            :class="(drawResult[index+(indexs)*10] === drawSpecial ? 'ball-2' : 'ball-1') + ' getball_'+(index+(indexs)*10)"
                        >
                            {{ drawResult[index+(indexs)*10] }}
                        </span>
                    </div>
                    <div v-else-if="!runBallStatus && !upStatus" class="w-[100%] h-[100%] flex flex-col flex-wrap justify-center items-center">
                        <span
                            v-for="(items,indexs) in 2" :key="indexs"
                            class="z-[5] w-[15px] h-[15px] md:w-[40px] md:h-[40px] rounded-[50%] font-bold text-[white] flex flex-wrap justify-center items-center text-[12px] md:text-lg"
                            :class="drawResult[index+(indexs)*10] === drawSpecial ? 'ball-2' :  'ball-1'"
                        >
                            {{ drawResult[index+(indexs)*10] }}
                        </span>
                    </div> -->
                </div>
            </div>
            <div class="absolute w-[100%] h-[100%] bottom-[0px] flex flex-wrap justify-center items-end">
                <!-- <div v-if="runBallStatus" class="w-[100%] h-auto flex flex-wrap justify-center items-end">
                    <span
                        v-for="(item,index) in 80" :key="index"
                        class="z-[2] w-[15px] h-[15px] md:w-[40px] md:h-[40px] rounded-[50%] font-bold text-[white] flex flex-wrap justify-center items-center text-[12px] md:text-lg ball-1"
                        :class="(!upStatus) || (otherBall.includes(item) && upStatus)  ? ('wieyi_'+item) : 'opacity-0'"
                    >
                        {{ item }}
                    </span>
                </div>
                <div v-else class="w-[100%] h-auto flex flex-wrap justify-center items-end">
                    <span
                        v-for="(item,index) in otherBall" :key="index"
                        class="z-[2] w-[15px] h-[15px] md:w-[40px] md:h-[40px] rounded-[50%] font-bold text-[white] flex flex-wrap justify-center items-center text-[12px] md:text-lg ball-1"
                        :class="'diaol_' + item"
                    >
                        {{ item }}
                    </span>
                </div> -->
            </div>
            <!-- 滾輪 -->
            <!-- <div class="absolute w-[100%] h-auto top-[15%] md:top-[20%] flex flex-wrap justify-center items-center gap-x-[5px] md:gap-x-[50px]">
                <div 
                    :class="runBallStatus ? 'rotateStyle1' : ''" 
                    class="w-[140px] h-[140px] md:w-[280px] md:h-[280px] bg-[url('/src/assets/images/rotate.png')] bg-contain bg-center bg-no-repeat z-[4]"
                ></div>
                <div 
                    :class="runBallStatus ? 'rotateStyle2' : ''" 
                    class="w-[140px] h-[140px] md:w-[280px] md:h-[280px] bg-[url('/src/assets/images/rotate.png')] bg-contain bg-center bg-no-repeat z-[4]"
                ></div>
            </div> -->
        </div>
    </div>
    
</template>

<script>
// @ is an alias to /src
// import { useRouter } from "vue-router";
export default {
    name: 'chestView',
    components: {
    },
    props: {
        // allData: {
        //     type: Object,
        //     default: {}
        // },
        displayTitle: {
            type: String,
            default: ''
        },
        displayTime: {
            type: String,
            default: ''
        }
    },
    setup() {
    // const router = useRouter()
    
    return {

    }

    }
}
</script>