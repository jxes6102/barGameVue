import { createStore } from 'vuex'
import axios from 'axios'
import { ElLoading } from 'element-plus'
/*eslint-disable*/
export default createStore({
  state: {
    // pyURL:'https://591d-114-47-82-149.ngrok-free.app/gethistory',
    // origin:'http://127.0.0.1:5000/gethistory',
    todayrecord:{},
    loadingObj:null
  },
  getters: {
  },
  mutations: {
    setTodayrecord(state,value){
      state.todayrecord = value
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
    }
  },
  actions: {
    async pyGet(content,payload) {
      axios.get('https://591d-114-47-82-149.ngrok-free.app/gethistory')
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
    async getHistory(content,payload) {
      axios.get('https://591d-114-47-82-149.ngrok-free.app/gethistory')
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
  },
  modules: {
  }
})
