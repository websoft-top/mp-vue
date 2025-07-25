/**
 * 接收传参 store
 */
import { defineStore } from 'pinia';

export interface ParamsState {
  title: string | null;
  comments: string | null;
  back: string | null;
  redirect: string | null | undefined;
}

export const useParamsStore = defineStore({
  id: 'params',
  state: (): ParamsState => ({
    // 标题
    title: '操作成功',
    // 描述
    comments: '您的申请已提交',
    // 当前页面路径
    back: null,
    // 跳转的页面
    redirect: null
  }),
  getters: {},
  actions: {
    setTitle(value: string) {
      this.title = value;
    },
    setComments(value: string) {
      this.comments = value;
    },
    setBack(value: string) {
      this.back = value;
    },
    setRedirect(value: string) {
      this.redirect = value;
    }
  }
});
