# vite-plugin-interface-portal

use hmr hook to update swagger api & interface

using webpack? (interface-portal-plugin)[https://www.npmjs.com/package/interface-portal-plugin]

# Using

```js
// in vite.confing.js
import InterfacePortal from "vite-plugin-interface-portal";

export default defineConfig({
  plugins: [
    // other  code
    InterfacePortal({ apiPath: "your swagger ui json path" }),
  ],
});
```

# Please don't push swagger_interface dir to your code repository.
