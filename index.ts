import { createHmac, sign } from "node:crypto"
type TSOArea = "01" | "02" | "03" | "04" | "05" | "06" | "07" | "08" | "09" | "10"
type PonoponoSearthParmas = {
  from?: string
  to?: string
  area?: TSOArea
  downloaded?: boolean
}
type PonoponoFileInfo = {
  area: TSOArea
  filename: string
  downloadPath: string
  type: string
  publishedAt: string
  lastDownloadedBy: string
  lastDaonwloadedAt: string
}
type PonoponoSearchFileResponse = {
  meta:{
    ppsCode: string
    total: number
  }
  data: PonoponoFileInfo[]
}
type FileResonse = {
  filename: string,
  file: ArrayBuffer
}
type PonoponoErrorResponse = {
  "error": "Unauthorized."
}
const PONOPONO_API_BASE_URL = "https://fp-ponopono.com"
const PONOPONO_API_BASE_PATH = "/pn-api/v1"
const TSO_FILES = "/tso-files"
const FILE_API_ENDPOINT = `${PONOPONO_API_BASE_URL}${PONOPONO_API_BASE_PATH}${TSO_FILES}`
export class PonopnoApi {
  constructor(private key:string, private secret:string) {}
  async searchFiles(searchParams?: PonoponoSearthParmas): Promise<PonoponoSearchFileResponse> {
    const params = new URLSearchParams()
    if(searchParams){
      Object.entries(searchParams).forEach(([key, value]) => {
        params.append(key, "" + value)
      })
    }
    const url = `${FILE_API_ENDPOINT}?${params.toString()}`
    const searchParam = 0 < params.size ? `?${params.toString()}` : ""
    const signaturePath = `${PONOPONO_API_BASE_PATH}${TSO_FILES}${searchParam}` 
    return fetch(url, {
      headers:this.createHeader("GET", signaturePath)
    }).then(async (r)=>{
      if(r.status !== 200){
        throw new Error((await r.json() as any).error)
      }
      return r.json() as any
    })
  }
  async getFile(downloadPath:string):Promise<FileResonse> {
    const endUrl = `${PONOPONO_API_BASE_URL}${downloadPath}`
    return fetch(endUrl, {
      headers: this.createHeader("GET", downloadPath)
    }).then(async(r)=>{
      if(r.status !== 200){
        throw new Error((await r.json() as any).error)
      }
      const _filename = decodeURIComponent(r.headers.get("content-disposition")?.split("=")[1]!)
      const filename = _filename.replace(/(?:^"|"$)/g, "")
      return {
        filename: filename,
        file: await r.arrayBuffer()
      }
    })
  }
  createHeader(method: "GET"|"POST", path: string): Record<string, string> {
    const timestamp= "" + Math.floor(Date.now() / 1000)
    const stirngToSign = `${timestamp}.${method}.${path}`
    
    const signature = createHmac("sha256", this.secret).update(stirngToSign, "utf8").digest("hex")
    return {
      "X-API-Key": this.key,
      "X-Timestamp": timestamp,
      "X-Signature": signature
    }
  }
}
