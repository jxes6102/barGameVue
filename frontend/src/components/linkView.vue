<template>
    <div v-if="allStatus">
        <div
            @click="open"
            class="fixed top-[17%] md:top-[20%] right-0 w-[60px] h-[60px] md:w-[100px] md:h-[100px] z-[50] flex flex-wrap justify-center items-center cursor-pointer">
            <!-- <div class="text-lg text-gray-400 font-bold">font</div> -->
            <img class="w-full h-full" :src="adTopUrl || require('@/assets/images/ad-4.png')" alt="">
        </div>
        <Teleport to="body">
            <div
                @click.self="close"
                v-if="status"
                class="fixed w-[100%] h-[100%] top-0 left-0 bg-[rgb(65,65,65,0.7)] flex justify-center items-center z-[223] ">
                <div v-if="isImgLoad" class="relative w-auto h-auto bg-white z-[224]">
                    <img :style="styleObject" :src="adTopClickUrl || require('@/assets/images/ad-5.png')" alt="">
                    <div @click.stop="close" class="absolute w-auto h-auto top-0 right-0 cursor-pointer">
                        <el-icon :size="isMobiles ? 20 : 25" color="#ffffff"><Close /></el-icon>
                    </div>
                </div>
            </div>
        </Teleport>
    </div>
</template>

<script>
/*eslint-disable*/
// @ is an alias to /src
// import { useRouter } from "vue-router";
import { ref,computed,watch } from 'vue'
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
        const adTopUrl = computed(() => {
            return store.state.advertisementData.adTop?.pic || ''
        })
        const adTopClickUrl = computed(() => {
            return store.state.advertisementData.adTopClick?.pic || ''
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
        // const link = () => {
        //     window.open('https://mx2.vip/shouye/118.html')
        // }

        const closeAll = () => {
            allStatus.value = false
        }

        const isImgLoad = ref(false)
        const styleObject = ref({
            width: '',
            height: ''
        })
        const onImageLoaded = () => {
            let image = new Image()

            if(!adTopClickUrl.value){
                image.src = require('@/assets/images/ad-5.png');
            }else{
                image.src = adTopClickUrl.value;
            }

            image.onload = () => {
                if(isMobiles.value){
                    let countWidth = 80
                    let countHeight = countWidth*(image.height/image.width).toFixed(2)
                    styleObject.value.height = countHeight+'vw'
                    styleObject.value.width = countWidth+'vw'
                }else{
                    let countHeight = 80
                    let countWidth = countHeight*(image.width/image.height).toFixed(2)
                    
                    styleObject.value.height = countHeight+'vh'
                    styleObject.value.width = countWidth+'vh'
                }

                isImgLoad.value = true
            };

        }

        watch(adTopClickUrl, async(newVal,oldVal)=>{
            onImageLoaded()
        },{immediate:true})

        return {
            t,
            status,
            allStatus,
            isMobiles,
            styleObject,
            isImgLoad,
            adTopUrl,
            adTopClickUrl,
            closeAll,
            open,
            close,
        }

    }
}
</script>