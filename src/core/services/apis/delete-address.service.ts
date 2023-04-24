import { AddressType } from '@glass/enums'
import { ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const deleteAddressService = async (
  customerId: number,
  addressType: AddressType,
  addressId: number,
): Promise<ApiResponse<boolean>> => {
  return await postApi(
    addressType === AddressType.INVOICE ? 'customer/address/remove_invoice' : 'customer/address/remove_delivery',
    {
      customer_id: customerId,
      address_id: addressId,
    },
  )
}
