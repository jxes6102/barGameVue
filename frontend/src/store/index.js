import { createStore } from 'vuex'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
/*eslint-disable*/
export default createStore({
  state: {
    // pyURL:'https://0906-114-47-84-241.ngrok-free.app/gethistory',
    // origin:'http://127.0.0.1:5000/gethistory',
    // https://api.api68.com/LuckTwenty/getBaseLuckTwentyList.do
    todayrecord:[],
    allrecord:[],
    isMobile:false,
  },
  getters: {
  },
  mutations: {
    setTodayrecord(state,value){
      state.todayrecord = value
    },
    setAllrecord(state,value){
      state.allrecord = value
    },
    setMobile (state,value){
      state.isMobile = (value <= 768) ? true : false
    }
  },
  actions: {
    async pyGet(content,payload) {
      await axios.get('http://127.0.0.1:5000/gethistory')
      .then((response) => {
        // handle success
        let data = response.data
        let target = []
        let time = 425
        for(let key in data){
            let toSC = data[key][3]
            let timeStr = Math.floor(time/60) + ":" + (time%60 >= 10 ? time%60 : '0' + time%60)
            time+=5
            if(toSC === '小單') toSC = payload.getText('result2')
            else if(toSC === '單') toSC = payload.getText('result1')
            else if(toSC === '小雙') toSC = payload.getText('result4')
            else if(toSC === '雙') toSC = payload.getText('result5')
            else if(toSC === '和') toSC = payload.getText('result3')
            target.push({
                no:key,
                reward:data[key][0].split(' ').filter((item) => item),
                special:data[key][1],
                sizeDecision:data[key][2],
                singleDecision:toSC,
                time:timeStr
            })
        }
        content.commit('setTodayrecord',target)
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
      .finally(()=> {
        // always executed
        // console.log('always executed')
      });
    },
    // async getHistory(content,payload) {
    //   // console.log('payload',payload)
    //   let url = 'https://globalcaipiaokong.com/api/trial/draw-result-by-datetime'
    //   url+='?code=twklb&rows=100'
    //   url+='&start_time='+payload.startTime+'&end_time='+payload.endTime+'&page='+payload.page

    //   await axios.get(url)
    //   .then((response) => {
    //     // handle success
    //     // console.log('getHistory',response)
    //     content.commit('setAllrecord',response.data.data)
    //   })
    //   .catch((error) => {
    //     // handle error
    //     console.log(error);
    //   })
    //   .finally(()=> {
    //     // always executed
    //     // console.log('always executed')
    //   });
    // },
    async getTodayHistory(content) {
      await axios.get('https://0906-114-47-84-241.ngrok-free.app/gethistory')
      .then((response) => {
        const { t } = useI18n()
        // handle success
        let target = []
        let data = []
        for(let key in response.data){
            let toSC = response.data[key][3]
            if(toSC === '小單') toSC = t('result2')
            else if(toSC === '單') toSC = t('result1')
            else if(toSC === '小雙') toSC = t('result4')
            else if(toSC === '雙') toSC = t('result5')
            else if(toSC === '和') toSC = t('result3')
            data.push({
              no:key,
              reward:response.data[key][0].split(' ').filter((item) => item),
              special:response.data[key][1],
              sizeDecision:response.data[key][2],
              singleDecision:toSC
            })
        }
        let page = Math.floor((data.length/100) + 1)
        for(let i = 1;i<=page;i++){
          target.push(data.slice((i-1)*100,i*100))
        }
        content.commit('setAllrecord',target)
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
      .finally(()=> {
        // always executed
        // console.log('always executed')
      });
    },
    async getOtherHistory(content,payload) {
      // console.log('payload',payload)
      let url = 'https://api.api68.com/LuckTwenty/getBaseLuckTwentyList.do'
      url+='?lotCode=10047'
      url+='&date='+payload.day

      await axios.get(url)
      .then((response) => {
        // handle success
        let page = Math.floor((response.data.result.data.length/100) + 1)
        let target = []
        for(let i = 1;i<=page;i++){
          target.push(response.data.result.data.slice((i-1)*100,i*100))
        }
        content.commit('setAllrecord',target)
      })
      .catch((error) => {
        // handle error
        console.log(error);
      })
      .finally(()=> {
        // always executed
        // console.log('always executed')
      });
    },
  },
  modules: {
  }
})
