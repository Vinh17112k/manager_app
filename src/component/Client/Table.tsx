import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Popconfirm, Tooltip } from "antd";
import { ColumnsType } from "antd/lib/table";
import { Key, TableRowSelection } from "antd/lib/table/interface";
import React, { useState } from "react";
import { IFormColumns, IFormSearchClient } from "../../model/Client.model";
import {
  changeAction,
  deleteClient,
  getClient,
} from "../../pages/Client/client.reducer";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import CommonTable from "../../utils/CommonTable";
import ModalClient from "./ModalClient";

interface IFormProps {
  page: number;
  size: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  selectedRowKeys: Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<Key[]>>;
  valueSearch: IFormSearchClient;
}
const TableClient = ({
  page,
  size,
  setPage,
  setSize,
  selectedRowKeys,
  setSelectedRowKeys,
  valueSearch,
}: IFormProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [valueDetail, setValueDetail] = useState<IFormColumns>();
  const { dataClient, totalElements } = useAppSelector(
    (state) => state.clientReducer
  );
  const dispatch = useAppDispatch();
  const columns: ColumnsType<IFormColumns> = [
    {
      title: "Username",
      dataIndex: "username",
    },
    {
      title: "FullName",
      dataIndex: "fullName",
    },
    {
      title: "Email",
      dataIndex: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
    },
    {
      title: "Sinh nhật",
      dataIndex: "birthday",
    },
    {
      title: "Status",
      dataIndex: "status",
    },
    {
      title: "Hành động",
      dataIndex: "action",
      align: "center",
      render: (value, record) => (
        <>
          <Tooltip title="Xóa">
            <Popconfirm
              title="Bạn có chắc muốn xóa người dùng này không?"
              onConfirm={() => handleDelete(record.userId)}
              onCancel={() => setSelectedRowKeys([])}
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
              <DeleteOutlined
                onClick={() => setSelectedRowKeys([record.userId])}
              />
            </Popconfirm>
          </Tooltip>
          <Tooltip title="Xem chi tiết">
            <EyeOutlined
              style={{ margin: "0 8px" }}
              onClick={() => handleOpenView(record)}
            />
          </Tooltip>
          <Tooltip title="Chỉnh sửa">
            <EditOutlined onClick={() => handleOpenUpdate(record)} />
          </Tooltip>
        </>
      ),
    },
  ];
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange(selectedRowKeys) {
      setSelectedRowKeys(selectedRowKeys);
    },
  };
  const handleDelete = (id: number) => {
    dispatch(deleteClient([id])).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(getClient(valueSearch));
      }
    });
  };
  const handleOpenView = (record: any) => {
    setValueDetail(record);
    setIsOpen(true);
    dispatch(changeAction("view"));
  };
  const handleOpenUpdate = (record: any) => {
    setValueDetail(record);
    setIsOpen(true);
    dispatch(changeAction("update"));
  };
  return (
    <>
      <CommonTable
        rowSelection={rowSelection}
        page={page}
        dataSource={dataClient}
        columns={columns}
        pageSize={size}
        setPage={setPage}
        setSize={setSize}
        total={totalElements}
        rowKey="userId"
      />
      <ModalClient
        isOpen={isOpen}
        setIsOpen={setIsOpen}
        valueDetail={valueDetail}
        valueSearch={valueSearch}
      />
    </>
  );
};

export default TableClient;
