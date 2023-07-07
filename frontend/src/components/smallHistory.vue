<template>
    <el-table v-if="isMobiles" :data="tableData" :max-height="tableHeights" style="width:300px;font-size:10px;">
        <el-table-column prop="time" :label="t('openTime')" width="60"/>  
        <el-table-column sortable prop="no" :label="t('no')" width="90"/>
        <el-table-column prop="reward" :label="t('reward')" width="260">
          <template #default="scope">
            <div class="flex flex-wrap justify-start items-center gap-x-[1px]">
              <div
                v-for="(item,index) in scope.row.reward" :key="index"
                :class="item === scope.row.special ? 'hidden' : ''"
                class="w-[22px] h-[22px] rounded-[50%] flex justify-center items-center font-bold text-[white] ball-color-1"
              >{{ item }}</div>
              <div 
                class="w-[22px] h-[22px] rounded-[50%] flex justify-center items-center font-bold text-[white] ball-color-2"
              >{{ scope.row.special }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="singleDecision" :label="t('singleDecision')" width="50"/>
    </el-table>
    <el-table v-else :data="tableData" :max-height="tableHeights" style="width:800px;">
        <el-table-column prop="time" :label="t('openTime')" width="70"/>
        <el-table-column sortable prop="no" :label="t('no')" width="100"/>
        <el-table-column prop="reward" :label="t('reward') ">
          <template #default="scope">
            <div class="flex flex-wrap justify-start items-center gap-x-0.5">
              <div 
                v-for="(item,index) in scope.row.reward" :key="index"
                :class="item === scope.row.special ? 'hidden' : ''"
                class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-[white] ball-color-1"
              >{{ item }}</div>
              <div 
                class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-[white] ball-color-2"
              >{{ scope.row.special }}</div>
            </div>
          </template>
        </el-table-column>
        <el-table-column prop="singleDecision" :label="t('singleDecision')" width="60"/>
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
.ball-color-1{
  background:radial-gradient(circle at 35% 25%,#9b98f5 0,#716ddd 20%,#4743d0 40%,#1f19bf 90%,#302bc4 95%,#4743d0 100%);
}
.ball-color-2{
  background:radial-gradient(circle at 35% 25%,#f67b7b 0,#df5d5d 20%,#e14d4d 40%,#bb1919 90%,#d32f2f 95%,#e14d4d 100%);
}
</style>
