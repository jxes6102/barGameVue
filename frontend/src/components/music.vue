<template>
    <div @click="change" class="w-auto bg-[#8ac6d1] px-1 py-1 rounded-[5px] flex flex-wrap justify-center items-center cursor-pointer hover:opacity-80 gap-1">
        
        <img v-if="musicStatus" class="w-[20px] h-[20px]" src="@/assets/images/volume.png" alt="">
        <img v-else class="w-[20px] h-[20px]" src="@/assets/images/mute.png" alt="">
        <div class="flex flex-wrap justify-center items-center text-base">{{t("music")}}</div>
    </div>
</template>
<script>
import { computed } from 'vue'
import { useStore } from "vuex"
import { useI18n } from 'vue-i18n'
export default {
  name: 'musicComponent',
  components: {
  },
  setup() {
    const { t } = useI18n()
    const store = useStore()
    const musicStatus = computed(() => {
        return store.state.musicStatus
    })
    const change = () => {
        store.commit('setMusicStatus')
    }
    return {
        musicStatus,
        change,
        t
    }
  }
}
</script>
  