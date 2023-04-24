<template>
    <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center">
        <div class="w-[100%] h-auto flex flex-wrap justify-center items-center gap-x-[20px]">
            <el-date-picker
                v-model="dayData"
                type="date"
                placeholder="選擇查詢日期"
                :disabled-date="disabledDate"
                :disabled="apiLoading"
            />
        </div>
        <div class="w-[800px] h-[65vh] flex flex-wrap justify-center items-center">
            <el-table :data="tableData" max-height="65vh" style="width:800px;">
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
        <div class="w-[800px] h-[20vh] flex flex-wrap justify-center items-center">
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
import { ref,watch,computed } from 'vue'
import Back from '@/components/Back.vue'
import { useStore } from "vuex";
export default {
  name: 'allHistory',
  components: {
    Back
  },
  setup() {
    const store = useStore();
    const dayData = ref(null)
    const historyData = ref([])
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
    const apiLoading = ref(false)

    const disabledDate = (time) => {
        return (time.getTime() > Date.now()) || (time.getTime() < (Date.now() - 2592000000))
    }
    
    watch(dayData, async(newVal,oldVal)=>{
        await getHistory()
    })

    const getHistory = async(nowpage = 1) => {
        if(apiLoading.value) return false
        apiLoading.value = true
        let startTime = dayData.value.getFullYear()+'-'+(dayData.value.getMonth()+1)+'-'+dayData.value.getDate()+'%2000:00:00'
        let endTime = dayData.value.getFullYear()+'-'+(dayData.value.getMonth()+1)+'-'+dayData.value.getDate()+'%2023:59:59'
        await store.dispatch('getHistory',{startTime,endTime,page:nowpage})
        historyData.value = store.state.allrecord
        apiLoading.value = false
        console.log('historyData',historyData.value)
    }

    const currentChange = async(value) => {
        await getHistory(value)
    }

    return {
        dayData,
        tableData,
        historyData,
        apiLoading,
        currentChange,
        disabledDate
    }

  }
}
</script>
