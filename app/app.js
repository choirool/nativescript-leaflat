import Vue from 'nativescript-vue'
import WebViewPlugin from '@nativescript-community/ui-webview/vue';

Vue.use(WebViewPlugin);

import Home from './components/Home'

new Vue({
  render: (h) => h('frame', [h(Home)]),
}).$start()
