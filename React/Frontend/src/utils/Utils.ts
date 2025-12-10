import { createSHA256 } from "hash-wasm";


export async function sha256FileChunked(file: File): Promise<string>{
  const hasher = await createSHA256();
  const reader = file.stream().getReader();
  while(true){
    const {done, value} = await reader.read();
    if( done) break;
    hasher.update(value);
  }

  return hasher.digest("hex");
}
