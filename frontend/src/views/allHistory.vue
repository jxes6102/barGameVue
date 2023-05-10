<template>
    <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center">
        <div class="w-[100%] h-[15vh] flex flex-wrap justify-center items-end gap-[10px]">
            <el-date-picker
                v-model="dayData"
                type="date"
                placeholder="選擇查詢日期"
                :disabled-date="disabledDate"
                :disabled="apiLoading"
            />
            <!-- <div class="w-[60px] md:w-[80px] text-base md:text-2xl bg-[#8ac6d1] rounded-[5px] cursor-pointer hover:opacity-80" @click="clickSort">排序</div> -->
        </div>
        <div class="w-[100%] h-auto flex flex-wrap justify-center items-center">
            <div v-if="isMobiles" class="w-[300px] h-[60vh] flex flex-wrap justify-center items-center">
                <el-table :data="tableData" max-height="60vh" style="width:300px;font-size:10px">
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
                    <el-table-column prop="time" width="60" :label="t('openTime')"/>
                </el-table>
            </div>
            <div v-else class="w-[800px] h-[60vh] flex flex-wrap justify-center items-center">
                <el-table :data="tableData" max-height="60vh" style="width:800px;">
                    <el-table-column sortable prop="no" :label="t('no')" width="100"/>
                    <el-table-column width="570" prop="reward" :label="t('reward')">
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
                    <el-table-column prop="time" width="60" :label="t('openTime')"/>
                </el-table>
            </div>
        </div>
        <div class="w-[100%] h-[20vh] flex flex-wrap justify-center items-start">
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
        <!-- 回上頁 -->
        <Back></Back>
        <load v-show="!tableData.length"></load>
    </div>
</template>

<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref,watch,computed } from 'vue'
import Back from '@/components/Back.vue'
import { useStore } from "vuex"
import load from '@/components/load.vue'
import { useI18n } from 'vue-i18n'
export default {
  name: 'allHistory',
  components: {
    Back,
    load
  },
  setup() {
    /**
     * dayData 日期
     * historyData 歷史紀錄
     * apiLoading loading狀態
     * tableData 表格資料
     * isMobiles 使用裝置
     * sortNoStatus 排序狀態
     */
    const { t } = useI18n()
    const store = useStore()
    const isMobiles = computed(() => {
        return store.state.isMobile
    })
    const dayData = ref(null)
    const historyData = ref([])
    const apiLoading = ref(false)
    const page = ref(0)
    const sortNoStatus = ref(false)
    const tableData = computed(() => {
      let target = []
      if(!historyData.value.length) return target
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

        if(sortNoStatus.value) {
            target.reverse()
        }
      }
      return target
    })
    //設定選擇日期範圍
    const disabledDate = (time) => {
        return (time.getTime() > Date.now()) || (time.getTime() < (Date.now() - 2592000000))
    }
    //監聽日期改變
    watch(dayData, async(newVal,oldVal)=>{
        await getHistory()
    })
    // 拿取紀錄API
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
    // 切換分頁時觸發
    const currentChange = async(value) => {
        // await getHistory(value)
        page.value = value - 1
    }
    // 點擊排序
    const clickSort = () => {
        sortNoStatus.value = !sortNoStatus.value
    }
    // 初始化
    const init = () => {
        let date = new Date()
        date.setDate(date.getDate() - 1)
        dayData.value = date
    }
    init()

    return {
        dayData,
        tableData,
        historyData,
        apiLoading,
        isMobiles,
        currentChange,
        disabledDate,
        clickSort,
        t
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
