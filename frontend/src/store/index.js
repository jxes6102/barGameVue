import { createStore } from 'vuex'
import axios from 'axios'
import { ElLoading } from 'element-plus'
/*eslint-disable*/
export default createStore({
  state: {
    // pyURL:'https://0906-114-47-84-241.ngrok-free.app/gethistory',
    // origin:'http://127.0.0.1:5000/gethistory',
    // https://api.api68.com/LuckTwenty/getBaseLuckTwentyList.do
    todayrecord:{},
    allrecord:[],
    loadingObj:null,
    isMobile:false
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
    changeLoading (state,status) {
      if(status){
        state.loadingObj = ElLoading.service({
          lock: true,
          text: 'Loading',
          background: 'rgba(0, 0, 0, 0.7)',
        })
      }else{
        state.loadingObj.close()
        // console.log('loadingObj',state.loadingObj)
      }
    },
    setMobile (state,value){
      state.isMobile = (value <= 768) ? true : false
    }
  },
  actions: {
    async pyGet(content,payload) {
      await axios.get('https://0906-114-47-84-241.ngrok-free.app/gethistory')
      .then((response) => {
        // handle success
        content.commit('setTodayrecord',response.data)
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
          target.push([response.data.result.data.slice((i-1)*100,i*100)])
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
