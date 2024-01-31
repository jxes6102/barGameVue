<template>
    <div class="w-[100vw] h-auto">
        <div class="w-full h-[10vh] md:h-[20vh]"></div>
        <div class="fixed bottom-0 w-[100vw] h-[auto] flex flex-wrap justify-center items-center z-[222]">
            <div class="w-[90vw] h-[20vh] text-2xl text-gray-500 font-extrabold bg-[white] flex flex-wrap justify-center items-center">{{t('advertisement')}}</div>
        </div>
    </div>
</template>

<script>
// @ is an alias to /src
// import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n'
export default {
    name: 'advertisementView',
    components: {
    },
    setup() {
        const { t } = useI18n()
    // const router = useRouter()
    
    return {
        t
    }

    }
}
</script>