import { createStore } from 'vuex'
import { getTime,getLotteryList,getLotteryLatest,getAdvertise } from '@/api/api'
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
    musicStatus:false,
    dataTotal:0,
    bingoLatest:{},
    bingoTotal:0,
    advertisementData:{
      adTop:'',
      adTopClick:'',
      adUnder:'',
    }
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
    setDataTotal(state,value){
      state.dataTotal = value
    },
    setBingoLatest(state,value){
      state.bingoLatest = value
    },
    setAdvertisement(state,value){
      state.advertisementData = value
    },
  },
  actions: {
    async pyGet(content,payload) {
      // "112043649": [
      //   "09 15 17 18 24 34 36 37 38 45  53 55 59 62 68 69 72 74 75 76 ",
      //   "24",
      //   "\uff0d",
      //   "\u548c",
      //   "7:20"
      // ],

      //07:05~23:55

      let pageMax = 50
      let apiPayload = {
        openDate:payload.date,
        pageNum:payload.page,
        pageSize:pageMax
      }

      await getLotteryList(apiPayload)
      .then((response) => {
        // handle success
        let data = response.data.content.bingoQueryResult
        let count = response.data.content.totalSize
        // console.log('response',response.data.content)
        content.commit('setDataTotal',count)
        let target = []
        for(let key in data){
            let toSC = data[key].oddEven
            if(toSC === '小單') toSC = payload.getText('result2')
            else if(toSC === '單') toSC = payload.getText('result1')
            else if(toSC === '小雙') toSC = payload.getText('result4')
            else if(toSC === '雙') toSC = payload.getText('result5')
            else if(toSC === '和') toSC = payload.getText('result3')

            let time = count-((payload.page-1)*pageMax) - parseInt(key)
            let min = time*5
            let str = (((7+Math.floor(min/60)) < 10) ? '0'+ (7+Math.floor(min/60)) : (7+Math.floor(min/60)))
            + ':' + (((min%60) < 10) ? '0'+ (min%60) : (min%60))
            
            target.push({
                no:data[key].drawTerm,
                reward:data[key].openShowOrder,
                rewardSort:data[key].bigShowOrder,
                special:data[key].bullEye,
                sizeDecision:'?',
                // sizeDecision:data[key][2],
                decision:toSC,
                time:str
            })

            content.commit('setTodayrecord',target)
        }
      })
      .catch(function (error) {
        // handle error
        console.log(error);
      })
      .finally(function () {
        // always executed
      });

      // getHistory().then((response) => {
      //   // handle success
      //   let data = response.data
      //   let target = []
      //   for(let key in data){
      //       if(!data[key].length) continue
      //       let toSC = data[key][3]
      //       if(toSC === '小單') toSC = payload.getText('result2')
      //       else if(toSC === '單') toSC = payload.getText('result1')
      //       else if(toSC === '小雙') toSC = payload.getText('result4')
      //       else if(toSC === '雙') toSC = payload.getText('result5')
      //       else if(toSC === '和') toSC = payload.getText('result3')
      //       target.push({
      //           no:key,
      //           reward:data[key][0].split(' ').filter((item) => item),
      //           special:data[key][1],
      //           sizeDecision:data[key][2],
      //           singleDecision:toSC,
      //           time:data[key][4]
      //       })
      //   }
      //   console.log('target',target)
      //   content.commit('setTodayrecord',target)
      // })
      // .catch((error) => {
      //   // handle error
      //   console.log(error);
      // })
      // .finally(()=> {
      //   // always executed
      //   // console.log('always executed')
      // });
    },
    async getOriginTime(content) {
      await getTime().then((response) => {
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

      // getTime().then((response) => {
      //   let date = new Date(response.data.time * 1000)
      //   let hour = date.getHours()
      //   if((hour>=0) && (hour<7)) {
      //     content.commit('setClosestatus',true)
      //   }else{
      //     content.commit('setClosestatus',false)
      //   }
      //   let second = 300 - (date.getMinutes()%5*60 + date.getSeconds())
      //   content.commit('setOriginTime',second)
      // })
      // .catch((error) => {
      //   // handle error
      //   console.log(error);
      // })
      // .finally(()=> {
      //   // always executed
      //   // console.log('always executed')
      // });
    },
    // async getOtherHistory(content,payload) {
    //   // console.log('payload',payload)
    //   let url = 'https://api.api68.com/LuckTwenty/getBaseLuckTwentyList.do'
    //   url+='?lotCode=10047'
    //   url+='&date='+payload.day

    //   await axios.get(url)
    //   .then((response) => {
    //     // handle success
    //     // let page = Math.floor((response.data.result.data.length/100) + 1)
    //     // let target = []
    //     // for(let i = 1;i<=page;i++){
    //     //   target.push(response.data.result.data.slice((i-1)*100,i*100))
    //     // }
    //     // content.commit('setAllrecord',target)
    //     content.commit('setAllrecord',response.data.result.data)
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
    async getLatest(content) {
      // console.log('payload',payload)
      await getLotteryLatest()
      .then((response) => {
        // handle success
        // console.log('response',response.data.content.lotteryBingoLatestPost)
        content.commit('setBingoLatest',response.data.content.lotteryBingoLatestPost)
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
    async callAdvertise(content,payload) {
      // console.log('payload',payload)
      let target = {
        adTop:'',
        adTopClick:'',
        adUnder:'',
      }

      await getAdvertise()
      .then((response) => {
        if(response.data.status){
          let temp = response.data.data
          target.adTop = temp.find((item) => item.state==1)?.pic
          target.adTopClick = temp.find((item) => item.state==2)?.pic
          target.adUnder = temp.find((item) => item.state==3)?.pic
        }
      })
      .catch((error) => {
        // handle error
        console.log('getAdvertise error',error);
      })
      .finally(() => {
        // console.log('target',target)
        content.commit('setAdvertisement',target)
        // always executed
      });
   
    },
  },
  
  modules: {
  }
})
