import { createStore } from 'vuex'
import axios from 'axios'
import { useI18n } from 'vue-i18n'
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
    daykey:{
      date:'2023/7/1',
      term:112036744
    },
    termInTimeData:{},
    originTime:0
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
    countDayTerm(state){
      let countDiff = (sDate1, sDate2) => { // yyyy-mm-dd 格式
        let oDate1 = new Date(sDate1);
        let oDate2 = new Date(sDate2);
        let iDays = parseInt((oDate1 - oDate2) / 1000 / 60 / 60 / 24); // 把相差的毫秒數轉換為天數
        return iDays;
      };
      let dt = new Date()
      let nowDate = (1900+dt.getYear())+'/'+(dt.getMonth()+1)+'/'+dt.getDate()
      let diffDay = countDiff(nowDate,state.daykey.date)
      let countTrem = state.daykey.term + diffDay*203
      let timeSecond = 425
      for(let i = 0;i<203;i++){
        let timeStr = Math.floor(timeSecond/60) + ":" + (timeSecond%60 >= 10 ? timeSecond%60 : '0' + timeSecond%60)
        state.termInTimeData[countTrem] = timeStr
        countTrem++
        timeSecond+=5
      }
    },
    countSecond(state){
      window.setInterval((async() => {
        if(state.originTime > 0){
          state.originTime--
        }else{
          state.originTime = 300
        }
      } ), 1000)
    }
  },
  actions: {
    async pyGet(content,payload) {
      getHistory().then((response) => {
        // handle success
        let data = response.data
        let target = []
        // let time = 425
        for(let key in data){
            let toSC = data[key][3]
            // let timeStr = Math.floor(time/60) + ":" + (time%60 >= 10 ? time%60 : '0' + time%60)
            // time+=5
            let timeStr = content.state.termInTimeData[key]
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
        let second = 300 - (date.getMinutes()%5*60 + date.getSeconds())
        content.state.originTime = second
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
    async getTodayHistory(content) {
      await axios.get('https://c113-61-227-7-196.ngrok-free.app/gethistory')
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
