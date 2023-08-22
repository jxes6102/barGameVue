import { createStore } from 'vuex'
import axios from 'axios'
import {getHistory,getTime} from '@/api/api'
/*eslint-disable*/
export default createStore({
  state: {
    // pyURL:'https://c113-61-227-7-196.ngrok-free.app/gethistory',
    // origin:'http://127.0.0.1:5000/gethistory',
    // https://api.api68.com/LuckTwenty/getBaseLuckTwentyList.do
    todayrecord:[],
    allrecord:[],
    isMobile:false,
    originTime:0,
    closeStatus:false,
    musicStatus:false
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
    },
    setOriginTime(state,value){
      state.originTime = value
    },
    countOriginTime(state){
      if(state.originTime>0){
        state.originTime--
      }else{
        state.originTime = 300
      }
    },
    setClosestatus(state,value){
      state.closeStatus = value
    },
    setMusicStatus(state){
      state.musicStatus = !state.musicStatus 
    },
  },
  actions: {
    async pyGet(content,payload) {
      getHistory().then((response) => {
        // handle success
        let data = response.data
        let target = []
        for(let key in data){
            if(!data[key].length) continue
            let toSC = data[key][3]
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
                time:data[key][4]
            })
        }
        // console.log('target',target)
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
    async getOriginTime(content,payload) {
      getTime().then((response) => {
        let date = new Date(response.data.time * 1000)
        let hour = date.getHours()
        if((hour>=0) && (hour<7)) {
          content.commit('setClosestatus',true)
        }else{
          content.commit('setClosestatus',false)
        }
        let second = 300 - (date.getMinutes()%5*60 + date.getSeconds())
        content.commit('setOriginTime',second)
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
        // let page = Math.floor((response.data.result.data.length/100) + 1)
        // let target = []
        // for(let i = 1;i<=page;i++){
        //   target.push(response.data.result.data.slice((i-1)*100,i*100))
        // }
        // content.commit('setAllrecord',target)
        content.commit('setAllrecord',response.data.result.data)
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
