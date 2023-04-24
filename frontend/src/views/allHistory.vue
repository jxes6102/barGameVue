<template>
    <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center">
        <div class="w-[100%] h-auto flex flex-wrap justify-center items-center gap-x-[20px]">
            <el-date-picker
                v-model="dayData"
                type="date"
                placeholder="Pick a day"
                :disabled-date="disabledDate"
            />
            <div class="w-[100px] text-2xl bg-[#8ac6d1] px-2 py-1 rounded-[5px] cursor-pointer hover:opacity-80">查詢</div>
        </div>
        
        <!-- 回上頁 -->
        <Back></Back>
    </div>
</template>

<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref } from 'vue'
import Back from '@/components/Back.vue'
export default {
  name: 'allHistory',
  components: {
    Back
  },
  setup() {
    const dayData = ref(null)

    const disabledDate = (time) => {
        return (time.getTime() > Date.now()) || (time.getTime() < (Date.now() - 2592000000))
    }
    
    return {
        dayData,
        disabledDate
    }

  }
}
</script>
