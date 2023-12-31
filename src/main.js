import { createApp } from 'vue'
import App from './App.vue'

import Toast from "vue-toastification";

// Import the CSS or use your own!
import './style.css'
import './assets/tailwind.css'
import "vue-toastification/dist/index.css";

import router from './main_router.js'

const app = createApp(App)

app.use(router)
app.use(Toast, {
    position: "bottom-right",
    timeout: 2000,
    closeOnClick: true,
    pauseOnFocusLoss: true,
    pauseOnHover: false,
    draggable: true,
    draggablePercent: 0.7,
    showCloseButtonOnHover: false,
    hideProgressBar: true,
    closeButton: false,
    icon: true,
    rtl: false
});
app.mount('#app')