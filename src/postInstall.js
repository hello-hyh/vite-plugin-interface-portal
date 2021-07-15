const path = require('path')
const fs = require('fs')
function postInstallFunc () {
  fs.readFile(path.resolve('../../.gitignore'), "utf8", (err, data) => {
    if (err) return
    if (!data.includes("/swagger_interface")) {
      fs.appendFileSync(path.resolve('../../.gitignore'), "\n/swagger_interface", "utf8")
      console.log('updated gitignore')
    } else {
      console.log("exist flag string")
    }
  })
}
module.exports = postInstallFunc
postInstallFunc()
