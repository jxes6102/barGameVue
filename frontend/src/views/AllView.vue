<template>
    <div class="w-[100%] h-full overflow-x-hidden overflow-y-auto bg-[#fcfce5] flex flex-wrap justify-center items-center pb-[15vh] md:pb-0">
        <div class="relative w-[100%] h-[12vh] md:h-[15vh] bg-[#ffdf00] flex justify-center items-center">
            <img class="absolute left-1 w-[12vh] h-[12vh] md:w-[15vh] md:h-[15vh]" src="@/assets/images/lottery-3.png">
            <div class="flex flex-col justify-center items-center">
                <div class="text-base md:text-4xl text-white">{{ t("lotteryName") }}</div>
                <div class="text-xs md:text-2xl text-red-700">{{ t("lotteryTitle") }}</div>
            </div>
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
        <div class="w-[100vw] h-full flex flex-col justify-start items-start md:items-center max-w-[1000px] gap-y-2">
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
            <div class="w-auto h-[auto] md:top-0 flex flex-wrap justify-center items-center gap-y-2">
                <div class="relative w-[100%] h-auto my-2 flex flex-wrap justify-center items-center gap-x-2">
                    <div class="w-[100%] text-base md:text-xl font-extrabold text-red-500">
                        {{ ((mode == 1) || (mode == 3)) ? t('sumArea') : t('sumSortArea') }}
                    </div>
                    <template v-if="((mode == 1) || (mode == 3))">
                        <div 
                            v-for="(item,index) in areaSumResult" 
                            :key="index" 
                            class="w-auto my-1 flex flex-wrap justify-around items-center">
                            <div v-for="(thing,thingIndex) in item.title" :key="thing" class="w-auto flex flex-wrap justify-center items-center">
                                <div class="w-[25px] h-[25px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-[12px] md:text-[14px] text-white ball-color-3">{{ thing }}</div>
                                <div class="font-black">{{(thingIndex !== item.title.length - 1) ? "+" : "="}}</div>
                            </div>
                            <div 
                                class="w-[25px] h-[25px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-[12px] md:text-[14px] text-white ball-color-4"
                            >{{ item.number }}</div>
                        </div>
                    </template>
                    <template v-else>
                        <div 
                            v-for="(item,index) in areaSortSumResult"
                            :key="index"
                            class="w-auto m-1 flex flex-wrap justify-around items-center">
                            <div class="w-auto flex flex-wrap justify-around items-center">
                                <div class="w-[28px] h-[28px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-[12px] md:text-[14px] text-white ball-color-5">{{ (index+1) }}</div>
                                <div class="font-black">+</div>
                                <div class="w-[28px] h-[28px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-[12px] md:text-[14px] text-white ball-color-5">{{ (20-index) }}</div>
                                <div class="font-black">=</div>
                                <div
                                    :class="{
                                        'position-color-1' : item.position == 1,
                                        'position-color-2' : item.position == 2,
                                        'position-color-3' : item.position == 3,
                                        'position-color-4' : item.position == 4,
                                        'position-color-5' : item.position == 5,
                                        'position-color-6' : item.position == 6,
                                        'position-color-7' : item.position == 7,
                                        'position-color-8' : item.position == 8,
                                        'position-color-9' : item.position == 9,
                                        'position-color-10' : item.position == 10,
                                    }"
                                    class="w-[28px] h-[28px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white text-[12px] md:text-[14px]">{{ item.sum }}</div>
                            </div>
                        </div>
                    </template>
                    <Block :closeStatus="closeStatus" :drawStatus="drawStatus" :type="'all'"></Block>
                </div>
                <el-table v-if="isMobiles" :data="tableData" max-height="45vh" style="width:100vw;font-size:10px;">
                    <el-table-column prop="time" width="40" :label="t('openTime')"/>
                    <el-table-column sortable prop="no" :label="t('no')" width="60"/>
                    <el-table-column prop="reward" width="320">
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
                                        :class="(item == scope.row.special) ? 'ball-color-2' : 'ball-color-1'"
                                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white"
                                    >{{ item }}</div>
                                </template>
                                <template v-else-if="mode == 2">
                                    <div 
                                        v-for="(item,index) in scope.row.reward" :key="index"
                                        :class="(item == scope.row.special) ? 'ball-color-2' : 'ball-color-1'"
                                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white"
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
                                        <div class="w-auto flex flex-wrap justify-around items-center">
                                            <div
                                                :class="{
                                                    'position-color-1' : item.position == 1,
                                                    'position-color-2' : item.position == 2,
                                                    'position-color-3' : item.position == 3,
                                                    'position-color-4' : item.position == 4,
                                                    'position-color-5' : item.position == 5,
                                                    'position-color-6' : item.position == 6,
                                                    'position-color-7' : item.position == 7,
                                                    'position-color-8' : item.position == 8,
                                                    'position-color-9' : item.position == 9,
                                                    'position-color-10' : item.position == 10,
                                                }"
                                                class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white">{{ item.position }}</div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column v-if="(mode == 1) || (mode == 2)" prop="special" width="60" :label="t('specialNum')">
                        <template #default="scope">
                            <div class="flex flex-wrap justify-center items-center gap-x-0.5">
                                <div class="w-[20px] h-[20px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-2">{{ scope.row.special }}</div>
                            </div>
                        </template>
                    </el-table-column> -->
                    <!-- <el-table-column v-if="(mode == 1) || (mode == 2)" prop="decision" :label="t('singleDecision')" width="50"/> -->
                </el-table>
                <el-table v-else :data="tableData" max-height="60vh" style="width:auto;">
                    <el-table-column prop="time" width="50" :label="t('openTime')"/>
                    <el-table-column sortable prop="no" :label="t('no')" width="80"/>
                    <el-table-column prop="reward" width="670">
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
                                        :class="(item == scope.row.special) ? 'ball-color-2' : 'ball-color-1'"
                                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white"
                                    >{{ item }}</div>
                                </template>
                                <template v-else-if="mode == 2">
                                    <div 
                                        v-for="(item,index) in scope.row.reward" :key="index"
                                        :class="(item == scope.row.special) ? 'ball-color-2' : 'ball-color-1'"
                                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white"
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
                                        <div class="w-auto flex flex-wrap justify-around items-center">
                                            <div 
                                                :class="{
                                                    'position-color-1' : item.position == 1,
                                                    'position-color-2' : item.position == 2,
                                                    'position-color-3' : item.position == 3,
                                                    'position-color-4' : item.position == 4,
                                                    'position-color-5' : item.position == 5,
                                                    'position-color-6' : item.position == 6,
                                                    'position-color-7' : item.position == 7,
                                                    'position-color-8' : item.position == 8,
                                                    'position-color-9' : item.position == 9,
                                                    'position-color-10' : item.position == 10,
                                                }"
                                                class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white">{{ item.position }}</div>
                                        </div>
                                    </div>
                                </template>
                            </div>
                        </template>
                    </el-table-column>
                    <!-- <el-table-column v-if="(mode == 1) || (mode == 2)" prop="special" width="70" :label="t('specialNum')">
                        <template #default="scope">
                            <div class="flex flex-wrap justify-center items-center gap-x-0.5">
                                <div class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-2">{{ scope.row.special }}</div>
                            </div>
                        </template>
                    </el-table-column> -->
                    <!-- <el-table-column v-if="(mode == 1) || (mode == 2)" prop="decision" width="60" :label="t('singleDecision')"/> -->
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
            <!-- <advertisement></advertisement> -->
        </div>
        
        <!-- 回上頁 -->
        <!-- <Back></Back> -->
        <load v-show="displayTitle === 0"></load>
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
// import advertisement from '@/components/advertisement.vue'
import { useRouter } from "vue-router"
export default {
  name: 'allView',
  components: {
    load,
    Block,
    Music,
    // advertisement,
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
    const areaSumResult = computed(() => {
        if(!bingoLatest.value?.bigShowOrder) return []
        let target = dealSum(bingoLatest.value?.bigShowOrder)
        return target
    })
    const areaSortSumResult = computed(() => {
        if(!bingoLatest.value?.openShowOrder) return []
        let target = dealSeat(bingoLatest.value?.openShowOrder)
        target.sort((a,b)=> {
            return a.position - b.position
        })
        return target
    })
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
    *1大小 2開獎 3大小加總 4位置加總
    */
    const mode = ref(1)
    const doSort = () => {
        mode.value = 1
    }

    const disableSort = () => {
        mode.value = 2
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
        mode,
        areaSortSumResult,
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
.dayPick:deep .el-input__wrapper{
    background-color:#fdecbd
}
</style>