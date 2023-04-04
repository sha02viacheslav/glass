import axios from 'axios'
import { REACT_APP_API_URL, REACT_APP_API_KEY } from '@glass/envs'

export const postApi = async (url: string, params: object) => {
  try {
    const data = JSON.stringify({
      jsonrpc: '2.0',
      params,
    })

    const config = {
      method: 'post',
      url: `${REACT_APP_API_URL}${url}`,
      headers: {
        'Content-Type': 'application/json',
        'api-key': REACT_APP_API_KEY,
      },
      data: data,
    }

    const response = await axios(config)
    if (response?.data?.result?.status === 'error') {
      console.warn(response.data.result.msg)
      return {
        success: false,
        data: null,
        message: response.data.result.msg,
      }
    }

    return {
      success: true,
      data: response.data.result.data,
      message: response.data.result.message,
    }
  } catch (error) {
    return {
      success: false,
      data: null,
      message: 'Error',
    }
  }
}
