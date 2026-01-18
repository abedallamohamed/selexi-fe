import { createApp } from 'vue'
import App from './App.vue'
import router from './router'
import { httpService } from './services'

// Set router in httpService to handle redirects on 401
httpService.setRouter(router)

createApp(App).use(router).mount('#app')
