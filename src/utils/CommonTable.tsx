import { Empty, Table, TableProps, Tag } from "antd";
import { ColumnsType } from "antd/es/table";
import React from "react";
import CommonTooltip from "./CommonTooltip";

interface IFormProps extends TableProps<any> {
  total: number;
  page: number;
  pageSize: number;
  setPage: React.Dispatch<React.SetStateAction<number>>;
  setSize: React.Dispatch<React.SetStateAction<number>>;
  columns1?: ColumnsType<any> | undefined;
} // Định nghĩa các props sẽ truyền vào
const CommonTable = ({
  total,
  page,
  pageSize,
  setPage,
  setSize,
  columns,
  columns1 = undefined,
  ...rest
}: // đây là những props
  IFormProps) => {
  // const newColumns: ColumnsType<any> | undefined = columns?.map((item) => {
  //   if (item.title === "Status" || item.title === "Trạng thái") {
  //     return {
  //       ...item,
  //       align: "center",
  //       ellipsis: {
  //         showTitle: false,
  //       },
  //       render(value: any) {
  //         if (value === 1) {
  //           return <Tag color="success">Hoạt động</Tag>;
  //         }
  //         if (value === 0) {
  //           return <Tag color="warning">Không hoạt động</Tag>;
  //         }
  //       },
  //     };
  //   }
  //   if (
  //     item.title !== "STT" &&
  //     item.title !== "Hành động" &&
  //     item.title !== "Status"
  //   ) {
  //     return {
  //       ...item,
  //       align: "center",
  //       ellipsis: {
  //         showTitle: false,
  //       },
  //       render(value: any) {
  //         return <CommonTooltip value={value} />;
  //       },
  //     };
  //   }
  //   return item;
  // });
  columns?.unshift({
    title: "STT",
    dataIndex: "stt",
    width: 45,
    align: "center",
    ellipsis: {
      showTitle: false,
    },
    render(value: any, record: any, index: any) {
      return page === 1 ? index + 1 : (page - 1) * pageSize + index + 1;
    },
  });
  return (
    <Table
      {...rest}
      size="small"
      bordered
      columns={columns}
      // scroll={{ x: 1500 }}
      scroll={{ y: 450,x: 1500 }}
      pagination={{
        total,
        showTotal: (total, range) =>
          `Hiển thị ${range[0]} - ${range[1]} của ${total} bản ghi`,
        onChange: (page) => setPage(page),
        onShowSizeChange: (_, pageSize) => setSize(pageSize),
        showQuickJumper: true,
        showSizeChanger: true,
        pageSize,
        current: page,
        locale: {
          jump_to: "Đến trang",
          page: "",
          items_per_page: "/ Trang",
        },
      }}
      locale={{ emptyText: <Empty description="Không có dữ liệu" /> }}
    />
  );
};

export default CommonTable;
