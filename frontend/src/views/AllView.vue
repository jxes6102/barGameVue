<template>
    <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center">
        <div class="w-[90vw] h-[100vh] flex flex-wrap justify-center items-center max-w-[1000px]">
            <!-- title -->
            <div class="w-[100%] h-[25vh] flex flex-wrap justify-center items-center">
                <div class="w-[100%] md:w-[50%] h-auto flex flex-wrap justify-center md:justify-start items-center gap-y-2">
                    <div class="w-[100%] h-auto pl-2 flex flex-wrap justify-center md:justify-start items-center font-extrabold text-base md:text-xl text-red-500">{{ displayTitle }}</div>
                    <div class="w-[250px] md:w-[380px] h-auto flex flex-wrap justify-center md:justify-start items-center gap-[2px]">
                        <div 
                            v-for="(item,index) in drawResult" :key="index"
                            :class="(index===19) ? 'ball-color-2' : 'ball-color-1'"
                            class="w-[22px] h-[22px] md:w-[35px] md:h-[35px] rounded-[50%] flex justify-center items-center text-xs md:text-base font-bold text-white"
                        >{{ item }}</div>
                    </div>
                </div>
                <div class="w-[100%] md:w-[50%] h-auto flex flex-wrap justify-center items-center">
                    <div class="w-[50%] h-auto flex flex-wrap justify-center items-center gap-y-2">
                        <div class="w-[100%] h-auto pl-2 flex flex-wrap justify-center items-center font-extrabold text-base md:text-xl text-red-500">{{ t('time') }}</div>
                        <div class="w-[100%] h-auto pl-2 flex flex-wrap justify-center items-center font-extrabold text-base md:text-xl text-red-500">{{ displayTime }}</div>
                    </div>
                    <div class="w-[50%] h-auto">放元件</div>
                </div>
            </div>
            <!-- 歷史紀錄 -->
            <div class="w-[800px] h-[70vh] flex-col flex flex-wrap justify-start items-center gap-y-2">
                <!-- 工具列 -->
                <div class="w-[300px] md:w-[800px] h-auto flex flex-wrap justify-center items-center">
                    <div class="w-[25%] md:w-[33%] h-[100%] text-base md:text-xl font-bold flex flex-wrap justify-start items-center">{{ t('rewardRecord') }}</div>
                    <!-- <div class="w-[50%] md:w-[25%] h-[100%] flex flex-wrap justify-center items-center">
                        <el-switch
                            v-model="value2"
                            class="mb-2"
                            style="--el-switch-on-color: #13ce66; --el-switch-off-color: #ff4949"
                            active-text="依號碼大小"
                            inactive-text="依開獎順序"
                        />
                    </div> -->
                    <div class="w-[25%] md:w-[33%] h-[100%] flex flex-wrap justify-end items-center">{{t('choseDay')}} </div>
                    <div class="w-[50%] md:w-[34%] h-[100%] flex flex-wrap justify-center items-center">
                        <el-date-picker
                            v-model="dayData"
                            type="date"
                            placeholder="選擇查詢日期"
                            :disabled-date="disabledDate"
                            :disabled="apiLoading"
                        />
                    </div>
                </div>
                <div class="w-auto h-[50vh] md:h-[60vh]">
                    <el-table v-if="isMobiles" :data="tableData" max-height="50vh" style="width:300px;font-size:10px;">
                        <el-table-column prop="time" width="60" :label="t('openTime')"/>
                        <el-table-column sortable prop="no" :label="t('no')" width="90"/>
                        <el-table-column prop="reward" :label="t('reward')">
                            <template #default="scope">
                                <div class="flex flex-wrap justify-start items-center">
                                    <div 
                                        v-for="(item,index) in scope.row.reward" :key="index"
                                        :class="(index===19) ? 'ball-color-2' : 'ball-color-1'"
                                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white"
                                    >{{ item }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="decision" :label="t('singleDecision')" width="50"/>
                    </el-table>
                    <el-table v-else :data="tableData" max-height="60vh" style="width:800px;">
                        <el-table-column prop="time" width="60" :label="t('openTime')"/>
                        <el-table-column sortable prop="no" :label="t('no')" width="100"/>
                        <el-table-column prop="reward" :label="t('reward')">
                            <template #default="scope">
                                <div class="flex flex-wrap justify-start items-center gap-x-0.5">
                                    <div 
                                        v-for="(item,index) in scope.row.reward" :key="index"
                                        :class="(index===19) ? 'ball-color-2' : 'ball-color-1'"
                                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white"
                                    >{{ item }}</div>
                                </div>
                            </template>
                        </el-table-column>
                        <el-table-column prop="decision" width="60" :label="t('singleDecision')"/>
                    </el-table>
                    <div class="w-[100%] h-auto mt-2 flex flex-wrap justify-center items-center">
                        <el-pagination
                            small
                            background
                            :page-size="1"
                            layout="prev, pager, next"
                            :total="historyData?.length || 1"
                            @current-change="currentChange"
                            :disabled="apiLoading"
                        />
                    </div>
                </div>
            </div>
            <!-- <div class="w-[100%] h-auto flex flex-wrap justify-center items-start">
                <el-pagination
                    small
                    background
                    :page-size="1"
                    layout="prev, pager, next"
                    :total="historyData?.length || 1"
                    @current-change="currentChange"
                    :disabled="apiLoading"
                />
            </div> -->
        </div>
        <!-- 回上頁 -->
        <Back></Back>
        <load v-show="false"></load>
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
export default {
  name: 'allView',
  components: {
    SmallHistory,
    Back,
    load
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
    const apiLoading = ref(false)
    const timer1 = ref(null)
    const timer2 = ref(null)
    const nowSeconds = ref(0)
    const dayData = ref(null)
    const page = ref(0)
    const todayData = ref(null)
    const newData = computed(() => {
        if(!todayData.value) return {}
        return todayData.value[todayData.value.length-1]
    })
    const drawResult = computed(() => {
        if(!newData.value.reward) return []
        let position = newData.value.reward.indexOf(newData.value.special)
        let target = newData.value.reward
        target.splice(position,1)
        target.push(newData.value.special)
        return target
    })
    const historyData = ref(null)
    const tableData = computed(() => {
      let target = []
      if(!historyData.value) return target
      for(let item of historyData.value[page.value]){
        let numArr = item.preDrawCode.split(',')
        numArr.splice(numArr.indexOf(numArr[numArr.length - 1]),1)
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
          reward:numArr,
          decision:font,
          time:item.preDrawTime.split(' ')[1].substr(0,5)
        })

        // if(sortNoStatus.value) {
        //     target.reverse()
        // }
      }
      return target
    })
    const displayTitle = computed(() => {
        if(!newData.value?.no) return 0
        return t('title') + (newData.value.no)
    })
    const displayTime = computed(() => {
        return Math.floor(nowSeconds.value/60)+"分 : "+nowSeconds.value%60 + "秒"
    })
    // 監聽api改變
    watch(newData, (newVal,oldVal)=>{
      if(oldVal){
        let apiDate = (dayData.value.getMonth())+'-'+dayData.value.getDate()
        let nowDate = (new Date().getMonth())+'-'+(new Date().getDate())
        if((parseInt(newVal.no) > parseInt(oldVal.no)) && (apiDate===nowDate)) {
            setTimeout(()=>{
                getHistory()
            },25500)
        }
      }
    })
    // 監聽剩餘秒數
    watch(nowSeconds, (newVal,oldVal)=>{
        if(newVal === 0){
            getTime()
        }
    })
    //監聽日期改變
    watch(dayData, async(newVal,oldVal)=>{
        await getHistory()
        // console.log('dayData',dayData.value)
    })
    // 計算時間
    const getTime = () => {
        const time = new Date();
        let getMinutes = time.getMinutes();
        let getSeconds = time.getSeconds();
        nowSeconds.value = (4-getMinutes%5)*60+(60-getSeconds)
    }
    //pyapi拿今天獎項資料
    const pyCatchNum = async() => {
        await store.dispatch('pyGet',{getText:t})
        todayData.value = store.state.todayrecord
        // console.log('todayData',store.state.todayrecord)
    }
    //拿除了今天獎項資料
    const getHistory = async(nowpage = 1) => {
        if(apiLoading.value) return false
        apiLoading.value = true
        // console.log(dayData.value.getFullYear()+'-'+(dayData.value.getMonth()+1)+'-'+dayData.value.getDate())
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
        } ), 5500)

        // store.dispatch('getTodayHistory')

        
        setTimeout(function (){
            // console.log('newData',newData.value)
        },1500)

    })

    onBeforeUnmount(() => {
        clearInterval(timer1.value)
        clearInterval(timer2.value)
    })

    //初始動作
    const init = () => {
        getTime()
        let date = new Date()
        date.setDate(date.getDate())
        dayData.value = date
        pyCatchNum()
        timer2.value = window.setInterval((async() => {
          nowSeconds.value--
        } ), 1000)
    }
    init()

    const currentChange = (value) => {
        page.value = value - 1
        // console.log('currentChange')
    }

    //設定選擇日期範圍
    const disabledDate = (time) => {
        return (time.getTime() > Date.now()) || (time.getTime() < (Date.now() - 2592000000))
    }

    const value2 = ref(false)

    return {
        drawResult,
        displayTitle,
        displayTime,
        isMobiles,
        apiLoading,
        dayData,
        historyData,
        value2,
        tableData,
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
</style>