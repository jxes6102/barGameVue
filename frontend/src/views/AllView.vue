<template>
    <div class="w-[100vw] h-[100vh] overflow-x-hidden overflow-y-auto bg-[#fcfce5] flex flex-wrap justify-center items-center">
        <div class="relative w-[100%] h-[12%] md:h-[15%] bg-[#ffdf00] flex justify-center items-center">
            <img class="absolute left-1 w-[75px] h-[60px] md:w-[100px] md:h-[80px]" src="@/assets/images/lottery.png">
            <div class="text-base md:text-4xl text-white">{{ t("lotteryName") }}</div>
            <div class="absolute right-0 md:right-[10vw] w-[auto] h-auto flex flex-wrap justify-center items-center">
                <!-- <div class="w-[auto] h-[auto]">{{t('choseDay')}} </div> -->
                <div v-if="isMobiles" class="dayPick w-[auto] h-[auto] flex flex-wrap justify-center items-center">
                    <el-date-picker
                        v-model="dayData"
                        type="date"
                        placeholder="選擇查詢日期"
                        :disabled-date="disabledDate"
                        :disabled="apiLoading"
                        style="width: 110px;font-size: 12px;"
                    />
                </div>
                <div v-else class="dayPick w-[auto] h-[auto] flex flex-wrap justify-center items-center">
                    <el-date-picker
                        v-model="dayData"
                        type="date"
                        placeholder="選擇查詢日期"
                        :disabled-date="disabledDate"
                        :disabled="apiLoading"
                        style="width: 170px;font-size: 16px;"
                    />
                </div>
            </div>
        </div>
        <div class="w-[100vw] h-[85%] flex flex-wrap justify-center items-center max-w-[1000px] gap-y-2">
            <div class="w-[100%] h-auto flex flex-wrap justify-center items-center gap-y-4 md:gap-y-2">
                <div class="relative w-[100%] md:w-[50%] h-auto flex flex-wrap justify-center md:justify-center items-center gap-y-4 md:gap-y-2">
                    <div class="relative w-[100%] h-auto flex flex-wrap justify-center items-center gap-x-2">
                        <div class="w-auto h-auto font-extrabold text-base md:text-xl text-red-500">{{ displayTitle }}</div>
                        <div class="w-auto h-auto font-extrabold text-xs md:text-sm text-red-500">{{ statistics}}</div>
                    </div>
                    <div class="w-[250px] md:w-[380px] h-auto flex flex-wrap justify-center md:justify-center items-center gap-[2px]">
                        <div 
                            v-for="(item,index) in drawResult" :key="index"
                            :class="(item===newData.special) ? 'ball-color-2' : 'ball-color-1'"
                            class="w-[22px] h-[22px] md:w-[35px] md:h-[35px] rounded-[50%] flex justify-center items-center text-xs md:text-base font-bold text-white"
                        >{{ item }}</div>
                    </div>
                    <div v-if="!drawStatus" class="absolute w-[100%] h-[100%] flex justify-center items-center">
                        <div class="z-[3] text-xl font-bold text-red-600">開獎中...</div>
                        <div class="absolute bg-[#A6A6A6] w-[100%] h-[100%] opacity-70"></div>
                    </div>
                </div>
                <div class="w-[100%] md:w-[50%] h-auto flex flex-wrap justify-center items-center gap-y-2">
                    <div class="w-[100%] h-auto flex flex-wrap justify-center items-center gap-x-2">
                        <div class="w-auto h-auto flex flex-wrap justify-center items-center font-extrabold text-sm md:text-xl text-red-500">{{ t('time') }}</div>
                        <div class="w-[30%] md:w-[50%] px-2">
                            <el-progress status="warning" :percentage="timePercentage" :show-text="false" />
                        </div>
                        <div class="w-[auto] h-auto flex flex-wrap justify-center items-center font-extrabold text-sm md:text-base text-red-500">{{ displayTime }}</div>
                    </div>
                    <div class="w-[100%] h-auto flex flex-wrap justify-center items-center gap-1">
                        <div
                            v-for="(item,index) in gameList" 
                            :key="index"
                            @click="ctrlGame(item.key)"
                            class="w-auto  bg-[#8ac6d1] px-1 py-1 rounded-[5px] flex flex-wrap justify-center items-center cursor-pointer hover:opacity-80"
                        >
                            <el-icon size="20"><VideoPlay /></el-icon>
                            <div class="flex flex-wrap justify-center items-center text-base">{{ item.name }}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div class="w-auto h-[60vh] md:h-[auto] flex flex-wrap justify-center items-center md:gap-y-2 min-h-[60vh]">
                <div class="w-[100%] h-auto flex flex-wrap justify-center items-center gap-x-2">
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
                </div>
                <el-table v-if="isMobiles" :data="tableData" max-height="40vh" style="width:100vw;font-size:10px;">
                    <el-table-column prop="time" width="55" :label="t('openTime')"/>
                    <el-table-column sortable prop="no" :label="t('no')" width="85"/>
                    <el-table-column prop="reward" :label="t('reward')" width="180">
                        <template #default="scope">
                            <div class="flex flex-wrap justify-start items-center gap-x-[0.5px]">
                                <div 
                                    v-for="(item,index) in scope.row.reward" :key="index"
                                    class="w-[15px] h-[15px] rounded-[50%] flex justify-center items-center font-bold text-[12px] text-white ball-color-1"
                                >{{ item }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="special" width="60" :label="t('specialNum')">
                        <template #default="scope">
                            <div class="flex flex-wrap justify-center items-center gap-x-0.5">
                                <div class="w-[20px] h-[20px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-2">{{ scope.row.special }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="decision" :label="t('singleDecision')" width="50"/>
                </el-table>
                <el-table v-else :data="tableData" max-height="50vh" style="width:auto;">
                    <el-table-column prop="time" width="60" :label="t('openTime')"/>
                    <el-table-column sortable prop="no" :label="t('no')" width="100"/>
                    <el-table-column prop="reward" :label="t('reward')" width="570">
                        <template #default="scope">
                            <div class="flex flex-wrap justify-start items-center gap-x-0.5">
                                <div 
                                    v-for="(item,index) in scope.row.reward" :key="index"
                                    class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-1"
                                >{{ item }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="special" width="70" :label="t('specialNum')">
                        <template #default="scope">
                            <div class="flex flex-wrap justify-center items-center gap-x-0.5">
                                <div class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-2">{{ scope.row.special }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="decision" width="60" :label="t('singleDecision')"/>
                </el-table>
                <div class="w-[100%] h-auto flex flex-wrap justify-center items-center">
                    <el-pagination
                        small
                        background
                        :page-size="pageSizeCount"
                        layout="prev, pager, next"
                        :total="tableTotal"
                        @current-change="currentChange"
                        :disabled="apiLoading"
                    />
                </div>
            </div>
        </div>
        <!-- 回上頁 -->
        <!-- <Back></Back> -->
        <load v-show="displayTitle === 0"></load>
        <div v-if="openStatus" class="absolute w-full h-full flex flex-wrap justify-center items-center">
            <div
                @click="ctrlGame('')"
                class="fixed w-full h-full left-0 top-0 bg-slate-800 z-[111] opacity-50 flex flex-wrap justify-center items-center"
            ></div>
            <div class="w-auto h-auto bg-[white] z-[122] flex flex-wrap justify-center items-center">
                <component :is="openStatus" :allData="newData" :displayTitle="displayTitle" :displayTime="displayTime"></component>
            </div>
        </div>
    </div>
</template>

<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref,watch,computed,onMounted,onBeforeUnmount } from 'vue'
import Back from '@/components/Back.vue'
import { useStore } from "vuex"
import load from '@/components/load.vue'
import { useI18n } from 'vue-i18n'
import SmallHistory from '@/components/smallHistory.vue'
import bar from '@/components/bar.vue'
import capsule from '@/components/capsule.vue'
import chest from '@/components/chest.vue'
import { useRouter } from "vue-router"
export default {
  name: 'allView',
  components: {
    SmallHistory,
    Back,
    load,
    bar,
    capsule,
    chest
  },
  setup() {
    /**
     * 
     */
    const { t } = useI18n()
    const store = useStore()
    const isMobiles = computed(() => {
        return store.state.isMobile
    })
    const gameList = ref([
        {name:t('game1'),key:'bar'},
        {name:t('game2'),key:'capsule'},
        {name:t('game3'),key:'chest'},
    ])
    const apiLoading = ref(false)
    const timer1 = ref(null)
    const dayData = ref(null)
    const page = ref(0)
    const todayData = ref(null)
    const newData = computed(() => {
        if(!todayData.value) return {}
        return todayData.value[todayData.value.length-1]
    })
    const drawResult = computed(() => {
        if(!newData.value?.reward) return []
        return newData.value.reward
    })
    const areaSumResult = computed(() => {
        if(!newData.value?.reward) return []
        let target = []
        for(let i = 4;(i+2)<newData.value.reward.length;i+=3){
            let sum = newData.value.reward.slice(i-1,i+2).reduce((accumulator, currentValue) => accumulator + parseInt(currentValue),0)
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
        let choseDate = dayData.value.getMonth()+1+"/"+dayData.value.getDate()
        let now = new Date()
        let nowDate = now.getMonth()+1+"/"+now.getDate()
        
        if(choseDate===nowDate){
            if(!todayData.value) return target
            for(let item of todayData.value){
                target.push({
                    no:item.no,
                    reward:item.reward,
                    decision:item.singleDecision,
                    time:item.time,
                    special:item.special
                })
            }
            target.reverse()
            target = target.slice((page.value)*100,(page.value+1)*100)
        }else {
            if(!historyData.value) return target
            for(let item of historyData.value[page.value]){
                let numArr = item.preDrawCode.split(',')
                let singleCount = 0
                for(let i = 0;i<numArr.length;i++){
                    if(numArr[i]%2 === 1) singleCount++
                }
                let font = ''
                if(singleCount>=13) font = t('result1')
                else if(singleCount>=11&&singleCount<13) font = t('result2')
                else if(singleCount === 10) font = t('result3')
                else if(singleCount>=8&&singleCount<10) font = t('result4')
                else font = t('result5')

                target.push({
                    no:item.preDrawIssue,
                    reward:numArr.slice(0,20),
                    decision:font,
                    time:item.preDrawTime.split(' ')[1].substr(0,5),
                    special:numArr[numArr.length - 1]
                })
            }
        }
        
        return target
    })
    const displayTitle = computed(() => {
        if(!newData.value?.no) return 0
        return (newData.value.no) + t('title') 
    })
    const statistics = computed(() => {
        if(!tableData.value) return ''
        let choseDate = dayData.value.getMonth()+1+"/"+dayData.value.getDate()
        let now = new Date()
        let nowDate = now.getMonth()+1+"/"+now.getDate()
        
        if(choseDate===nowDate){
            return t('rewardLen',{existing:(todayData.value?.length || 0),remain:203-(todayData.value?.length || 0)})
        }

        return ''
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
        let choseDate = dayData.value.getMonth()+1+"/"+dayData.value.getDate()
        let now = new Date()
        let nowDate = now.getMonth()+1+"/"+now.getDate()
        if(choseDate===nowDate){
            return todayData.value?.length || 1
        }else{
            return historyData.value?.length || 1
        }
    })
    const pageSizeCount = computed(()=>{
        let choseDate = dayData.value.getMonth()+1+"/"+dayData.value.getDate()
        let now = new Date()
        let nowDate = now.getMonth()+1+"/"+now.getDate()
        if(choseDate===nowDate){
            return 100
        }else{
            return 1
        }
    })
    // 監聽api改變
    watch(newData, (newVal,oldVal)=>{
      if(oldVal){
        if(!newVal?.no || !oldVal.no) return false
        let apiDate = (dayData.value.getMonth())+'-'+dayData.value.getDate()
        let nowDate = (new Date().getMonth())+'-'+(new Date().getDate())
        if((parseInt(newVal.no) > parseInt(oldVal.no)) && (apiDate===nowDate)) {
            drawStatus.value = true
            setTimeout(()=>{
                getHistory()
            },25500)
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
        await getHistory()
    })
    //pyapi拿今天獎項資料
    const pyCatchNum = async() => {
        await store.dispatch('pyGet',{getText:t})
        todayData.value = store.state.todayrecord
    }
    //拿除了今天獎項資料
    const getHistory = async(nowpage = 1) => {
        if(apiLoading.value) return false
        apiLoading.value = true
        let date = dayData.value.getFullYear()+'-'+(dayData.value.getMonth()+1)+'-'+dayData.value.getDate()
        // let startTime = dayData.value.getFullYear()+'-'+(dayData.value.getMonth()+1)+'-'+dayData.value.getDate()+'%2000:00:00'
        // let endTime = dayData.value.getFullYear()+'-'+(dayData.value.getMonth()+1)+'-'+dayData.value.getDate()+'%2023:59:59'
        await store.dispatch('getOtherHistory',{day:date})
        page.value = 0
        historyData.value = store.state.allrecord
        apiLoading.value = false
    }

    onMounted(() => {
        timer1.value = window.setInterval((async() => {
            await pyCatchNum()
        } ), 4500)

        setTimeout(function (){
            // console.log('newData',newData.value)
        },1500)

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
    }
    init()

    const currentChange = (value) => {
        page.value = value - 1
    }

    //設定選擇日期範圍
    const disabledDate = (time) => {
        return (time.getTime() > Date.now()) || (time.getTime() < (Date.now() - 2592000000))
    }

    const orderStatus = ref(false)
    const openStatus = ref()
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

    return {
        drawResult,
        displayTitle,
        displayTime,
        isMobiles,
        apiLoading,
        dayData,
        historyData,
        orderStatus,
        tableData,
        gameList,
        openStatus,
        newData,
        drawStatus,
        tableTotal,
        statistics,
        timePercentage,
        pageSizeCount,
        areaSumResult,
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
  background:radial-gradient(circle at 35% 25%,#f6c77b 0,#dfad5d 20%,#e1a34d 40%,#bba319 90%,#d3942f 95%,#e1ab4d 100%);
}
.ball-color-4{
  background:radial-gradient(circle at 35% 25%,#7bf685 0,#64df5d 20%,#4de172 40%,#19bb39 90%,#2fd345 95%,#4de154 100%);
}

.dayPick::v-deep .el-input__wrapper{
    background-color:#fdecbd
}
</style>