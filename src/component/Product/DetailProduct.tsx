import { CloseCircleFilled, UploadOutlined } from "@ant-design/icons";
import { Button, Col, Form, Input, Row, Upload, UploadProps } from "antd";
import TextArea from "antd/es/input/TextArea";
import { RcFile, UploadChangeParam, UploadFile } from "antd/es/upload";
import moment from "moment";
import { useEffect, useState } from "react";
import {
  Navigate,
  useLocation,
  useNavigate,
  useParams,
} from "react-router-dom";
import { toast } from "react-toastify";
import {
  addNewProduct,
  changeAction,
  getDetail,
  getListMake,
  getListProductMake,
  getListProductType,
  updateProduct,
} from "../../pages/Product/product.reducer";
import { path } from "../../router/path";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { DATE_FORMAT_TYPE_YYYYMMDD } from "../../utils/contants";
import { STATUS } from "../../utils/filterOptions";
import SelectCommon from "../../utils/SelectCommon";

const DetailProduct = () => {
  const [imageUrl, setImageUrl] = useState<string[]>([]);
  const [fileList, setFileList] = useState<any[]>([]);
  const [form] = Form.useForm();
  const { id } = useParams();
  const { pathname } = useLocation();
  const dispatch = useAppDispatch();
  const navigate = useNavigate();
  const { action, dataDetail, dataProductType, dataProductMake, dataMake } =
    useAppSelector((state) => state.productReducer);
  useEffect(() => {
    Promise.all([
      dispatch(getListProductType()),
      dispatch(getListMake()),
    ]);
  }, [dispatch]);
  const getBase64 = (img: RcFile, callback: (url: string) => void) => {
    const reader = new FileReader();
    reader.addEventListener("load", () => callback(reader.result as string));
    reader.readAsDataURL(img);
  };
  const beforeUpload = (file: RcFile) => {
    const isJpgOrPng = file.type === "image/jpeg" || file.type === "image/png";
    if (!isJpgOrPng) {
      return false;
    }
    return true;
  };
  const handleChangeImage: UploadProps["onChange"] = (
    info: UploadChangeParam<UploadFile>
  ) => {
    if (info.file.status === "uploading") {
      return;
    }
    setFileList((oldFile) => [...oldFile, info.file.originFileObj]);
    getBase64(info.file.originFileObj as RcFile, (url) => {
      setImageUrl((oldState) => [...oldState, url]);
    });
  };
  useEffect(() => {
    if (pathname.includes("detail")) {
      dispatch(changeAction("view"));
    }
    if (pathname.includes("update")) {
      dispatch(changeAction("update"));
    }
    if (pathname.includes("addnew")) {
      dispatch(changeAction("addnew"));
    }
  }, [pathname, dispatch]);
  useEffect(() => {
    if (!id) return;
    dispatch(getDetail(id)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        const resPayload: any = res.payload;
        // const arrImg = resPayload.data.data.path.map(
        //   (item: any, index: any) => {
        //     return {item};
        //   }
        // );
        setImageUrl(resPayload.data.data.path);
        form.setFieldsValue({
          ...resPayload.data.data,
          makeId: resPayload.data.data.make.id,
          productTypeId: resPayload.data.data.productType.id,
        });
      }
    });
  }, [id, dispatch, form]);
  const handleSubmit = (data: any) => {
    // if (!fileList.length) {
    //   return toast.error("Vui l??ng t???i ???nh l??n");
    // }
    const formData = new FormData();
    Object.keys(data).forEach((item) => {
      formData.append(item, data[item]);
    });
    fileList.forEach((item) => {
      formData.append("path", item);
    });
    if (action === 'update') {
      formData.append("id", id as string)
      dispatch(updateProduct(formData)).then(res => {
        if (res.meta.requestStatus === 'fulfilled') {
          toast.success("S???a s???n ph???m th??nh c??ng");
          navigate(path.product);
        }
      })
      return
    }
    dispatch(addNewProduct(formData)).then((res) => {
      if (res.meta.requestStatus === "fulfilled") {
        toast.success("Th??m s???n ph???m th??nh c??ng");
        navigate(path.product);
      }
    });
  };


  const handleRemoveImage = (index: number) => {
    setImageUrl(imageUrl.filter((item, position) => position !== index));
    setFileList(fileList.filter((item, position) => position !== index));
  };
  const handleCancel=()=>{
    return navigate(path.product)
  }
  return (
    <div>
      <Form
        form={form}
        layout="vertical"
        onFinish={handleSubmit}
        requiredMark={false}
      >
        <Row gutter={10}>
          <Col span={8}>
            <Form.Item
              label="T??n s???n ph???m"
              name="name"
              rules={[
                {
                  required: action === "update" || action === "addnew",
                  message: "T??n s???n ph???m kh??ng ???????c ????? tr???ng",
                },
              ]}
            >
              <Input
                placeholder="T??n s???n ph???m"
                onBlur={(e) =>
                  form.setFieldValue("name", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              label="M?? s???n ph???m"
              name="code"
            >
              <Input
                placeholder="M?? s???n ph???m"
                onBlur={(e) =>
                  form.setFieldValue("code", e.target.value.trim())
                }
                disabled={action === "view"||action === "addnew"||action === "update"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="productTypeId"
              label="Danh m???c"
              rules={[
                {
                  required: action === "update" || action === "addnew",
                  message: "Danh m???c kh??ng ???????c ????? tr???ng",
                },
              ]}
            >
              <SelectCommon
                placeholder="Danh m???c"
                options={dataProductType}
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="year" label="N??m s???n xu???t">
              <Input
                placeholder="N??m s???n xu???t"
                onBlur={(e) =>
                  form.setFieldValue("year", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="makeId"
              label="Nh??n h??ng"
              rules={[
                {
                  required: action === "update" || action === "addnew",
                  message: "Nh?? s???n xu???t kh??ng ???????c ????? tr???ng",
                },
              ]}
            >
              <SelectCommon
                placeholder="Nh?? s???n xu???t"
                options={dataMake}
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="weight"
              label="Kh???i l?????ng"
              rules={[
                {
                  required: action === "update" || action === "addnew",
                  message: "Kh???i l?????ng s???n ph???m kh??ng ???????c ????? tr???ng",
                },
              ]}
            >
              <Input
                placeholder="Kh???i l?????ng"
                onBlur={(e) =>
                  form.setFieldValue("weight", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="operationSystem" label="H??? ??i???u h??nh">
              <Input
                placeholder="H??? ??i???u h??nh"
                onBlur={(e) =>
                  form.setFieldValue("operationSystem", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="price"
              label="Gi?? s???n ph???m"

              rules={[
                {
                  required: action === "update" || action === "addnew",
                  message: "Gi?? s???n ph???m kh??ng ???????c ????? tr???ng",
                },
              ]}
            >
              <Input
                placeholder="Gi??"
                onBlur={(e) =>
                  form.setFieldValue("price", e.target.value.trim())
                }
                disabled={action === "view"}
                type="number"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item
              name="stockQty"
              label="S??? l?????ng nh???p"
              rules={[
                {
                  required: action === "update" || action === "addnew",
                  message: "S??? l?????ng s???n ph???m kh??ng ???????c ????? tr???ng",
                },
              ]}
            >
              <Input
                placeholder="S??? l?????ng c?? s???n"
                onBlur={(e) =>
                  form.setFieldValue("stockQty", e.target.value.trim())
                }
                disabled={action === "view"}
                type="number"
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="processSpeed" label="T???c ????? x??? l??">
              <Input
                placeholder="T???c ????? vi x??? l??"
                onBlur={(e) =>
                  form.setFieldValue("processSpeed", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="originalCountry" label="Xu???t s???">
              <Input
                placeholder="Xu???t s???"
                onBlur={(e) =>
                  form.setFieldValue("originalCountry", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="coreQuantity" label="Vi x??? l??">
              <Input
                placeholder="Vi x??? l??"
                onBlur={(e) =>
                  form.setFieldValue("coreQuantity", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="ram" label="Ram">
              <Input
                placeholder="Ram"
                onBlur={(e) => form.setFieldValue("ram", e.target.value.trim())}
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="card" label="Card h??nh">
              <Input
                placeholder="Card h??nh"
                onBlur={(e) =>
                  form.setFieldValue("card", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="screenSize" label="K??ch th?????c m??n h??nh">
              <Input
                placeholder="K??ch th?????c m??n h??nh"
                onBlur={(e) =>
                  form.setFieldValue("screenSize", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="screenHd" label="????? ph??n gi???i m??n h??nh">
              <Input
                placeholder="????? ph??n gi???i"
                onBlur={(e) =>
                  form.setFieldValue("screenHd", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="hardDisk" label="??? c???ng">
              <Input
                placeholder="??? c???ng"
                onBlur={(e) =>
                  form.setFieldValue("hardDisk", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={8}>
            <Form.Item name="pin" label="Pin">
              <Input
                placeholder="Pin"
                onBlur={(e) => form.setFieldValue("pin", e.target.value.trim())}
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={18}>
            <Form.Item name="description" label="M?? t??? s???n ph???m">
              <TextArea
                rows={4}
                maxLength={250}
                placeholder="M?? t???"
                onBlur={(e: any) =>
                  form.setFieldValue("description", e.target.value.trim())
                }
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col span={6}>
            <Form.Item
              name="status"
              label="Tr???ng th??i"
              rules={[
                {
                  required: action === "update" || action === "addnew",
                  message: "Tr???ng th??i kh??ng ???????c ????? tr???ng",
                },
              ]}
            >
              <SelectCommon
                placeholder="Tr???ng th??i"
                options={STATUS}
                disabled={action === "view"}
              />
            </Form.Item>
          </Col>
          <Col
              span={6}
              style={{
                display: "flex",
                justifyContent: "flex-start",
                alignItems: "flex-start",
              }}
            >
              <Form.Item>
                <Button className="delete" onClick={handleCancel}>
                  H???y
                </Button>
              </Form.Item>
            </Col>
          {action === "addnew" ? (
            <Col
              span={18}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Form.Item>
                <Button className="search" htmlType="submit">
                  L??u
                </Button>
              </Form.Item>
            </Col>
          ) : null}
          {action === 'update' ?
            <Col
              span={18}
              style={{
                display: "flex",
                justifyContent: "flex-end",
                alignItems: "flex-end",
              }}
            >
              <Form.Item>
                <Button className="search" htmlType="submit">
                  S???a
                </Button>
              </Form.Item>
            </Col>
            : null}
          <Col span={24} className="image-upload">
            {imageUrl.map((item: string, index: number) => (
              <div
                style={{
                  width: "219px",
                  height: "129px",
                  position: "relative",
                }}
              >
                <img
                  src={item}
                  style={{ width: "100%", height: "100%", marginRight: "4px" }}
                  alt="anh dep"
                />
                <CloseCircleFilled
                  style={{
                    position: "absolute",
                    right: 0,
                    top: 0,
                    cursor: "pointer",
                    color: "rgb(3, 201, 215)",
                    borderRadius:"5px",
                    display: action === "view" ? "none" : "block",
                  }}
                  onClick={() => handleRemoveImage(index)}
                />
              </div>
            ))}
          </Col>
          {action === "update" || action === "addnew" ? (
            <Col span={24} style={{ textAlign: "center", marginTop: "12px" }}>
              <Upload
                showUploadList={false}
                action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
                beforeUpload={beforeUpload}
                onChange={handleChangeImage}
                accept="image/png, image/gif, image/jpeg"
                headers={{ authorization: "authorization-text" }}
              >
                <div className="upload-image ant-menu-item-selected">
                  <UploadOutlined />
                  <span>T???i ???nh l??n</span>
                </div>
              </Upload>
            </Col>
          ) : null}
        </Row>
      </Form>
    </div>
  );
};

export default DetailProduct;
