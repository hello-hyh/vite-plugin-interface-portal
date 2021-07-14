const axios = require("axios");
const path = require('path')
const { readFileSync, writeFileSync, mkdirSync, accessSync, constants } = require("fs");
const { default: swaggerToTS } = require("openapi-typescript");
const outputDir = path.resolve('./swagger_interface')
const outputSwJson = path.resolve(`./swagger_interface/swagger.json`)
const outputInterface = path.resolve(`./swagger_interface/interface.ts`)
const os = require('os');
const cacheDir = `${os.homedir()}/.InterfacePortal`
const md5 = require("md5");

export default function InterfacePortal ({ apiPath = "" }) {
  const _apiPath = apiPath
  const _catchFile = `${cacheDir}/${md5(_apiPath)}.txt`
  return {
    name: 'interface-portal',
    apply: 'serve',
    enforce: 'pre',
    handleHotUpdate () {
      console.log('end')
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
          const currentHash = md5(res)
          if (lastHash !== currentHash) {
            writeFileSync(_catchFile, currentHash)
            try {
              accessSync(outputDir, constants.R_OK | constants.W_OK)
            } catch (error) {
              mkdirSync(outputDir, { recursive: true })
            }
            writeFileSync(outputSwJson, JSON.stringify(res));
            const input = JSON.parse(readFileSync(outputSwJson, "utf8"));
            const output = await swaggerToTS(input);
            writeFileSync(outputInterface, output);
          }
        }).catch((e) => {
          console.error('interfac-portal: ', e)
        })
      return null
    }
  }
}