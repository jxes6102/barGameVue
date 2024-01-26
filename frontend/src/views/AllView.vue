<template>
    <div class="w-[100%] h-[100vh] overflow-x-hidden overflow-y-auto bg-[#fcfce5] flex flex-wrap justify-center items-center pb-[15vh] md:pb-0">
        <div class="relative w-[100%] h-[12%] md:h-[15%] bg-[#ffdf00] flex justify-center items-center">
            <img class="absolute left-1 w-[75px] h-[60px] md:w-[100px] md:h-[80px]" src="@/assets/images/lottery.png">
            <div class="text-base md:text-4xl text-white">{{ t("lotteryName") }}</div>
            <div class="absolute right-0 md:right-[10vw] w-[auto] h-auto flex flex-wrap justify-center items-center">
                <!-- <div class="w-[auto] h-[auto]">{{t('choseDay')}} </div> -->
                <div v-if="isMobiles" class="dayPick w-[auto] h-[auto] flex flex-wrap justify-center items-center">
                    <el-date-picker
                        v-model="dayData"
                        popper-class="custom-date-picker"
                        type="date"
                        placeholder="選擇查詢日期"
                        :disabled-date="disabledDate"
                        :disabled="false"
                        :editable="false"
                        style="width: 110px;font-size: 12px;"
                    />
                </div>
                <div v-else class="dayPick w-[auto] h-[auto] flex flex-wrap justify-center items-center">
                    <el-date-picker
                        v-model="dayData"
                        type="date"
                        placeholder="選擇查詢日期"
                        :disabled-date="disabledDate"
                        :disabled="false"
                        :editable="false"
                        style="width: 170px;font-size: 16px;"
                    />
                </div>
            </div>
        </div>
        <div class="w-[100vw] h-[88%] md:h-[85%] flex flex-col justify-start items-start md:items-center max-w-[1000px] gap-y-2">
            <div class="w-[100%] h-auto flex flex-wrap justify-center items-center gap-y-4 md:gap-y-2">
                <div class="relative w-[100%] md:w-[50%] h-auto flex flex-wrap justify-center md:justify-center items-center gap-y-4 md:gap-y-2">
                    <div class="relative w-[100%] h-auto flex flex-wrap justify-center items-center gap-x-2">
                        <div class="w-auto h-auto font-extrabold text-base md:text-xl text-red-500">{{ displayTitle }}</div>
                        <div class="w-auto h-auto font-extrabold text-xs md:text-sm text-red-500">{{ statistics}}</div>
                    </div>
                    <div class="w-[250px] md:w-[380px] h-auto flex flex-wrap justify-center md:justify-center items-center gap-[2px]">
                        <div 
                            v-for="(item,index) in bingoLatest.openShowOrder" :key="index"
                            :class="(item===bingoLatest.prizeNum.bullEye) ? 'ball-color-2' : 'ball-color-1'"
                            class="w-[22px] h-[22px] md:w-[35px] md:h-[35px] rounded-[50%] flex justify-center items-center text-xs md:text-base font-bold text-white"
                        >{{ item }}</div>
                    </div>
                    <Block :closeStatus="closeStatus" :drawStatus="drawStatus" :type="'all'"></Block>
                </div>
                <div class="relative w-[100%] md:w-[50%] h-auto flex flex-wrap justify-center items-center gap-y-2">
                    <div class="w-[100%] h-auto flex flex-wrap justify-center items-center gap-x-2">
                        <div class="w-auto h-auto flex flex-wrap justify-center items-center font-extrabold text-sm md:text-xl text-red-500">{{ t('time') }}</div>
                        <div class="w-[30%] md:w-[50%] px-2">
                            <el-progress status="warning" :percentage="timePercentage" :show-text="false" />
                        </div>
                        <div class="w-[auto] h-auto flex flex-wrap justify-center items-center font-extrabold text-sm md:text-base text-red-500">{{ displayTime }}</div>
                        <Block :closeStatus="closeStatus" :drawStatus="drawStatus" :type="'only'"></Block>
                    </div>
                    <div class="w-[100%] h-auto flex flex-wrap justify-center items-center gap-1">
                        <Music />
                        <div
                            v-for="(item,index) in gameList"
                            :key="index"
                            @click="ctrlGame(item.key)"
                            class="w-auto bg-[#8ac6d1] px-1 py-1 rounded-[5px] flex flex-wrap justify-center items-center cursor-pointer hover:opacity-80"
                        >
                            <el-icon size="20"><VideoPlay /></el-icon>
                            <div class="flex flex-wrap justify-center items-center text-base">{{ item.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-auto h-[auto] md:top-0 flex flex-wrap justify-center items-center gap-y-2 md:min-h-[60vh]">
                <!-- <div class="relative w-[100%] h-auto flex flex-wrap justify-center items-center gap-x-2">
                    <div class="w-[100%] text-base md:text-xl font-extrabold text-red-500">{{ t('sumArea') }}</div>
                    <div 
                        v-for="(item,index) in areaSumResult" 
                        :key="index" 
                        class="w-auto flex flex-wrap justify-around items-center">
                        <div v-for="(thing,thingIndex) in item.title" :key="thing" class="w-auto flex flex-wrap justify-center items-center">
                            <div class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-[12px] md:text-[14px] text-white ball-color-3">{{ thing }}</div>
                            <div class="font-black">{{(thingIndex !== item.title.length - 1) ? "+" : "="}}</div>
                        </div>
                        <div 
                            class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-[12px] md:text-[14px] text-white ball-color-4"
                        >{{ item.number }}</div>
                    </div>
                    <Block :closeStatus="closeStatus" :drawStatus="drawStatus" :type="'all'"></Block>
                </div> -->
                <el-table v-if="isMobiles" :data="tableData" max-height="45vh" style="width:100vw;font-size:10px;">
                    <el-table-column prop="time" width="55" :label="t('openTime')"/>
                    <el-table-column sortable prop="no" :label="t('no')" width="85"/>
                    <el-table-column prop="reward" width="260">
                        <template #header>
                            <div class="flex flex-wrap justify-start items-center">
                                <div>{{t('reward')}}</div>
                                <div class="mx-1">
                                    <button @click="doSort"
                                        :class="mode == 1 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                                        class="transition-all mx-1 px-1 rounded">{{t('sizeSort')}}</button>
                                    <button @click="disableSort"
                                        :class="mode == 2 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                                        class="transition-all mx-1 px-1 rounded">{{t('openSort')}}</button>
                                    <button @click="sumSort"
                                        :class="mode == 3 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                                        class="transition-all mx-1 px-1 rounded">{{t('sum')}}</button>
                                    <button @click="seatSort"
                                        :class="mode == 4 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                                        class="transition-all mx-1 px-1 rounded">{{t('position')}}</button>
                                </div>
                            </div>
                        </template>
                        <template #default="scope">
                            <div class="flex flex-wrap justify-start items-center gap-x-[0.5px]">
                                <template v-if="mode == 1">
                                    <div 
                                        v-for="(item,index) in scope.row.rewardSort" :key="index"
                                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-1"
                                    >{{ item }}</div>
                                </template>
                                <template v-else-if="mode == 2">
                                    <div 
                                        v-for="(item,index) in scope.row.reward" :key="index"
                                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-1"
                                    >{{ item }}</div>
                                </template>
                                <template v-else-if="mode == 3">
                                    <div 
                                        v-for="(item,index) in scope.row.areaSum"
                                            :key="index" 
                                            class="w-auto m-[1px] flex flex-wrap justify-around items-center">
                                            <div v-for="(thing,thingIndex) in item.title" :key="thing" class="w-auto flex flex-wrap justify-center items-center">
                                                <div class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-3">{{ thing }}</div>
                                                <div class="font-black">{{(thingIndex !== item.title.length - 1) ? "+" : "="}}</div>
                                            </div>
                                        <div 
                                            class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-4"
                                        >{{ item.number }}</div>
                                    </div>
                                </template>
                                <template v-else-if="mode == 4">
                                    <div 
                                        v-for="(item,index) in scope.row.seatRank"
                                        :key="index"
                                        class="w-auto m-[1px] flex flex-wrap justify-around items-center">
                                        <div class="w-auto m-[1px] flex flex-wrap justify-around items-center">
                                            <div class="p-[2px] rounded-md bg-[#ff8c00] text-white">{{ '第'+(index+1)+'名' }}</div>
                                            <div class="p-[2px] rounded-md text-black">{{ item.position }}</div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="(mode == 1) || (mode == 2)" prop="special" width="60" :label="t('specialNum')">
                        <template #default="scope">
                            <div class="flex flex-wrap justify-center items-center gap-x-0.5">
                                <div class="w-[20px] h-[20px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-2">{{ scope.row.special }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="(mode == 1) || (mode == 2)" prop="decision" :label="t('singleDecision')" width="50"/>
                </el-table>
                <el-table v-else :data="tableData" max-height="60vh" style="width:auto;">
                    <el-table-column prop="time" width="60" :label="t('openTime')"/>
                    <el-table-column sortable prop="no" :label="t('no')" width="100"/>
                    <el-table-column prop="reward" :width="((mode == 1) || (mode == 2)) ? 570 : 700">
                        <template #header>
                            <div class="flex flex-wrap justify-start items-center">
                                <div>{{t('reward')}}</div>
                                <div class="mx-1">
                                    <button @click="doSort"
                                        :class="mode == 1 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                                        class="transition-all mx-1 px-1 rounded">{{t('sizeSort')}}</button>
                                    <button @click="disableSort"
                                        :class="mode == 2 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                                        class="transition-all mx-1 px-1 rounded">{{t('openSort')}}</button>
                                    <button @click="sumSort"
                                        :class="mode == 3 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                                        class="transition-all mx-1 px-1 rounded">{{t('sum')}}</button>
                                    <button @click="seatSort"
                                        :class="mode == 4 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                                        class="transition-all mx-1 px-1 rounded">{{t('position')}}</button>
                                </div>
                            </div>
                        </template>
                        <template #default="scope">
                            <div class="flex flex-wrap justify-start items-center gap-x-0.5">
                                <template v-if="mode == 1">
                                    <div 
                                        v-for="(item,index) in scope.row.rewardSort" :key="index"
                                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-1"
                                    >{{ item }}</div>
                                </template>
                                <template v-else-if="mode == 2">
                                    <div 
                                        v-for="(item,index) in scope.row.reward" :key="index"
                                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-1"
                                    >{{ item }}</div>
                                </template>
                                <template v-else-if="mode == 3">
                                    <div 
                                        v-for="(item,index) in scope.row.areaSum"
                                            :key="index" 
                                            class="w-auto m-[1px] flex flex-wrap justify-around items-center">
                                            <div v-for="(thing,thingIndex) in item.title" :key="thing" class="w-auto flex flex-wrap justify-center items-center">
                                                <div class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-3">{{ thing }}</div>
                                                <div class="font-black">{{(thingIndex !== item.title.length - 1) ? "+" : "="}}</div>
                                            </div>
                                        <div 
                                            class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-4"
                                        >{{ item.number }}</div>
                                    </div>
                                </template>
                                <template v-else-if="mode == 4">
                                    <div 
                                        v-for="(item,index) in scope.row.seatRank"
                                        :key="index"
                                        class="w-auto m-1 flex flex-wrap justify-around items-center">
                                        <div class="w-auto m-1 flex flex-wrap justify-around items-center">
                                            <div class="p-[2px] rounded-md bg-[#ff8c00] text-white">{{ '第'+(index+1)+'名' }}</div>
                                            <div class="p-[2px] rounded-md text-black">{{ item.position }}</div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="(mode == 1) || (mode == 2)" prop="special" width="70" :label="t('specialNum')">
                        <template #default="scope">
                            <div class="flex flex-wrap justify-center items-center gap-x-0.5">
                                <div class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-2">{{ scope.row.special }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column v-if="(mode == 1) || (mode == 2)" prop="decision" width="60" :label="t('singleDecision')"/>
                </el-table>
                <div class="w-[100%] my-2 h-auto flex flex-wrap justify-center items-center">
                    <el-pagination
                        small
                        background
                        :page-size="50"
                        layout="prev, pager, next"
                        :total="tableTotal"
                        :current-page="page"
                        @current-change="currentChange"
                        :disabled="false"
                    />
                </div>
            </div>
        </div>
        <!-- 回上頁 -->
        <!-- <Back></Back> -->
        <load v-show="displayTitle === 0"></load>
        <!-- <div v-if="openStatus" class="absolute w-full h-full flex flex-wrap justify-center items-center">
            <div
                @click="ctrlGame('')"
                class="fixed w-full h-full left-0 top-0 bg-slate-800 z-[111] opacity-50 flex flex-wrap justify-center items-center"
            ></div>
            <div class="w-auto h-auto bg-[white] z-[122] flex flex-wrap justify-center items-center">
                <component :is="openStatus" :allData="newData" :displayTitle="displayTitle" :displayTime="displayTime"></component>
            </div>
        </div> -->
        <audio
            hidden="true"
            ref="openbgm"
            >
            <source  src="../assets/music/openbgm.mp3" type="audio/mpeg">
        </audio>
    </div>
</template>

<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref,watch,computed,onMounted,onBeforeUnmount } from 'vue'
import { useStore } from "vuex"
import load from '@/components/load.vue'
import { useI18n } from 'vue-i18n'
import Block from '@/components/Block.vue'
import Music from '@/components/music.vue'
// import SmallHistory from '@/components/smallHistory.vue'
// import Back from '@/components/Back.vue'
// import bar from '@/components/bar.vue'
// import capsule from '@/components/capsule.vue'
// import chest from '@/components/chest.vue'
import { useRouter } from "vue-router"
export default {
  name: 'allView',
  components: {
    load,
    Block,
    Music,
    // SmallHistory,
    // Back,
    // bar,
    // capsule,
    // chest
  },
  setup() {
    /**
     * 
     */
    console.log('load test 15')
    const { t } = useI18n()
    const store = useStore()
    const musicStatus = computed(() => {
        return store.state.musicStatus
    })
    const isMobiles = computed(() => {
        return store.state.isMobile
    })
    const closeStatus = computed(() => {
        return store.state.closeStatus
    })
    const gameList = ref([
        {name:t('game1'),key:'bar'},
        // {name:t('game2'),key:'capsule'},
        // {name:t('game3'),key:'chest'},
    ])
    const openbgm = ref(null)
    const sortStatus = ref(false)
    const apiLoading = ref(false)
    const timer1 = ref(null)
    const dayData = ref(null)
    const page = ref(1)
    const todayData = ref(null)
    // let audio = new Audio(require("../assets/music/openbgm.mp3"))
    const newData = computed(() => {
        if(!todayData.value) return {}
        return todayData.value[0]
    })
    // const drawResult = computed(() => {
    //     if(!newData.value?.reward) return []
    //     return newData.value.reward
    // })
    const areaSumResult = computed(() => {
        if(!bingoLatest.value?.openShowOrder) return []
        let target = []
        for(let i = 4;(i+2)<bingoLatest.value?.openShowOrder.length;i+=3){
            let sum = bingoLatest.value?.openShowOrder.slice(i-1,i+2).reduce((accumulator, currentValue) => accumulator + parseInt(currentValue),0)
            target.push({
                title:[i,i+1,i+2],
                number:sum
            })
        }
        return target
    })
    const historyData = ref(null)
    const tableData = computed(() => {
        let target = []
        if(!todayData.value) return target
        target = todayData.value
        for(let i = 0;i<target.length;i++){
            target[i].areaSum = dealSum(target[i].rewardSort)
            target[i].seatRank = dealSeat(target[i].reward)
        }

        return target
    })
    const displayTitle = computed(() => {
        if(!bingoLatest.value?.drawTerm) return 0
        return (bingoLatest.value.drawTerm) + t('title') 
    })
    const statistics = computed(() => {
        if(!tableData.value) return ''

        if(isToday.value){
            return t('rewardLen',{existing:tableTotal.value,remain:203-tableTotal.value})
        }

        return ''
    })
    const isToday = computed(() => {
        let choseDate = dayData.value.getMonth()+1+"/"+dayData.value.getDate()
        let now = new Date()
        let nowDate = now.getMonth()+1+"/"+now.getDate()
        return (choseDate===nowDate)
    })
    const nowSeconds = computed(() => { 
        return store.state.originTime
    })
    const timePercentage = computed(() => {
        return 100 - Math.floor(store.state.originTime/3 )
    })
    const displayTime = computed(() => {
        let target = store.state.originTime
        return Math.floor(target/60)+"分 : "+target%60 + "秒"
    })
    const drawStatus = ref(true)
    const tableTotal = computed(() => {
        return store.state.dataTotal
    })
    const bingoLatest = computed(() => {
        return store.state.bingoLatest
    })
    // 監聽api改變
    watch(newData, async(newVal,oldVal)=>{
      if(oldVal){
        if(!newVal?.no || !oldVal.no) return false
        if((parseInt(newVal.no) > parseInt(oldVal.no)) && (isToday.value)) {
            await getLatest()
            if(musicStatus.value) {
                openbgm.value.play()
            }
            // audio.play()
            drawStatus.value = true
        }
      }
    })
    // 監聽剩餘秒數
    watch(nowSeconds, (newVal,oldVal)=>{
        if(newVal === 0){
            drawStatus.value = false
        }
    })
    //監聽日期改變
    watch(dayData, async(newVal,oldVal)=>{
        // await getHistory()
        page.value = 1
        await pyCatchNum()
    })
    const getLatest = async() => {
        await store.dispatch('getLatest')
    }
    //pyapi拿今天獎項資料
    const pyCatchNum = async() => {
        if(apiLoading.value){
            return false
        }
        apiLoading.value = true
        // console.log('dayData.value',dayData.value)
        // console.log('newVal',newVal.getFullYear(),newVal.getMonth()+1,newVal.getDate())
        let dateStr = dayData.value.getFullYear() + '-' 
        + (((dayData.value.getMonth()+1) < 10) ? '0' + (dayData.value.getMonth()+1) : (dayData.value.getMonth()+1))
        + '-' + dayData.value.getDate()
        
        await store.dispatch('pyGet',{
            getText:t,
            date:dateStr,
            page:page.value,
        })
        
        todayData.value = store.state.todayrecord
        // console.log('todayData.value',todayData.value)
        apiLoading.value = false
    }
    //拿除了今天獎項資料
    // const getHistory = async(nowpage = 1) => {
    //     if(apiLoading.value) return false
    //     apiLoading.value = true
    //     let date = dayData.value.getFullYear()+'-'+(dayData.value.getMonth()+1)+'-'+dayData.value.getDate()
    //     // let startTime = dayData.value.getFullYear()+'-'+(dayData.value.getMonth()+1)+'-'+dayData.value.getDate()+'%2000:00:00'
    //     // let endTime = dayData.value.getFullYear()+'-'+(dayData.value.getMonth()+1)+'-'+dayData.value.getDate()+'%2023:59:59'
    //     await store.dispatch('getOtherHistory',{day:date})
    //     page.value = 0
    //     historyData.value = store.state.allrecord
    //     apiLoading.value = false
    // }

    onMounted(() => {
        timer1.value = window.setInterval((async() => {
            if(isToday.value){
                await pyCatchNum()
            }else{
                await getLatest()
            }
        } ), 10000)

        // setTimeout(function (){
        // },5500)

    })

    onBeforeUnmount(() => {
        clearInterval(timer1.value)
    })

    //初始動作
    const init = () => {
        let date = new Date()
        date.setDate(date.getDate())
        dayData.value = date
        
        pyCatchNum()
        getLatest()
    }
    init()

    const currentChange = (value) => {
        // console.log('value',value)
        page.value = value
        pyCatchNum()
    }

    //設定選擇日期範圍
    const disabledDate = (time) => {
        return (time.getTime() > Date.now()) || (time.getTime() < (Date.now() - 2592000000))
    }

    const orderStatus = ref(false)
    const openStatus = ref('')
    const router = useRouter();
    const ctrlGame = (name) => {
        // openStatus.value = name
        if(name === 'chest'){
            router.push({ name: "boxView" });
        }else if(name === 'bar'){
            router.push({ name: "bar" });
        }else if(name === 'capsule'){
            router.push({ name: "capsule" });
        }
        
    }
    /*
    *1大小 2開獎 3加總 4位置排名 
    */
    const mode = ref(1)
    const doSort = () => {
        mode.value = 1
        sortStatus.value = true
    }

    const disableSort = () => {
        mode.value = 2
        sortStatus.value = false
    }

    const sumSort = () => {
        mode.value = 3
        // console.log('sumSort')
    }

    const seatSort = () => {
        mode.value = 4
        // console.log('seatSort')
    }

    const dealSum = (arr) => {
        // console.log('arr',arr)
        let temp = arr.map((item)=>parseInt(item))
        let target = []
        
        for(let i = 4;(i+2)<temp.length;i+=3){
            let sum = temp.slice(i-1,i+2).reduce((accumulator, currentValue) => accumulator + currentValue,0)
            target.push({
                title:[i,i+1,i+2],
                number:sum
            })
        }

        return target
    }

    const dealSeat = (arr) => {
        let temp = arr.map((item)=>parseInt(item))
        let target = []
        for(let i = 0;i<10;i++){
            target.push({
                position:i+1,
                sum:temp[i]+temp[19-i],
                ball:temp[i]
            })
        }
        
        target.sort((a,b)=>{
            if(b.sum == a.sum){
                return b.ball-a.ball
            }else{
                return b.sum-a.sum
            }
        })
        return target
    }

    return {
        displayTitle,
        displayTime,
        isMobiles,
        apiLoading,
        dayData,
        tableData,
        gameList,
        drawStatus,
        tableTotal,
        statistics,
        timePercentage,
        areaSumResult,
        closeStatus,
        openbgm,
        page,
        bingoLatest,
        sortStatus,
        mode,
        seatSort,
        sumSort,
        disableSort,
        doSort,
        ctrlGame,
        t,
        currentChange,
        disabledDate,
    }

  }
}
</script>
<style scoped>
.ball-color-1{
  background:radial-gradient(circle at 35% 25%,#9b98f5 0,#716ddd 20%,#4743d0 40%,#1f19bf 90%,#302bc4 95%,#4743d0 100%);
}
.ball-color-2{
  background:radial-gradient(circle at 35% 25%,#f67b7b 0,#df5d5d 20%,#e14d4d 40%,#bb1919 90%,#d32f2f 95%,#e14d4d 100%);
}
.ball-color-3{
  background:radial-gradient(circle at 35% 25%,#fae771 0,#f7e35f 20%,#fce238 40%,#fbdd20 90%,#fcdc12 95%,#ffdf00 100%);
}
.ball-color-4{
  background:radial-gradient(circle at 35% 25%,#51cdc9 0,#3ed3ce 20%,#27aba6 40%,#14938f 90%,#077874 95%,#015856 100%);
}

.dayPick:deep .el-input__wrapper{
    background-color:#fdecbd
}
</style>