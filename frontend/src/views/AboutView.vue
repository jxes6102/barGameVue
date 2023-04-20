<template>
    <div class="w-[100vw] h-[100vh] bg-[#fcfce5] flex flex-wrap justify-center items-center gap-[20px]">
        <el-button type="primary" size='large' style="font-size: 22px; width:100px;" @click="toLinkBar">bar</el-button>
        <el-button type="primary" size='large' style="font-size: 22px; width:100px;" @click="toLinkCapsule">capsule</el-button>
        <el-table :data="tableData" stripe style="width: 100%">
          <el-table-column prop="date" label="Date" width="180" />
          <el-table-column prop="name" label="Name" width="180" />
          <el-table-column prop="address" label="Address" />
        </el-table>
    </div>
</template>
<script>
/*eslint-disable*/
// @ is an alias to /src
import { ref } from 'vue'
import { useRouter } from "vue-router";
export default {
  name: 'about',
  components: {
  },
  setup() {
    const tableData = ref([
      {
        date: '2016-05-03',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-02',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-04',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
      {
        date: '2016-05-01',
        name: 'Tom',
        address: 'No. 189, Grove St, Los Angeles',
      },
    ])
    const router = useRouter();
    const toLinkBar = () => {
        router.push({ name: "bar" });
    }

    const toLinkCapsule = () => {
        router.push({ name: "capsule" });
    }
    
    return {
        toLinkBar,
        toLinkCapsule,
        tableData
    }

  }
}
</script>
