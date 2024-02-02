<template>
    <div v-if="status" class="w-[100vw] h-auto">
        <div class="w-full h-[5vh] md:h-[20vh]"></div>
        <div
            v-if="isImgLoad"
            @click="link"
            class="fixed left-1/2 -translate-x-1/2 bottom-0 w-[auto] h-[auto] flex flex-wrap justify-center items-center z-[222]">
            <div
                class="bg-white flex flex-wrap justify-center items-center cursor-pointer"
                :style="styleObject">
                <img class="w-full h-full" src="@/assets/images/ad-2.png" alt="">
                <!-- <div class="text-2xl text-gray-500 font-extrabold">{{t('advertisement')}}</div> -->
            </div>
            <!-- <div @click.stop="close" class="absolute w-auto h-auto top-0 right-0 cursor-pointer">
                <el-icon :size="isMobiles ? 30 : 40" color="#F0FFFF"><Close /></el-icon>
            </div> -->
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
        const url = ref('https://mx2.vip/shouye/118.html')
        const link = () => {
            window.open(url.value)
        }
        const status = ref(true)
        const close = () => {
            status.value = false
        }
        
        const isImgLoad = ref(false)
        const styleObject = ref({
            width: '',
            height: ''
        })
        const onImageLoaded = () => {
            let image = new Image()

            image.src = require('@/assets/images/ad-2.png');

            image.onload = () => {
                if(isMobiles.value){
                    let countWidth = 100
                    // let countHeight = countWidth*(image.height/image.width).toFixed(2)
                    styleObject.value.height = 15+'vh'
                    styleObject.value.width = countWidth+'vw'
                }else{
                    let countWidth = 80
                    // let countHeight = countWidth*(image.height/image.width).toFixed(2)
                    styleObject.value.height = 20+'vh'
                    styleObject.value.width = countWidth+'vw'
                }
                isImgLoad.value = true
            };
            

        }
        onImageLoaded()

        return {
            isMobiles,
            status,
            styleObject,
            isImgLoad,
            t,
            link,
            close,
        }

    }
}
</script>