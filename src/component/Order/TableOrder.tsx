import { Popconfirm, Tag, Tooltip } from "antd";
import { ColumnsType } from "antd/es/table";
import React, { useState } from "react";
import { IFormColumnsOrder, IFormSearchOrder } from "../../model/Order.model";
import { IFormProps } from "../../model/utils";
import moment from 'moment'
import { CONVERT_MONEY, DATE_FORMAT_TYPE_DDMMYYYY } from "../../utils/contants";
import { CheckCircleOutlined, CheckOutlined, CloseCircleOutlined, EyeOutlined } from "@ant-design/icons";
import CommonTable from "../../utils/CommonTable";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { acceptOrder, getDataSearch } from "../../pages/Order/order.reducer";
import ModalReason from "./ModalReason";
import { useNavigate } from "react-router-dom";



const TableOrder = ({ valueSearch, setPage, setSize, page, size }: Omit<IFormProps<IFormSearchOrder>, "setValueSearch" | "setSelectedRowKeys" | "selectedRowKeys">) => {
  const [isOpen, setIsOpen] = useState(false)
  const [orderId, setOrderId] = useState<number | null>(null)
  const dispatch = useAppDispatch()
  const navigate = useNavigate()
  const { dataOrder, totalElements, isLoading } = useAppSelector(state => state.orderReducer)
  const columns: ColumnsType<IFormColumnsOrder> = [
    {
      title: "Khách hàng",
      dataIndex: "customerName",
    },
    {
      title: "Ngày đặt hàng",
      dataIndex: "orderDate",
      render(value) {
        return <span>{moment(value).format(DATE_FORMAT_TYPE_DDMMYYYY)}</span>
      },
    },
    {
      title: 'Trạng thái đơn hàng',
      dataIndex: 'status',
      render(value) {
        if (value === 0) {
          return <Tag color="orange">Đang chờ</Tag>
        }
        if (value === 1) {
          return <Tag color="success">Chấp nhận</Tag>
        }
        if (value === 3) {
          return <Tag color="red">Đã huỷ</Tag>
        }
      }
    },
    {
      title: 'Giá trị đơn hàng',
      dataIndex: 'price',
      render(value) {
        return <span>{CONVERT_MONEY(value)}</span>
      }
    },
    {
      title: "Ngày vận chuyển",
      dataIndex: 'deliveryDate',
      render(value) {
        return <span>{moment(value).format(DATE_FORMAT_TYPE_DDMMYYYY)}</span>
      },
    },
    {
      title: 'Phí vận chuyển',
      dataIndex: 'shippingTotal',
      render(value) {
        return <span>{CONVERT_MONEY(value) ? `${CONVERT_MONEY(value)}` : ''}</span>
      }
    },
    {
      title: 'Trạng thái thanh toán',
      dataIndex: 'isPayment',
      render(value) {
        if (value === false) {
          return <Tag color="red">Chưa thanh toán</Tag>
        }
        if (value === true) {
          return <Tag color="green">Đã thanh toán</Tag>
        }

      }
    },
    {
      title: 'Hành động',
      render: (value, record) => {
        let custom = null
        if (record.status === 0) {
          custom = <>
            <Tooltip title='Duyệt đơn hàng'>
              <CheckCircleOutlined style={{ color: 'green', margin: '0 8px' }} onClick={() => handleAcceptOrder(record.oderId)} />
            </Tooltip>

            <Popconfirm title='Bạn có chắc muốn huỷ đơn hàng?' onConfirm={() => {
              setOrderId(record.oderId)
              setIsOpen(true)
            }}>
              <Tooltip title='Huỷ'>
                <CloseCircleOutlined style={{ color: '#f50', cursor: 'pointer' }} />
              </Tooltip>
            </Popconfirm>
          </>
        }
        if (record.status === 1) {
          custom = (
            <>

              <Popconfirm title='Bạn có chắc muốn huỷ đơn hàng?' onConfirm={() => {
                setOrderId(record.oderId)
                setIsOpen(true)
              }}>
                <Tooltip title='Huỷ'>
                  <CloseCircleOutlined style={{ color: '#f50', cursor: 'pointer', marginLeft: '8px' }} />
                </Tooltip>
              </Popconfirm>
            </>
          )
        }
        return <div>
          <div>
            <Tooltip title='Xem chi tiết'>
              <EyeOutlined style={{ cursor: 'pointer' }} onClick={() => navigate(`/order/detail/${record.oderId}`)} />
            </Tooltip>
            {custom}
          </div>
        </div>
        // return <div>
        //   <Tooltip title='Duyệt đơn hàng'>
        //     <CheckCircleOutlined style={{ color: 'green', margin: '0 8px' }} onClick={() => handleAcceptOrder(record.oderId)} />
        //   </Tooltip>

        // </div>
      }
    }
  ];
  const handleAcceptOrder = (orderId: number) => {
    dispatch(acceptOrder(orderId)).then(res => {
      if (res.meta.requestStatus === 'fulfilled') {
        dispatch(getDataSearch({ ...valueSearch, page, size }))
      }
    })
  }
  return <div>
    <CommonTable columns={columns} dataSource={dataOrder} total={totalElements} loading={isLoading} pageSize={size} page={page} setPage={setPage} setSize={setSize} />
    <ModalReason valueSearch={valueSearch} page={page} size={size} orderId={orderId} isOpen={isOpen} setIsOpen={setIsOpen} />
  </div>;
};

export default TableOrder;
