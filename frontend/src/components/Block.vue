<template>
    <div v-if="closeStatus" class="absolute w-[100%] h-[100%] flex justify-center items-center">
        <div class="z-[3] text-xl font-bold text-red-600">{{t("stop")}}</div>
        <div
            :class="(type==='all') ? 'h-[100%]' : 'h-[60%]'"
            class="absolute bg-[#A6A6A6] w-[100%] opacity-70"
        ></div>
    </div>
    <div v-else-if="(!drawStatus) && (type==='all')"
        @click.self="open" 
        class="absolute w-[100%] h-[100%] bg-[rgb(65,65,65,0.7)] text-2xl text-gray-500 font-extrabold bg-[white] flex flex-wrap justify-center items-center">
        {{t('advertisement')}}
        <Teleport to="body">
            <div
                @click.self="close" 
                v-if="status" 
                class="fixed w-[100%] h-[100%] top-0 left-0 bg-[rgb(65,65,65,0.7)] flex justify-center items-center z-[223] ">
                <div class="w-[90vw] h-[90vw] md:w-[90vh] md:h-[90vh]">
                    <iframe class="w-full h-full" :src="url" frameborder="0"></iframe>
                </div>
            </div>
        </Teleport>
    </div>
    
    <!-- <div v-else-if="(!drawStatus) && (type==='all')" class="absolute w-[100%] h-[100%] flex justify-center items-center">
        <div class="z-[3] text-xl font-bold text-red-600">{{ t("open")  }}</div>
        <div class="absolute bg-[#A6A6A6] w-[100%] h-[100%] opacity-70"></div>
    </div> -->
</template>
<script>
// @ is an alias to /src
import { ref } from 'vue'
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
    const url = ref('https://tw.yahoo.com/')
    const status = ref(false)
    const open = () => {
        status.value = true
    }
    const close = () => {
        status.value = false
    }
    const link = () => {
        window.open('https://www.google.com.tw/')
    }
    return {
        url,
        status,
        open,
        close,
        link,
        t
    }

  }
}
</script>
