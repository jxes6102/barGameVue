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
            <div v-if="isMobile" class="w-[300px] h-[60vh] flex flex-wrap justify-center items-center">
                <el-table :data="tableData" max-height="60vh" style="width:300px;font-size:10px">
                    <el-table-column sortable prop="no" label="期號" width="90"/>
                    <el-table-column prop="reward" label="開獎號碼">
                        <template #default="scope">
                            <div class="flex flex-wrap justify-start items-center gap-x-0.5">
                                <div 
                                    v-for="(item,index) in scope.row.reward" :key="index"
                                    class="w-[25px] h-[25px] bg-[white] rounded-[50%] flex justify-center items-center border-solid border-2 border-[#1687a7] font-bold"
                                >{{ item }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column sortable prop="time" label="時間" width="80"/>
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
                                    class="w-[25px] h-[25px] bg-[white] rounded-[50%] flex justify-center items-center border-solid border-2 border-[#1687a7] font-bold"
                                >{{ item }}</div>
                            </div>
                        </template>
                    </el-table-column>
                    <el-table-column sortable prop="time" label="時間"/>
                </el-table>
            </div>
        </div>
        <div class="w-[100%] h-[20vh] flex flex-wrap justify-center items-start">
            <el-pagination
                small
                background
                :page-size="100"
                layout="prev, pager, next"
                :total="historyData?.page?.count || 1"
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
import { ref,watch,computed,onMounted } from 'vue'
import Back from '@/components/Back.vue'
import { useStore } from "vuex";
export default {
  name: 'allHistory',
  components: {
    Back
  },
  setup() {
    /**
     * windowWidth 螢幕寬度
     * dayData 日期
     * historyData 歷史紀錄
     * apiLoading loading狀態
     * tableData 表格資料
     * isMobile 使用裝置
     * 
     */
    const store = useStore()
    const windowWidth = ref(0)
    const dayData = ref(null)
    const historyData = ref([])
    const apiLoading = ref(false)
    const tableData = computed(() => {
      let target = []
      if(!historyData.value.data) return target
      for(let item of historyData.value.data){
        target.push({
          no:item.issue,
          reward:item.drawResult.split(','),
          time:item.drawTime.split(' ')[1]
        })
      }
      return target
    })
    const isMobile = computed(() => {
      return windowWidth.value <= 768 ? true : false
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
        let startTime = dayData.value.getFullYear()+'-'+(dayData.value.getMonth()+1)+'-'+dayData.value.getDate()+'%2000:00:00'
        let endTime = dayData.value.getFullYear()+'-'+(dayData.value.getMonth()+1)+'-'+dayData.value.getDate()+'%2023:59:59'
        await store.dispatch('getHistory',{startTime,endTime,page:nowpage})
        historyData.value = store.state.allrecord
        apiLoading.value = false
    }
    // 切換分頁時觸發
    const currentChange = async(value) => {
        await getHistory(value)
    }

    onMounted(() => {
      windowWidth.value = window.innerWidth
      window.addEventListener('resize', () => {
        windowWidth.value = window.innerWidth
      }, false);
    })

    return {
        dayData,
        tableData,
        historyData,
        apiLoading,
        isMobile,
        currentChange,
        disabledDate
    }

  }
}
</script>
<style scoped>
</style>
