// test for bun test
import {setDefaultTimeout, test, expect, beforeAll} from "bun:test"
import {PonoponoApi} from "../src/index.ts"
setDefaultTimeout(0)
let api:PonoponoApi
beforeAll(()=>{
  const apiKey = process.env.API_KEY!
  const apiSecret = process.env.API_SECRET!
  api = new PonoponoApi(apiKey, apiSecret)
})
test("ponopono api test", async () => {
  const res = await api.searchFiles({})
  expect(res.data.length).toBeGreaterThan(0)
  const [first] = res.data
  const file = await api.getFile(first!.downloadPath)
  expect(file.file.byteLength).toBeGreaterThan(10)
})

test("ponopono api test with search filter", async () => {
  const res = await api.searchFiles({
    area: "03",
    from: "2025-01-01",
    to: "2025-01-31",
    xml: true,
    downloaded: true
  })
  expect(res.data.length).toBeGreaterThan(0)
  const [first] = res.data
  const file = await api.getFile(first!.downloadPath)
  expect(file.file.byteLength).toBeGreaterThan(1000)
})
test("ponopono api test with search filter", async () => {
  const res = await api.searchFiles({
    area: "03",
    from: "2025-02-01",
    to: "2025-02-28",
    xml: true,
    downloaded: false
  })
  expect(res.data.length).toBeGreaterThan(0)
})