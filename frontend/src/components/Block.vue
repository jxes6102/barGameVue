<template>
    <div v-if="closeStatus" class="absolute w-[100%] h-[100%] flex justify-center items-center">
        <div class="z-[3] text-xl font-bold text-red-600">{{t("stop")}}</div>
        <div
            :class="(type==='all') ? 'h-[100%]' : 'h-[60%]'"
            class="absolute bg-[#A6A6A6] w-[100%] opacity-70"
        ></div>
    </div>
    <div v-else-if="(!drawStatus) && (type==='all')" class="absolute w-[100%] h-[100%] flex justify-center items-center">
        <div class="z-[3] text-xl font-bold text-red-600">{{ t("open")  }}</div>
        <div class="absolute bg-[#A6A6A6] w-[100%] h-[100%] opacity-70"></div>
    </div>
</template>
<script>
// @ is an alias to /src
import { useI18n } from 'vue-i18n'
export default {
  components: {},
  props: {
    closeStatus: {
        type: Boolean,
        default: false
    },
    drawStatus: {
        type: Boolean,
        default: true
    },
    type: {
        type: String,
        default: 'all'
    }
  },
  setup() {
    const { t } = useI18n()
    return {
        t
    }

  }
}
</script>
