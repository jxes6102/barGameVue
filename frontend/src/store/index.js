import { createStore } from 'vuex'
import axios from 'axios'
/*eslint-disable*/
export default createStore({
  state: {
    // pyURL:'https://591d-114-47-82-149.ngrok-free.app/gethistory',
    // origin:'http://127.0.0.1:5000/gethistory',
    todayrecord:{},
  },
  getters: {
  },
  mutations: {
    setTodayrecord(state,value){
      state.todayrecord = value
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
    }
  },
  modules: {
  }
})
