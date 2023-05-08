<template>
    <el-table v-if="isMobiles" :data="tableData" :max-height="tableHeights" style="width:300px;font-size:10px;">
        <el-table-column sortable prop="no" :label="t('no')" width="90"/>
        <el-table-column prop="reward" :label="t('reward')">
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
        <el-table-column prop="singleDecision" :label="t('singleDecision')" width="60"/>
    </el-table>
    <el-table v-else :data="tableData" :max-height="tableHeights" style="width:800px;">
        <el-table-column sortable prop="no" :label="t('no')" width="100"/>
        <el-table-column width="600" prop="reward" :label="t('reward')">
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
        <el-table-column prop="singleDecision" :label="t('singleDecision')"/>
    </el-table>
</template>
<script>
// @ is an alias to /src
import { useStore } from "vuex"
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
export default {
  components: {},
  props: {
    tableData: {
        type: Array,
        default: () => {
            return []
        }
    },
    tableHeight: {
        type: String,
        default: '25vh'
    }
  },
  setup(props) {
    const { t } = useI18n()
    const store = useStore()
    const isMobiles = computed(() => {
        return store.state.isMobile
    });
    const tableDatas = computed(() => {
        return props.tableData
    });
    const tableHeights = computed(() => {
        return props.tableHeight
    });


    return {
        isMobiles,
        tableDatas,
        tableHeights,
        t
    }

  }
}
</script>
<style scoped>
</style>
