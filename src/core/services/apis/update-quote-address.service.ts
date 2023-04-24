import { AddressType } from '@glass/enums'
import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const updateQuoteAddressService = async (
  qid: string,
  addressType: AddressType,
  addressId: number,
): Promise<ApiResponse<boolean>> => {
  return await postApi(
    addressType === AddressType.INVOICE ? 'order/address/update_invoice' : 'order/address/update_delivery',
    {
      fe_token: qid,
      address_id: addressId,
    },
  )
}
