import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Popconfirm, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import { Key, TableRowSelection } from "antd/es/table/interface";
import moment from "moment";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IFormColumnsVoucher } from "../../model/Voucher.model";
import { changeAction } from "../../pages/Product/product.reducer";
import {
  deleteVoucher,
  getAllVoucher,
} from "../../pages/Voucher/voucher.reducer";
import { path } from "../../router/path";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import CommonTable from "../../utils/CommonTable";
import { CONVERT_MONEY, DATE_FORMAT_TYPE_DDMMYYYY } from "../../utils/contants";

interface IFormProps {
  page: number;
  size: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  selectedRowKeys: Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<Key[]>>;
  valueSearch: any;
}

const TableVoucher = ({
  page,
  size,
  setPage,
  setSize,
  selectedRowKeys,
  setSelectedRowKeys,
  valueSearch,
}: IFormProps) => {
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { dataVoucher, totalElements } = useAppSelector(
    (state) => state.voucherReducer
  );
  const columns: ColumnsType<IFormColumnsVoucher> = [
    {
      title: "Mã khuyễn mãi",
      dataIndex: "code",
    },
    {
      title: "Ngày hiệu lực",
      dataIndex: "expiredDate",
      render: (value) => {
        return <span>{moment(value).format(DATE_FORMAT_TYPE_DDMMYYYY)}</span>
      }
    },
    {
      title: "Giá khuyến mãi",
      dataIndex: "discountPrice",
      render(value) {
        return <span>{CONVERT_MONEY(value) ? `$${CONVERT_MONEY(value)}` : ''}</span>
      }
    },
    {
      title: "Trạng thái",
      dataIndex: "status",
      render(value) {
        if (value === 0) {
          return <Tag color="orange">Không hoạt động</Tag>
        }
        if (value === 1) {
          return <Tag color="success">Hoạt động</Tag>
        }
      }
    },
    {
      title: "Sản phẩm áp dụng",
      dataIndex: "productApply",
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
              onConfirm={() => handleDelete(record.voucherId)}
              onCancel={() => {
                setSelectedRowKeys([]);
              }}
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
                onClick={() => setSelectedRowKeys([record.voucherId])}
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
  const handleOpenView = (record: IFormColumnsVoucher) => {
    navigate(path.voucher + `/detail/${record.voucherId}`);
    dispatch(changeAction("view"));
  };
  const handleOpenUpdate = (record: IFormColumnsVoucher) => {
    navigate(path.voucher + `/update/${record.voucherId}`);
    dispatch(changeAction("update"));
  };
  const handleDelete = (id: number) => {
    dispatch(deleteVoucher(selectedRowKeys)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(getAllVoucher(valueSearch));
      }
    });
  };
  const rowSelection: TableRowSelection<any> = {
    selectedRowKeys,
    preserveSelectedRowKeys: true,
    onChange(selectedRowKeys) {
      setSelectedRowKeys(selectedRowKeys);
    },
  };
  return (
    <div>
      <CommonTable
        columns={columns}
        dataSource={dataVoucher}
        page={page}
        pageSize={size}
        rowSelection={rowSelection}
        total={totalElements}
        setPage={setPage}
        setSize={setSize}
        rowKey="voucherId"
      />
    </div>
  );
};

export default TableVoucher;
