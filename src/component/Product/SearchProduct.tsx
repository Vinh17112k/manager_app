import {
  Button,
  Col,
  DatePicker,
  Form,
  Input,
  Popconfirm,
  Row,
  Select,
} from "antd";
import { Key } from "antd/es/table/interface";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { IFormSearchProduct } from "../../model/Product.model";
import { path } from "../../router/path";
import { useAppSelector } from "../../store/hooks";
import CommonFormItem from "../../utils/CommonFormItem";
import { DATE_FORMAT_TYPE_DDMMYYYY } from "../../utils/contants";
import { filterSelectOption, STATUS } from "../../utils/filterOptions";
import SelectCommon from "../../utils/SelectCommon";
import dayjs from "dayjs";

interface IFormProps {
  setValueSearch: React.Dispatch<React.SetStateAction<IFormSearchProduct>>;
  page: number;
  size: number;
  selectedRowKeys: Key[];
}
const SearchProduct = ({ setValueSearch }: IFormProps) => {
  const [form] = Form.useForm();
  const navigate = useNavigate();
  const { dataMake, dataProductType, dataCode, dataName, dataCreated, dataProductMake } =
    useAppSelector((state) => state.productReducer);
  const handleSubmit = (data: any) => {
    setValueSearch({...data,
      fromDate: data.fromDate ? dayjs(data.fromDate).format("DD/MM/YYYY") : "",
      toDate: data.toDate ? dayjs(data.toDate).format("DD/MM/YYYY") : "",
    });
  };
  const handleAddNew = () => {
    navigate(path.addnewProduct);
  };
  return (
    <div>
      <Form form={form} onFinish={handleSubmit} layout="vertical">
        <Row gutter={10}>
          <Col span={6}>
            <CommonFormItem name="name" label="Tên sản phẩm" isRequired={false}>
              <SelectCommon
                options={dataName}
                filterOption={filterSelectOption}
                placeholder="Tên sản phẩm"
              />
            </CommonFormItem>
          </Col>
          <Col span={6}>
            <CommonFormItem name="code" label="Mã sản phẩm" isRequired={false}>
              <SelectCommon
                className="custom-selected"
                options={dataCode}
                filterOption={filterSelectOption}
                allowClear
                showSearch
                placeholder="Mã sản phẩm"
              />
            </CommonFormItem>
          </Col>
          <Col span={6}>
            <CommonFormItem
              name="fromPrice"
              label="Giá từ"
              isRequired={false}
            >
              <Input className="custom-input" placeholder="Giá từ" />
            </CommonFormItem>
          </Col>
          <Col span={6}>
            <CommonFormItem name="toPrice" label="Giá đến" isRequired={false}>
              <Input className="custom-input" placeholder="Giá đến" />
            </CommonFormItem>
          </Col>
          <Col span={6}>
            <CommonFormItem
              name="fromStockQty"
              label="Số lượng từ"
              isRequired={false}
            >
              <Input className="custom-input" placeholder="Số lượng từ" />
            </CommonFormItem>
          </Col>
          <Col span={6}>
            <CommonFormItem
              name="toStockQty"
              label="Số lượng đến"
              isRequired={false}
            >
              <Input className="custom-input" placeholder="Số lượng đến" />
            </CommonFormItem>
          </Col>
          <Col span={6}>
            <Form.Item name="makeId" label="Nhãn hàng">
              <SelectCommon
                options={dataProductMake}
                className="custom-selected"
                filterOption={filterSelectOption}
                allowClear
                showSearch
                placeholder="Nhãn hàng"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="productTypeId"
              label="Danh mục"
            >
              <SelectCommon
                options={dataProductType}
                className="custom-selected"
                filterOption={filterSelectOption}
                allowClear
                showSearch
                placeholder="Danh mục"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <CommonFormItem
              name="created"
              label="Người tạo"
              isRequired={false}
            >
              <SelectCommon
                className="custom-selected"
                options={dataCreated}
                filterOption={filterSelectOption}
                allowClear
                showSearch
                placeholder="Người tạo"
              />
            </CommonFormItem>
          </Col>
          {/* <Col span={6}>
            <Form.Item name="expiredDate" label="">
              <DatePicker
                format={DATE_FORMAT_TYPE_DDMMYYYY}
                allowClear
                className="date-picker"
              />
            </Form.Item>
          </Col> */}
          <Col span={6}>
            <Form.Item name="fromDate" label="Ngày nhập từ">
              <DatePicker
                placeholder="Chọn ngày"
                format={DATE_FORMAT_TYPE_DDMMYYYY}
                allowClear
                className="date-picker"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item name="toDate" label="Ngày nhập đến">
              <DatePicker
                placeholder="Chọn ngày"
                format={DATE_FORMAT_TYPE_DDMMYYYY}
                allowClear
                className="date-picker"
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <CommonFormItem
              name="status"
              label="Trạng thái"
              isRequired={false}
            >
              <SelectCommon
                className="custom-selected"
                options={STATUS}
                filterOption={filterSelectOption}
                allowClear
                showSearch
                placeholder="Trạng thái"
              />
            </CommonFormItem>
          </Col>
          <Col
            span={24}
          >
            <CommonFormItem isRequired={false}>
              <div style={{
              display: "flex",
              justifyContent: "space-between",
            }}>
                <Button htmlType="submit" className="search">
                  Tìm kiếm
                </Button>
                <Button className="search" onClick={handleAddNew}>
                  Thêm mới
                </Button>
              </div>
            </CommonFormItem>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default SearchProduct;
