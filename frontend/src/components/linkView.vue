<template>
    <div>
        <div
            @click="open"
            class="fixed bg-white top-[30%] md:top-[20%] right-0 m-1 md:m-2 w-[60px] h-[60px] md:w-[100px] md:h-[100px] z-[50] flex flex-wrap justify-center items-center">
            <div class="text-lg text-gray-400 font-bold">加入</div>
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
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
export default {
    name: 'linkView',
    components: {
    },
    setup() {
         // const router = useRouter()
        const { t } = useI18n()
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
            t,
            status,
            open,
            close,
            link
        }

    }
}
</script>