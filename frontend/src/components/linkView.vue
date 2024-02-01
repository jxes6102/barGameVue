<template>
    <div v-if="allStatus">
        <div
            @click="open"
            class="fixed bg-white top-[30%] md:top-[20%] right-0 w-[60px] h-[60px] md:w-[100px] md:h-[100px] z-[50] flex flex-wrap justify-center items-center cursor-pointer">
            <!-- <div class="text-lg text-gray-400 font-bold">font</div> -->
            <img class="w-full h-full" src="@/assets/images/chat-1.png" alt="">
            <div @click.stop="closeAll" class="absolute w-auto h-auto top-0 right-0 cursor-pointer">
                <el-icon :size="isMobiles ? 20 : 25" color="#F0FFFF"><Close /></el-icon>
            </div>
        </div>
        <Teleport to="body">
            <div
                @click.self="close" 
                v-if="status" 
                class="fixed w-[100%] h-[100%] top-0 left-0 bg-[rgb(65,65,65,0.7)] flex justify-center items-center z-[223] ">
                <div @click="link" class="w-auto h-auto bg-white z-[224]">
                    <img class="w-[70vw] h-[70vw] md:w-[40vw] md:h-[40vw]" src="@/assets/images/download_qr.png" alt="">
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script>
// @ is an alias to /src
// import { useRouter } from "vue-router";
import { ref,computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { useStore } from "vuex"
export default {
    name: 'linkView',
    components: {
    },
    setup() {
         // const router = useRouter()
        const store = useStore()
        const isMobiles = computed(() => {
            return store.state.isMobile
        })
        const { t } = useI18n()
        const status = ref(false)
        const allStatus = ref(true)
        const open = () => {
            status.value = true
        }
        const close = () => {
            status.value = false
        }
        const link = () => {
            window.open('https://www.google.com.tw/')
        }

        const closeAll = () => {
            allStatus.value = false
        }

        return {
            t,
            status,
            allStatus,
            isMobiles,
            closeAll,
            open,
            close,
            link
        }

    }
}
</script>