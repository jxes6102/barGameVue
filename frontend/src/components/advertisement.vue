<template>
    <div class="w-[100vw] h-auto">
        <div class="w-full h-[10vh] md:h-[20vh]"></div>
        <div
            @click="open"  
            class="fixed bottom-0 w-[100vw] h-[auto] flex flex-wrap justify-center items-center z-[222]">
            <div
                class="w-[100vw] h-[15vh] text-2xl text-gray-500 font-extrabold bg-[white] flex flex-wrap justify-center items-center">
                {{t('advertisement')}}
            </div>
        </div>
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
</template>

<script>
// @ is an alias to /src
// import { useRouter } from "vue-router";
import { ref } from 'vue'
import { useI18n } from 'vue-i18n'
export default {
    name: 'advertisementView',
    components: {
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
            t,
            open,
            close,
            link
        }

    }
}
</script>