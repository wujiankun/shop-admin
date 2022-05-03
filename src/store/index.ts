import {createStore, Store, useStore as baseUseStore} from 'vuex'
import {InjectionKey} from 'vue'
// 声明自己的 store state
export interface State {
  count?:number,
  isCollapse?:boolean
}
export const key:InjectionKey<Store<State>> = Symbol('state')
const store = createStore<State>({
  state () {
    return {isCollapse: false}
  },
  getters: {},
  mutations: {
    setIsCollapse (state, payload) {
      state.isCollapse = payload
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
