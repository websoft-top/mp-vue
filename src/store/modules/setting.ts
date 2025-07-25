/**
 * 网站设置 store
 */
import { defineStore } from 'pinia';

export interface ParamsState {
  setting: any | null;
}

export const useWebsiteSettingStore = defineStore({
  id: 'setting',
  state: (): ParamsState => ({
    // 初始化时确保所有字段都已赋值
    setting: null,
  }),
  getters: {},
  actions: {
    setSetting(value: any) {
      this.setting = value;
    },
    getSetting(value: any){
      return value;
    }
  },
});
