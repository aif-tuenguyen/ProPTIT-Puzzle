import { baseConfig } from "src/config";
import BaseServices from "./baseServices";

interface ILoginParams {
  email: string,
  password: string
}

interface IRegisterParams {
  email: string,
  password: string,
  name: string,
  phone: string
}
 
export class AuthServices extends BaseServices {
 constructor() {
   super(baseConfig.authServer);
 }
 
 login(params: ILoginParams) {
  return this.post(`/login`, params);
 }

 register(params: IRegisterParams) {
  return this.post(`/register`, params)
 }
 
}
 
export default new AuthServices();
 

