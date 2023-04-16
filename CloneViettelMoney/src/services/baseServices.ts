import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios';
import { clearLocalStorage } from 'src/utils';

class BaseServices {
  baseURL: string;

  http: AxiosInstance;

  configHeaders: AxiosRequestConfig | any;

  constructor(baseURL: string, configHeaders?: AxiosRequestConfig) {
    this.http = axios.create({
      baseURL
    });
    this.baseURL = baseURL;
    this.configHeaders = configHeaders;
    this.http.interceptors.response.use(
      (response) => response,
      (error) => {
        const { response } = error;
        if (response) {
          switch (response.status) {
            case 401:
              clearLocalStorage();
              window.location.href = '/account/login';
              return;
            case 500:
              if (response.data.message === 'jwt expired') {
                clearLocalStorage();
                window.location.href = '/account/login';
              }
              return;
            case 609:
              localStorage.removeItem('shopId');
              return;
            default:
              console.log(response);
              return;
          }
        }
        return Promise.reject(error);
      }
    );
  }

  setConfigHeaders(): AxiosRequestConfig {
    const token: string = localStorage.getItem('token') || '';
    const shopId: string = localStorage.getItem('shopId') || '';
    const config = {
      headers: {
        'content-type': 'application/json',
        'access-token': token,
        'shop-id': shopId
      },
      ...this.configHeaders
    };
    return config;
  }

  _fetch(
    url: string,
    configHeaders?: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {
    return this.http.get(url, { ...configHeaders });
  }

  _post(
    url: string,
    data?: any,
    configHeaders?: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {
    return this.http.post(url, data, {
      ...configHeaders
    });
  }

  get(
    url: string,
    configHeaders?: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {
    return this.http.get(url, { ...this.setConfigHeaders(), ...configHeaders });
  }

  post(
    url: string,
    data?: any,
    configHeaders?: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {
    return this.http.post(url, data, {
      ...this.setConfigHeaders(),
      ...configHeaders
    });
  }

  put(
    url: string,
    data?: any,
    configHeaders?: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {
    return this.http.put(url, data, {
      ...this.setConfigHeaders(),
      ...configHeaders
    });
  }

  patch(
    url: string,
    data?: any,
    configHeaders?: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {
    return this.http.patch(url, data, {
      ...this.setConfigHeaders(),
      ...configHeaders
    });
  }

  delete(
    url: string,
    configHeaders?: AxiosRequestConfig
  ): Promise<AxiosResponse<any>> {
    return this.http.delete(url, {
      ...this.setConfigHeaders(),
      ...configHeaders
    });
  }
}

export default BaseServices;
