const axios = require("axios");
const path = require('path')
const { readFileSync, writeFileSync, mkdirSync, accessSync, constants, appendFileSync } = require("fs");
const { default: swaggerToTS } = require("openapi-typescript");
const outputDir = path.resolve('./swagger_interface')
const outputSwJson = path.resolve(`./swagger_interface/swagger.json`)
const outputInterface = path.resolve(`./swagger_interface/interface.ts`)
const cacheDir = path.resolve(`./node_modules/.InterfacePortal`)
const md5 = require("md5");

function InterfacePortal ({ apiPath = "" }) {
  const _apiPath = apiPath
  const _catchFile = `${cacheDir}/${md5(_apiPath)}.txt`
  const _logFile = `${cacheDir}/${md5(_apiPath)}_log.txt`
  return {
    name: 'interface-portal',
    apply: 'serve',
    enforce: 'pre',
    handleHotUpdate () {
      try {
        mkdirSync(cacheDir);
        writeFileSync(_catchFile, "");
      } catch (error) {
        try {
          accessSync(_catchFile, constants.R_OK | constants.W_OK)
        } catch (e) {
          writeFileSync(_catchFile, "");
        }
      }
      const lastHash = readFileSync(_catchFile, 'utf-8')
      axios
        .get(_apiPath)
        .then(async ({ data: res }) => {
          const resStr = JSON.stringify(res['components'])
          const currentHash = resStr.length.toString()
          if (lastHash !== currentHash) {
            writeFileSync(_catchFile, currentHash)
            try {
              accessSync(outputDir, constants.R_OK | constants.W_OK)
            } catch (error) {
              mkdirSync(outputDir, { recursive: true })
            }
            const output = await swaggerToTS(res);
            writeFileSync(outputInterface, output);
          }
        }).catch((e) => {
          writeFileSync(_logFile, `${e.toString()}\n`)
          appendFileSync(_logFile, e.response['data'])
        })
      return null
    }
  }
}
module.exports = InterfacePortal
InterfacePortal.default = InterfacePortal