// test for bun test
import {setDefaultTimeout, test} from "bun:test"
import {PonoponoApi} from "../src/index.ts"
setDefaultTimeout(0)
test("ponopono api test", async () => {
  const apiKey = process.env.API_KEY!
  const apiSecret = process.env.API_SECRET!
  console.log(apiKey, apiSecret)
  const api = new PonoponoApi(apiKey, apiSecret)
  const res = await api.searchFiles({})
  const [first] = res.data
  const file = await api.getFile(first!.downloadPath)
  console.log(file.filename, file.file.byteLength)
})