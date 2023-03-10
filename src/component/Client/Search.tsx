import { Button, Col, Form, Popconfirm, Row } from "antd";
import { Key } from "antd/es/table/interface";
import React from "react";
import { toast } from "react-toastify";
import { IFormSearchClient } from "../../model/Client.model";
import { deleteClient, getClient } from "../../pages/Client/client.reducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import CommonFormItem from "../../utils/CommonFormItem";
import { filterSelectOption, STATUS } from "../../utils/filterOptions";
import SelectCommon from "../../utils/SelectCommon";

interface IFormProps {
  setValueSearch: React.Dispatch<React.SetStateAction<any>>;
  selectedRowKeys: Key[];
  valueSearch: IFormSearchClient;
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<Key[]>>;
}
const SearchClient = ({
  setValueSearch,
  selectedRowKeys,
  valueSearch,
  setSelectedRowKeys,
}: IFormProps) => {
  const [form] = Form.useForm();
  const dispatch = useAppDispatch();
  const { dataUsername, dataEmail, dataPhone, dataFullName } = useAppSelector(
    (state) => state.clientReducer
  );
  const handleSearch = (data: any) => {
    setValueSearch(data);
  };
  const handleDelete = () => {
    if (selectedRowKeys.length) {
      dispatch(deleteClient(selectedRowKeys)).then((res) => {
        if (res.meta.requestStatus) {
          toast.success("Xóa thành công");
          setSelectedRowKeys([]);
          dispatch(getClient(valueSearch));
        }
      });
    }
  };
  return (
    <Form form={form} layout="vertical" onFinish={handleSearch}>
      <Row gutter={10}>
        <Col span={8}>
          <CommonFormItem name="username" label="Tên đăng nhập" isRequired={false}>
            <SelectCommon
              options={dataUsername}
              filterOption={filterSelectOption}
              placeholder="Tên đăng nhập"
            />
          </CommonFormItem>
        </Col>
        <Col span={8}>
          <CommonFormItem name="fullName" label="Họ Tên" isRequired={false}>
            <SelectCommon
              options={dataFullName}
              filterOption={filterSelectOption}
              placeholder="Họ tên"
            />
          </CommonFormItem>
        </Col>
        <Col span={8}>
          <CommonFormItem name="email" label="Email" isRequired={false}>
            <SelectCommon
              options={dataEmail}
              filterOption={filterSelectOption}
              placeholder="Email"
            />
          </CommonFormItem>
        </Col>
        <Col span={8}>
          <CommonFormItem name="phone" label="Số điện thoại" isRequired={false}>
            <SelectCommon
              options={dataPhone}
              filterOption={filterSelectOption}
              placeholder="Số điện thoại"
            />
          </CommonFormItem>
        </Col>
        <Col span={8}>
          <Form.Item name="status" label="Trạng thái">
            <SelectCommon
              options={STATUS}
              filterOption={filterSelectOption}
              placeholder="Trạng thái"
            />
          </Form.Item>
        </Col>
        <Col
          span={24}
          style={{
            display: "flex",
            justifyContent: "flex-end",
            alignItems: "flex-end",
          }}
        >
          <CommonFormItem isRequired={false}>
            <div>
              <Button htmlType="submit" className="search">
                Tìm kiếm
              </Button>
              <Popconfirm
                placement="topRight"
                title={
                  selectedRowKeys.length
                    ? "Bạn có chắc muốn xóa những người dùng này không?"
                    : "Vui lòng chọn người dùng"
                }
                onConfirm={handleDelete}
                cancelText="Hủy"
                okText="Đồng ý"
                okButtonProps={{
                  className: "search",
                  style: {
                    height: "28px",
                    fontSize: "14px",
                    borderRadius: 0,
                  },
                }}
                cancelButtonProps={{
                  className: "delete",
                  style: {
                    height: "28px",
                    fontSize: "14px",
                    borderRadius: 0,
                  },
                }}
              >
                <Button className="delete">Xóa</Button>
              </Popconfirm>
            </div>
          </CommonFormItem>
        </Col>
      </Row>
    </Form>
  );
};

export default SearchClient;
