import { DeleteOutlined, EditOutlined, EyeOutlined } from "@ant-design/icons";
import { Popconfirm, Tooltip } from "antd";
import { ColumnsType, Key, TableRowSelection } from "antd/es/table/interface";
import React from "react";
import { useNavigate } from "react-router-dom";
import { IFormColumnsProduct } from "../../model/Product.model";
import { changeAction, deleteProduct, getAllProduct } from "../../pages/Product/product.reducer";
import { path } from "../../router/path";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import CommonTable from "../../utils/CommonTable";
import { CONVERT_MONEY } from "../../utils/contants";

interface IFormProps {
  page: number;
  size: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  selectedRowKeys: Key[];
  setSelectedRowKeys: React.Dispatch<React.SetStateAction<Key[]>>;
  valueSearch: any;
}

const TableProduct = ({
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
  const { dataProduct, totalElements } = useAppSelector(
    (state) => state.productReducer
  );
  const columns: ColumnsType<IFormColumnsProduct> = [
    {
      title: "Tên sản phẩm",
      dataIndex: "name",
    },
    {
      title: "Mã sản phẩm",
      dataIndex: "code",
    },
    {
      title: "Giá",
      dataIndex: "price",
      render(value) {
        return <span>{CONVERT_MONEY(value) ? `$${CONVERT_MONEY(value)}` : ''}</span>
      }
    },
    {
      title: "Số lượng tồn kho",
      dataIndex: "stockQty",
    },
    {
      title: "Nhãn hàng",
      dataIndex: "makeName",
    },
    {
      title: "Danh mục",
      dataIndex: "productType",
    },

    {
      title: "Người tạo",
      dataIndex: "createdBy",
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
              onConfirm={() => handleDelete(record.productId)}
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
                onClick={() => setSelectedRowKeys([record.productId])}
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
  const handleOpenView = (record: IFormColumnsProduct) => {
    navigate(path.product + `/detail/${record.productId}`);
    dispatch(changeAction("view"));
  };
  const handleOpenUpdate = (record: IFormColumnsProduct) => {
    navigate(path.product + `/update/${record.productId}`);
    dispatch(changeAction("update"));
  };
  const handleDelete = (id: number) => {
    console.log("id", id);
    dispatch(deleteProduct(selectedRowKeys)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        dispatch(getAllProduct(valueSearch));
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
        dataSource={dataProduct}
        page={page}
        pageSize={size}
        rowSelection={rowSelection}
        total={totalElements}
        setPage={setPage}
        setSize={setSize}
        rowKey="productId"
      />
    </div>
  );
};

export default TableProduct;
