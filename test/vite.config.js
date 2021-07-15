import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import InterfacePortal from 'vite-plugin-interface-portal'
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [vue(), InterfacePortal({ apiPath: 'https://dmpkservice-test.wuxiapptec.com/DMPK.ServicePortal.WebApi/swagger/v1/swagger.json?_1626236438011' })]
})
