<template>
    <div v-if="status" class="w-[100vw] h-auto">
        <div class="w-full h-[10vh] md:h-[20vh]"></div>
        <div
            @click="link"
            class="fixed bottom-0 w-[100vw] h-[auto] flex flex-wrap justify-center items-center z-[222]">
            <div
                class="w-[100vw] h-[15vh] bg-[white] flex flex-wrap justify-center items-center">
                <img class="w-full h-full" src="@/assets/images/ad-1.png" alt="">
                <!-- <div class="text-2xl text-gray-500 font-extrabold">{{t('advertisement')}}</div> -->
            </div>
            <div @click.stop="close" class="absolute w-auto h-auto m-[2px] md:m-1 top-0 right-0 cursor-pointer">
                <el-icon :size="isMobiles ? 40 : 50" color="#F0FFFF"><Close /></el-icon>
            </div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
// import { useRouter } from "vue-router";
import { ref,computed } from 'vue'
import { useStore } from "vuex"
import { useI18n } from 'vue-i18n'
export default {
    name: 'advertisementView',
    components: {
    },
    setup() {
        const store = useStore()
        const isMobiles = computed(() => {
            return store.state.isMobile
        })
        const { t } = useI18n()
        const url = ref('https://tw.yahoo.com/')
        const link = () => {
            window.open(url.value)
        }
        const status = ref(true)
        const close = () => {
            status.value = false
        }

        return {
            isMobiles,
            status,
            t,
            link,
            close
        }

    }
}
</script>