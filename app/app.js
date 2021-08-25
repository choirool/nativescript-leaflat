import Vue from 'nativescript-vue'
import WebViewPlugin from '@nativescript-community/ui-webview/vue';
import RadAutoComplete from 'nativescript-ui-autocomplete/vue';

Vue.use(WebViewPlugin);
Vue.use(RadAutoComplete);

import Home from './components/Home'

new Vue({
  render: (h) => h('frame', [h(Home)]),
}).$start()
