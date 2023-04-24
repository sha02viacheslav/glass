import { AddressType } from '@glass/enums'
import { Address, ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const getAddressesService = async (
  customerId: number,
  addressType: AddressType,
): Promise<ApiResponse<Address[]>> => {
  return await postApi(
    addressType === AddressType.INVOICE ? 'customer/address/get_invoice' : 'customer/address/get_delivery',
    {
      customer_id: customerId,
    },
  )
}
