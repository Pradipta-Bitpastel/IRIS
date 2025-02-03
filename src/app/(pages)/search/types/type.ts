
import { TCountry, TEntity } from "@/types/type";


export type TSearchMsgApiSerializerResponse = {
  id: string;
  // group_id: string;
  group_name: string;
  message_text: string;
  entity_name: string;
  type?: string

};

export type TSearchGroupApiSerializerResponse = {

  id: string;
  name: string;
  profile_photo_url: string;
  risk_score: string;
  member_count: string;
  type?: string;
  first_name?: string



}
export type TSearchEntityApiSerializerResponse = {
  id: string;
  profile_photo_url: string;
  phone: string;
  alpha2_code: string,
  alpha3_code: string,
  country: string,
  type?: string
  first_name: any
  last_name?: string

}
export type TSearchByKeyGroupApiSerializerResponse = {
  totalCount: string,
  count: string,
  result: TSearchGroupApiSerializerResponse[],


}


export type TSearchByKeyEntityApiSerializerResponse = {
  totalCount: string,
  count: string,
  result: TSearchEntityApiSerializerResponse[],


}
export type TSearchByKeyMsgApiSerializerResponse = {
  totalCount: string,
  count: string,
  result: TSearchMsgApiSerializerResponse[],


}


export type TSearchByKeyApiResponse = {
  groups: TSearchByKeyGroupApiSerializerResponse,
  entities: TSearchByKeyEntityApiSerializerResponse,
  messages: TSearchByKeyMsgApiSerializerResponse
}


export type DropdownState = {
  type: string;
  classification: string;
  risk_score: string;
  country_id: string;
  member_count: string;
  date_range: any;
  search: any;
};

export type translateData = {
  messageId?: string;
  message?: string;
  status?: boolean;
  loadingstatus?: boolean;
}

export type sortingData = {
  orderby_field: string;
  orderby_type: string;
  orderVal: string;
}









