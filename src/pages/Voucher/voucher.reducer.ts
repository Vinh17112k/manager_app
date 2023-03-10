import { toast } from "react-toastify";
import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";
import instance from "../../contants/axios.config";
import { IFormDataVoucher, IFormSearch } from "../../model/Voucher.model";
import { Key } from "antd/es/table/interface";
const initState = {
  dataVoucher: [] as IFormDataVoucher[],
  dataDetail: {},
  dataProduct:[],
  action: "",
  totalElements: 0,
};

export const getAllVoucher = createAsyncThunk(
  "voucher/searchVoucher",
  async (data: IFormSearch) => {
    const result = await instance.post("/api/v1/voucher/search", data);
    return result;
  }
);

export const getDetail = createAsyncThunk(
  "Voucher/getDetail",
  async (id: string) => {
    const result = await instance.get(`/api/v1/voucher/detail/${id}`);
    return result;
  }
);

export const updateVoucher = createAsyncThunk(
  "Voucher/updateVoucher",
  async (data:Partial<IFormDataVoucher>) => {
    const result = await instance.post("/api/v1/voucher/update", data);
    return result;
  }
);
export const deleteVoucher = createAsyncThunk(
  "Voucher/deleteVoucher",
  async (id: Key[]) => {
    const result = await instance.post("/api/v1/voucher/delete", id);
    toast.success("Xóa thành công");
    return result;
  }
);
export const createVoucher = createAsyncThunk(
  "Voucher/createVoucher",
  async (data:any) => {
    const result = await instance.post("/api/v1/voucher/create", data);
    toast.success("Thêm khuyến mãi thành công");
    return result;
  }
);
export const getProduct = createAsyncThunk(
  "Voucher/getProduct",
  async () => {
    const result = await instance.get("/api/v1/voucher/product");
    const newResult = result.data.data.map((item: any) => {
      return {
        value: item.id,
        label: item.name,
      };
    });
    return newResult;
  }
);
const voucherSlice = createSlice({
  name: "voucher",
  initialState: initState,
  reducers: {
    changeAction: (state, action) => {
      state.action = action.payload;
    },
  },
  extraReducers(builder) {
    builder
      .addCase(getAllVoucher.fulfilled, (state, action) => {
        state.dataVoucher = action.payload.data.data.content;
        state.totalElements = action.payload.data.data.totalElements;
      })
      .addCase(getDetail.fulfilled, (state, action) => {
        state.dataDetail = action.payload.data.data;
      })
      .addCase(getProduct.fulfilled, (state, action) => {
        state.dataProduct = action.payload;
      });
  },
});

const voucherReducer = voucherSlice.reducer;
export const { changeAction } = voucherSlice.actions;
export default voucherReducer;
