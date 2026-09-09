export interface ProvincesModel {}




export interface Province {
  provinceId: number;
  provinceName: string;
  countryId: number;
  countryName: string;
  countryCode: string;
  isActive: boolean;
  createdById: number;
  userName: string;
  createdOn: string;
}

export interface ProvinceResponse {
  success: boolean;
  statusCode: number;
  message: string;
  data: Province[];
  totalCount: number;
}








export interface AddProvinceRequest {
  provinceName: string;
  countryId: number;
  isActive: boolean;
}

export interface AddProvinceResponse {
  success:boolean,
  statusCode: number;
  message: string;
  data?: any;
}
