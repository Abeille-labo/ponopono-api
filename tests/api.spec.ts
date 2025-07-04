import {setDefaultTimeout, test} from "bun:test"
import {createInterface} from "node:readline/promises"
import {PonopnoApi} from "../src/index.ts"
setDefaultTimeout(0)
test("ponopono api test", async () => {
  const rl = createInterface(process.stdin, process.stdout)
  const apiKey = await rl.question("api key: ")
  const apiSecret = await rl.question("api secret: ")
  console.log(apiKey, apiSecret)
  const api = new PonopnoApi(apiKey, apiSecret)
  const res = await api.searchFiles({})
  const [first] = res.data
  const file = await api.getFile(first!.downloadPath)
  console.log(file.filename)
})