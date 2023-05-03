<template>
    <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center">
        <div class="w-[100%] h-[15vh] flex flex-wrap justify-center items-end">
            <el-date-picker
                v-model="dayData"
                type="date"
                placeholder="選擇查詢日期"
                :disabled-date="disabledDate"
                :disabled="apiLoading"
            />
        </div>
        <div class="w-[100%] h-auto flex flex-wrap justify-center items-center">
            <div v-if="isMobiles" class="w-[300px] h-[60vh] flex flex-wrap justify-center items-center">
                <el-table :data="tableData" max-height="60vh" style="width:300px;font-size:10px">
                    <el-table-column sortable prop="no" label="期號" width="90"/>
                    <el-table-column prop="reward" label="開獎號碼">
                        <template #default="scope">
                            <div class="flex flex-wrap justify-start items-center gap-x-0.5">
                                <div 
                                    v-for="(item,index) in scope.row.reward" :key="index"
                                    :class="(index===19) ? 'border-[#dd0a35]' : 'border-[#1687a7]'"
                                    class="w-[25px] h-[25px] bg-[white] rounded-[50%] flex justify-center items-center border-solid border-2 font-bold"
                                >{{ item }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="decision" label="結果" width="60"/>
                </el-table>
            </div>
            <div v-else class="w-[800px] h-[60vh] flex flex-wrap justify-center items-center">
                <el-table :data="tableData" max-height="60vh" style="width:800px;">
                    <el-table-column sortable prop="no" label="期號" width="100"/>
                    <el-table-column width="600" prop="reward" label="開獎號碼">
                        <template #default="scope">
                            <div class="flex flex-wrap justify-start items-center gap-x-0.5">
                                <div 
                                    v-for="(item,index) in scope.row.reward" :key="index"
                                    :class="(index===19) ? 'border-[#dd0a35]' : 'border-[#1687a7]'"
                                    class="w-[25px] h-[25px] bg-[white] rounded-[50%] flex justify-center items-center border-solid border-2 font-bold"
                                >{{ item }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column prop="decision" label="結果"/>
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
                class=""
                @current-change="currentChange"
                :disabled="apiLoading"
            />
        </div>
        <!-- 回上頁 -->
        <Back></Back>
    </div>
</template>

<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref,watch,computed } from 'vue'
import Back from '@/components/Back.vue'
import { useStore } from "vuex";
export default {
  name: 'allHistory',
  components: {
    Back
  },
  setup() {
    /**
     * dayData 日期
     * historyData 歷史紀錄
     * apiLoading loading狀態
     * tableData 表格資料
     * isMobiles 使用裝置
     */
    const store = useStore()
    const isMobiles = computed(() => {
        return store.state.isMobile
    });
    const dayData = ref(null)
    const historyData = ref([])
    const apiLoading = ref(false)
    const page = ref(0)
    const tableData = computed(() => {
      let target = []
      if(!historyData.value.length) return target
      for(let item of historyData.value[page.value]){
        let numArr = item.preDrawCode.split(',')
        numArr.splice(numArr.indexOf(numArr[numArr.length - 1]),1)
        let font = (item.sumBigSmall=== 1 ? '大' : '小') + (item.singleDoubleCount=== 1 ? '單' : '雙')
        target.push({
          no:item.preDrawIssue,
          reward:numArr,
          decision:font
        })
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

    return {
        dayData,
        tableData,
        historyData,
        apiLoading,
        isMobiles,
        currentChange,
        disabledDate
    }

  }
}
</script>
<style scoped>
</style>
