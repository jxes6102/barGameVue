<template>
    <el-table v-if="isMobiles" :data="sortData" @sort-change="doSort" :max-height="tableHeights" style="width:100vw;font-size:10px;">
        <el-table-column prop="time" :label="t('openTime')" width="40"/>  
        <el-table-column sortable prop="no" :label="t('no')" width="60"/>
        <el-table-column prop="reward" width="320">
          <template #header>
              <div class="flex flex-wrap justify-start items-center">
                  <div>{{t('reward')}}</div>
                  <div class="mx-[1px]">
                    <button @click="doSort"
                        :class="mode == 1 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                        class="transition-all mx-1 px-1 rounded">{{t('sizeSort')}}</button>
                    <button @click="disableSort"
                        :class="mode == 2 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                        class="transition-all mx-1 px-1 rounded">{{t('openSort')}}</button>
                    <button @click="sumSort"
                        :class="mode == 3 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                        class="transition-all mx-1 px-1 rounded">{{t('sum')}}</button>
                    <button @click="seatSort"
                        :class="mode == 4 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                        class="transition-all mx-1 px-1 rounded">{{t('position')}}</button>
                  </div>
              </div>
          </template>
          <template #default="scope">
            <div class="flex flex-wrap justify-start items-center gap-x-[0.5px]">
                <template v-if="mode == 1">
                    <div 
                        v-for="(item,index) in scope.row.rewardSort" :key="index"
                        :class="(item == scope.row.special) ? 'ball-color-2' : 'ball-color-1'"
                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white"
                    >{{ item }}</div>
                </template>
                <template v-else-if="mode == 2">
                    <div 
                        v-for="(item,index) in scope.row.reward" :key="index"
                        :class="(item == scope.row.special) ? 'ball-color-2' : 'ball-color-1'"
                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white"
                    >{{ item }}</div>
                </template>
                <template v-else-if="mode == 3">
                    <div 
                        v-for="(item,index) in scope.row.areaSum"
                            :key="index" 
                            class="w-auto m-[1px] flex flex-wrap justify-around items-center">
                            <div v-for="(thing,thingIndex) in item.title" :key="thing" class="w-auto flex flex-wrap justify-center items-center">
                                <div class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-3">{{ thing }}</div>
                                <div class="font-black">{{(thingIndex !== item.title.length - 1) ? "+" : "="}}</div>
                            </div>
                        <div 
                            class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-4"
                        >{{ item.number }}</div>
                    </div>
                </template>
                <template v-else-if="mode == 4">
                    <div 
                        v-for="(item,index) in scope.row.seatRank"
                        :key="index"
                        class="w-auto m-1 flex flex-wrap justify-around items-center">
                        <div class="w-auto flex flex-wrap justify-around items-center">
                            <div
                                :class="{
                                    'position-color-1' : item.position == 1,
                                    'position-color-2' : item.position == 2,
                                    'position-color-3' : item.position == 3,
                                    'position-color-4' : item.position == 4,
                                    'position-color-5' : item.position == 5,
                                    'position-color-6' : item.position == 6,
                                    'position-color-7' : item.position == 7,
                                    'position-color-8' : item.position == 8,
                                    'position-color-9' : item.position == 9,
                                    'position-color-10' : item.position == 10,
                                }"
                                class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white">{{ item.position }}</div>
                        </div>
                    </div>
                </template>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="(mode == 1) || (mode == 2)" prop="special" width="60" :label="t('specialNum')">
            <template #default="scope">
                <div class="flex flex-wrap justify-center items-center gap-x-0.5">
                    <div class="w-[20px] h-[20px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-2">{{ scope.row.special }}</div>
                </div>
            </template>
        </el-table-column> -->
        <!-- <el-table-column v-if="(mode == 1) || (mode == 2)" prop="decision" :label="t('singleDecision')" width="50"/> -->
    </el-table>
    <el-table v-else :data="sortData" @sort-change="doSort" :max-height="tableHeights" style="width:auto;">
        <el-table-column prop="time" :label="t('openTime')" width="50"/>
        <el-table-column sortable prop="no" :label="t('no')" width="80"/>
        <el-table-column prop="reward" width="670">
          <template #header>
            <div class="flex flex-wrap justify-start items-center">
                <div>{{t('reward')}}</div>
                <div class="mx-1">
                  <button @click="doSort"
                      :class="mode == 1 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                      class="transition-all mx-1 px-1 rounded">{{t('sizeSort')}}</button>
                  <button @click="disableSort"
                      :class="mode == 2 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                      class="transition-all mx-1 px-1 rounded">{{t('openSort')}}</button>
                  <button @click="sumSort"
                      :class="mode == 3 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                      class="transition-all mx-1 px-1 rounded">{{t('sum')}}</button>
                  <button @click="seatSort"
                      :class="mode == 4 ? 'bg-yellow-400 text-white' : 'bg-gray-100 text-gray-400'"
                      class="transition-all mx-1 px-1 rounded">{{t('position')}}</button>
                </div>
            </div>
          </template>
          <template #default="scope">
            <div class="flex flex-wrap justify-start items-center gap-x-0.5">
                <template v-if="mode == 1">
                    <div 
                        v-for="(item,index) in scope.row.rewardSort" :key="index"
                        :class="(item == scope.row.special) ? 'ball-color-2' : 'ball-color-1'"
                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white"
                    >{{ item }}</div>
                </template>
                <template v-else-if="mode == 2">
                    <div 
                        v-for="(item,index) in scope.row.reward" :key="index"
                        :class="(item == scope.row.special) ? 'ball-color-2' : 'ball-color-1'"
                        class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white"
                    >{{ item }}</div>
                </template>
                <template v-else-if="mode == 3">
                    <div 
                        v-for="(item,index) in scope.row.areaSum"
                            :key="index" 
                            class="w-auto m-[1px] flex flex-wrap justify-around items-center">
                            <div v-for="(thing,thingIndex) in item.title" :key="thing" class="w-auto flex flex-wrap justify-center items-center">
                                <div class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-3">{{ thing }}</div>
                                <div class="font-black">{{(thingIndex !== item.title.length - 1) ? "+" : "="}}</div>
                            </div>
                        <div 
                            class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-4"
                        >{{ item.number }}</div>
                    </div>
                </template>
                <template v-else-if="mode == 4">
                    <div 
                        v-for="(item,index) in scope.row.seatRank"
                        :key="index"
                        class="w-auto m-1 flex flex-wrap justify-around items-center">
                        <div class="w-auto flex flex-wrap justify-around items-center">
                            <div 
                                :class="{
                                    'position-color-1' : item.position == 1,
                                    'position-color-2' : item.position == 2,
                                    'position-color-3' : item.position == 3,
                                    'position-color-4' : item.position == 4,
                                    'position-color-5' : item.position == 5,
                                    'position-color-6' : item.position == 6,
                                    'position-color-7' : item.position == 7,
                                    'position-color-8' : item.position == 8,
                                    'position-color-9' : item.position == 9,
                                    'position-color-10' : item.position == 10,
                                }"
                                class="w-[22px] h-[22px] md:w-[30px] md:h-[30px] rounded-[50%] flex justify-center items-center font-bold text-white">{{ item.position }}</div>
                        </div>
                    </div>
                </template>
            </div>
          </template>
        </el-table-column>
        <!-- <el-table-column v-if="(mode == 1) || (mode == 2)" prop="special" width="70" :label="t('specialNum')">
            <template #default="scope">
                <div class="flex flex-wrap justify-center items-center gap-x-0.5">
                    <div class="w-[25px] h-[25px] rounded-[50%] flex justify-center items-center font-bold text-white ball-color-2">{{ scope.row.special }}</div>
                </div>
            </template>
        </el-table-column> -->
        <!-- <el-table-column v-if="(mode == 1) || (mode == 2)" prop="decision" :label="t('singleDecision')" width="60"/> -->
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
    const mode = ref(1)
    const doSort = () => {
      mode.value = 1
      emit('sortEvent',mode.value)
    }

    const disableSort = () => {
      mode.value = 2
      emit('sortEvent',mode.value)
    }

    const sumSort = () => {
      mode.value = 3
      emit('sortEvent',mode.value)
        // console.log('sumSort')
    }

    const seatSort = () => {
      mode.value = 4
      emit('sortEvent',mode.value)
        // console.log('seatSort')
    }

    return {
        isMobiles,
        tableDatas,
        tableHeights,
        sortData,
        sortStatus,
        mode,
        sumSort,
        seatSort,
        doSort,
        disableSort,
        t
    }

  }
}
</script>
<style scoped>
</style>
