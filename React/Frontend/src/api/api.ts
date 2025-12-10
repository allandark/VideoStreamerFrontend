
// const API_URL = "/api";
export const API_URL = "http://localhost:8080/api";

// TODO: add jwt/creds
export class APIClient{
  jwtToken: string;
  apiUrl: string;

  constructor(api_url = API_URL, jwt = "") {
    this.jwtToken = jwt;
    this.apiUrl = api_url;
  }

  async get<T = object>(url: string): Promise<T[]>;
  async get<T = object>(url: string, param: string): Promise<T[]>;
  async get<T = object>(url: string, param: number): Promise<T>;
  async get<T = object>(url: string, param?: number | string): Promise<T | T[] | null> {
    const full_url = param !== undefined && param !== null && param !== '' ? 
      `${this.apiUrl}/${url}/${param}` : `${this.apiUrl}/${url}`;


    try{
      const response = await fetch(full_url, { credentials: 'include' });
      if (!response.ok) {
        throw new Error(`Response status: ${response.status}`);
      }
      const text = await response.text();
      return text ? JSON.parse(text) : null;  
    }catch (error: any){
      console.error(error.message);
      return null;
    }
  }
  async getBlob(url: string, param?: number ): Promise<Blob | null> {
  const full_url = param ? `${this.apiUrl}/${url}/${param}` : `${this.apiUrl}/${url}`;
  try {
    const response = await fetch(full_url);
    if (!response.ok) {
      throw new Error(`HTTP ${response.status}`);
    }
    return await response.blob();
  } catch (err) {
    console.error("GET blob request failed:", err);
    return null;
  }
}

  async post<Res = object>(url:string, body: FormData) : Promise<Res>;
  async post<Res = object, Req = object>(url:string, body: Req) : Promise<Res>;
  async post<Res = object, Req = object>(url:string, body: FormData | Req): Promise<Res| null>{
    const full_url = `${this.apiUrl}/${url}`;
    
    const options: RequestInit = {
      method: "POST",
    };
    
    if( body instanceof FormData){      
      options.body = body;
    }
    else {
      options.headers = {
        "Content-Type": "application/json",
      };
      options.body = JSON.stringify(body);
    }
    try{
      const response = await fetch(full_url, options);
          
      if (!response.ok) {
          throw new Error(`Error: ${response.status}`);
      }
      const text = await response.text();      
      return text ? JSON.parse(text) : null;
    }catch (err){
      console.error(err);
      return null;
    }

  }

   async put<Res = object, Req = object>(url:string, body: Req, id: number) : Promise<Res | null>{
      const full_url = `${this.apiUrl}/${url}/${id}`;
      try{
        const options: RequestInit = {
          method: "PUT",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify(body),
        };
        const response = await fetch(full_url, options);
          
        if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
        }
        const text = await response.text();      
        return text ? JSON.parse(text) : null;
      }catch (err){
        console.error(err);
        return null;
      }

   }

  async delete(url: string, id: number): Promise<Boolean>{
    const full_url = `${this.apiUrl}/${url}/${id}`;
    try{
      const response = await fetch(full_url, { method: "DELETE" });
      if (!response.ok) {
            throw new Error(`Error: ${response.status}`);
      }
      return true;
    }catch(err){
      console.error(err);
      return false
    }

  }


}



