import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
  state: {
    tokenInfo: null,
    userInfo: null,
    loading: false
  },
  mutations: {
    setLogin(state, val) {
      state.tokenInfo = val
    },
    setUserInfo(state, val) {
      state.userInfo = val
    },
    setLoading(state, val) {
      state.loading = val
    }
  },
  actions: {
    setLoginRequest(context, payload) {
      context.commit('setLoading', true)
      const params = {
        "Email": payload.email,
        "Password": payload.password,
        "GrantType": "password",
        "Scope": "amazon_data",
        "ClientId": "C0001",
        "ClientSecret": "SECRET0001",
        "RedirectUri": "https://api.eva.guru"
      }
      var requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
        },
        redirect: "follow",
        body: JSON.stringify(params),
      };
      return fetch(`${process.env.VUE_APP_BASE_URL}oauth/token`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result?.ApiStatus) {
          localStorage.setItem("tokenInfo", JSON.stringify(result?.Data))
          context.commit('setLogin', result?.Data)
        }else {
          context.commit('setLogin', null)
        }
        return this.state.tokenInfo
      }).catch(error => { return error })
      .finally(()=>{context.commit('setLoading', false)})
    },
    setUserInformation(context, payload) {
      context.commit('setLoading', true)
      let token = JSON.parse(localStorage.getItem('tokenInfo'))?.AccessToken
      var requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.trim() || null}`
        },
        redirect: "follow",
        body: JSON.stringify(payload),
      };
      return fetch(`${process.env.VUE_APP_BASE_URL}user/user-information`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result?.ApiStatus) {
          context.commit('setUserInfo', result?.Data)
          localStorage.setItem("userInfo", JSON.stringify(result?.Data))
        }
        return this.state.userInfo
      }).catch(error => {return error})
      .finally(()=>{context.commit('setLoading', false)})
    },
    fetchDailySalesOverview(context, payload) {
      context.commit('setLoading', true)
      let token = JSON.parse(localStorage.getItem('tokenInfo'))?.AccessToken
      var requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.trim() || null}`
        },
        redirect: "follow",
        body: JSON.stringify(payload),
      };
      return fetch(`${process.env.VUE_APP_BASE_URL}data/daily-sales-overview`,requestOptions)
      .then(response => response.json())
      .then(result => {
        if (result?.ApiStatus) {
          return result?.Data
        }
      }).catch(error => {return error})
      .finally(()=>{context.commit('setLoading', false)})
    },
    fetchDailySalesSkuList(context, payload) {
      context.commit('setLoading', true)
      let token = JSON.parse(localStorage.getItem('tokenInfo'))?.AccessToken
      var requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.trim() || null}`
        },
        redirect: "follow",
        body: JSON.stringify(payload),
      };
      return fetch(`${process.env.VUE_APP_BASE_URL}data/daily-sales-sku-list`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result?.ApiStatus) {
          return result?.Data
        }
      }).catch(error => {return error})
      .finally(()=>{context.commit('setLoading', false)})
    },
    fetchGetSkuRefundRate(context, payload) {
      context.commit('setLoading', true)
      let token = JSON.parse(localStorage.getItem('tokenInfo'))?.AccessToken
      var requestOptions = {
        method: 'POST',
        headers: {
          "Content-Type": "application/json",
          "Authorization": `Bearer ${token.trim() || null}`
        },
        redirect: "follow",
        body: JSON.stringify(payload),
      };
      return fetch(`${process.env.VUE_APP_BASE_URL}data/get-sku-refund-rate`, requestOptions)
      .then(response => response.json())
      .then(result => {
        if(result?.ApiStatus) {
          return result?.Data
        }
      }).catch(error => {return error})
      .finally(()=>{context.commit('setLoading', false)})
    }
    
  },
  modules: {
  }
})
