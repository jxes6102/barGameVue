<template>
    <div class="w-[100vw] h-auto">
        <div class="w-full h-[5vh] md:h-[20vh]"></div>
        <div
            v-if="isImgLoad"
            @click="link"
            :class="status ? 'bottom-0' : 'bottom-[-15vh] md:bottom-[-20vh]'"
            class="fixed left-1/2 -translate-x-1/2 w-[auto] h-[auto] flex flex-wrap justify-center items-center z-[222] transition-all duration-500">
            <div
                class="bg-white flex flex-wrap justify-center items-center cursor-pointer z-[222]"
                :style="styleObject">
                <img class="w-full h-full" :src="adUnderUrl || require('@/assets/images/ad-2.png')" alt="">
                <!-- <div class="text-2xl text-gray-500 font-extrabold">{{t('advertisement')}}</div> -->
            </div>
            <div @click.stop="changeDisplay" class="absolute w-auto h-auto top-[-30px] md:top-[-40px] right-0 bg-gray-100 cursor-pointer z-[221]">
                <el-icon :size="isMobiles ? 30 : 40" color="#00308F">
                    <component :is="status ? 'ArrowDownBold' : 'ArrowUpBold'"></component>
                </el-icon>
            </div>
        </div>
    </div>
</template>

<script>
/*eslint-disable*/
// @ is an alias to /src
// import { useRouter } from "vue-router";
import { ref,computed,watch } from 'vue'
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
        const adUnderUrl = computed(() => {
            return store.state.advertisementData.adUnder?.pic || ''
        })
        const adUnderUrlLink = computed(() => {
            return store.state.advertisementData.adUnder?.url || ''
        })
        const { t } = useI18n()
        const link = () => {
            window.open(adUnderUrlLink.value)
        }
        const status = ref(true)
        const changeDisplay = () => {
            status.value = !status.value
        }
        
        const isImgLoad = ref(false)
        const styleObject = ref({
            width: '',
            height: ''
        })
        const onImageLoaded = () => {
            let image = new Image()

            if(!adUnderUrl.value){
                image.src = require('@/assets/images/ad-2.png');
            }else{
                image.src = adUnderUrl.value;
            }
            
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
        
        watch(adUnderUrl, async(newVal,oldVal)=>{
            onImageLoaded()
        },{immediate:true})

        return {
            isMobiles,
            status,
            styleObject,
            isImgLoad,
            adUnderUrl,
            t,
            link,
            changeDisplay,
        }

    }
}
</script>