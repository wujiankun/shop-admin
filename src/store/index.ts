import {createStore, Store, useStore as baseUseStore} from 'vuex'
import {InjectionKey} from 'vue'
import {IUserInfo} from '@/api/types/common';
// 声明自己的 store state
export interface State {
  count?:number,
  isCollapse?:boolean,
  user:IUserInfo
}
export const key:InjectionKey<Store<State>> = Symbol('state')
const store = createStore<State>({
  state () {
    return {
      isCollapse: false,
      user: JSON.parse(localStorage.getItem('user') || '') as IUserInfo
    }
  },
  getters: {},
  mutations: {
    setIsCollapse (state, payload) {
      state.isCollapse = payload
    },
    setUser (state, payload) {
      state.user = payload
      localStorage.setItem('user', JSON.stringify(state.user))
    }
  },
  actions: {},
  modules: {}
})

// 这里是为了组件中使用 useStore 生成 store 时 state 有类型支持
export function useStore () {
  return baseUseStore(key)
}

export default store
