<template>
    <div>
        <div class="fixed top-[30%] md:top-[20%] right-0 m-1 md:m-2 w-[60px] h-[60px] md:w-[100px] md:h-[100px] z-[50]">
            <img src="@/assets/images/download_qr.png" alt="">
        </div>
        <!-- <div class="absolute top-0 left-0 w-[100vw] h-[200vh] bg-gray-300 z-[333]"></div> -->
    </div>
    
</template>

<script>
// @ is an alias to /src
// import { useRouter } from "vue-router";
import { useI18n } from 'vue-i18n'
export default {
    name: 'linkView',
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