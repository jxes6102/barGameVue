<template>
    <el-table v-if="isMobiles" :data="sortData" @sort-change="doSort" :max-height="tableHeights" style="width:100vw;font-size:10px;">
        <el-table-column prop="time" :label="t('openTime')" width="55"/>  
        <el-table-column sortable prop="no" :label="t('no')" width="85"/>
        <el-table-column prop="reward" width="180">
          <template #header>
              <div class="flex flex-wrap justify-start items-center">
                  <div>{{t('reward')}}</div>
                  <div class="mx-[1px]">
                    <button @click="doSort"
                        :class="sortStatus ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                        class="transition-all mx-[1px] px-1 rounded">{{t('sizeSort')}}</button>
                    <button @click="disableSort"
                        :class="!sortStatus ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                        class="transition-all mx-[1px] px-1 rounded">{{t('openSort')}}</button>
                  </div>
              </div>
          </template>
          <template #default="scope">
            <div class="flex flex-wrap justify-start items-center gap-x-[0.5px]">
              <template v-if="sortStatus">
                  <div
                    v-for="(item,index) in scope.row.rewardSort" :key="index"
                    class="w-[15px] h-[15px] rounded-[50%] flex justify-center items-center font-bold text-[12px] text-[white] ball-color-1"
                  >{{ item }}</div>
              </template>
              <template v-else>
                <div
                  v-for="(item,index) in scope.row.reward" :key="index"
                  class="w-[15px] h-[15px] rounded-[50%] flex justify-center items-center font-bold text-[12px] text-[white] ball-color-1"
                >{{ item }}</div>
              </template>
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
    <el-table v-else :data="sortData" @sort-change="doSort" :max-height="tableHeights" style="width:auto;">
        <el-table-column prop="time" :label="t('openTime')" width="70"/>
        <el-table-column sortable prop="no" :label="t('no')" width="100"/>
        <el-table-column prop="reward" width="570">
          <template #header>
            <div class="flex flex-wrap justify-start items-center">
                <div>{{t('reward')}}</div>
                <div class="mx-1">
                  <button @click="doSort"
                      :class="sortStatus ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                      class="transition-all mx-1 px-1 rounded">{{t('sizeSort')}}</button>
                  <button @click="disableSort"
                      :class="!sortStatus ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                      class="transition-all mx-1 px-1 rounded">{{t('openSort')}}</button>
                </div>
            </div>
          </template>
          <template #default="scope">
            <div class="flex flex-wrap justify-start items-center gap-x-0.5"> 
              <template v-if="sortStatus">
                  <div 
                    v-for="(item,index) in scope.row.rewardSort" :key="index"
                    class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-[white] ball-color-1"
                  >{{ item }}</div>
              </template>
              <template v-else>
                <div 
                  v-for="(item,index) in scope.row.reward" :key="index"
                  class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-[white] ball-color-1"
                >{{ item }}</div>
              </template>
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
        <el-table-column prop="decision" :label="t('singleDecision')" width="60"/>
    </el-table>
</template>
<script>
// @ is an alias to /src
import { useStore } from "vuex"
import { ref,computed } from 'vue'
import { useI18n } from 'vue-i18n'
export default {
  components: {},
  emits: ['sortEvent'],
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
  setup(props, { emit }) {
    const { t } = useI18n()
    const store = useStore()
    const sortStatus = ref(false)
    const isMobiles = computed(() => {
        return store.state.isMobile
    });
    const tableDatas = computed(() => {
        return props.tableData
    });
    const sortData = computed(() => {
        let target = tableDatas.value
        // if(sortStatus.value) {
        //   target.reverse()
        // }
        return target
    });
    const tableHeights = computed(() => {
        return props.tableHeight
    });

    const doSort = () => {
        sortStatus.value = true
        emit('sortEvent',sortStatus.value)
    }

    const disableSort = () => {
        sortStatus.value = false
        emit('sortEvent',sortStatus.value)
    }

    return {
        isMobiles,
        tableDatas,
        tableHeights,
        sortData,
        sortStatus,
        doSort,
        disableSort,
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
