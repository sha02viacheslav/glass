import { AddressType } from '@glass/enums'
import { Address, ApiResponse } from '@glass/models'
import { postApi } from '@glass/services/apis/api.service'

export const createAddressService = async (
  customerId: number,
  addressType: AddressType,
  address: Address,
): Promise<ApiResponse<Address[]>> => {
  return await postApi(
    addressType === AddressType.INVOICE ? 'customer/address/add_invoice' : 'customer/address/add_delivery',
    {
      customer_id: customerId,
      line_1: address.line_1,
      line_2: address.line_2,
      postcode: address.postcode,
      latitude: address.latitude,
      longitude: address.longitude,
      town_or_city: address.town_or_city,
      county: address.county,
      country: address.country,
    },
  )
}
