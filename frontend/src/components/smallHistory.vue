<template>
    <el-table v-if="isMobiles" :data="tableData" max-height="25vh" style="width:300px;font-size:10px;">
        <el-table-column sortable prop="no" label="期號" width="90"/>
        <el-table-column prop="reward" label="開獎號碼">
          <template #default="scope">
            <div class="flex flex-wrap justify-start items-center gap-x-0.5">
              <div
                v-for="(item,index) in scope.row.reward" :key="index"
                :class="item === scope.row.special ? 'hidden' : ''"
                class="w-[22px] h-[22px] bg-[white] rounded-[50%] flex justify-center items-center border-solid border-2 border-[#1687a7] font-bold"
              >{{ item }}</div>
              <div class="w-[22px] h-[22px] bg-[white] rounded-[50%] flex justify-center items-center border-solid border-2 border-[#dd0a35] font-bold">{{ scope.row.special }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="singleDecision" label="結果" width="60"/>
    </el-table>
    <el-table v-else :data="tableData" max-height="25vh" style="width:800px;">
        <el-table-column sortable prop="no" label="期號" width="100"/>
        <el-table-column width="600" prop="reward" label="開獎號碼">
          <template #default="scope">
            <div class="flex flex-wrap justify-start items-center gap-x-0.5">
              <div 
                v-for="(item,index) in scope.row.reward" :key="index"
                :class="item === scope.row.special ? 'hidden' : ''"
                class="w-[25px] h-[25px] bg-[white] rounded-[50%] flex justify-center items-center border-solid border-2 border-[#1687a7] font-bold"
              >{{ item }}</div>
              <div class="w-[25px] h-[25px] bg-[white] rounded-[50%] flex justify-center items-center border-solid border-2 border-[#dd0a35] font-bold">{{ scope.row.special }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="singleDecision" label="結果"/>
    </el-table>
</template>
<script>
// @ is an alias to /src
import { useStore } from "vuex";
import { computed } from 'vue'
export default {
  components: {},
  props: {
    tableData: {
        type: Array,
        default: () => {
            return []
        }
    }
  },
  setup(props) {
    const store = useStore()
    const isMobiles = computed(() => {
        return store.state.isMobile
    });
    const tableDatas = computed(() => {
        return props.tableData
    });

    return {
        isMobiles,
        tableDatas
    }

  }
}
</script>
<style scoped>
</style>
