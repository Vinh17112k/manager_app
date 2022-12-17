export const filterSelectOption = (input: any, option: any) => {
  return (
    option.label?.toLowerCase().includes(input) || option.label?.includes(input)
  );
};

export const STATUS = [
  {
    value: 1,
    label: "Hoạt động",
  },
  {
    value: 0,
    label: "Không hoạt động",
  },
];
export const TYPEDISCOUNT = [
  {
    value: 1,
    label: "Theo phần trăm",
  },
  {
    value: 0,
    label: "Theo giá tiền",
  },
];
export const TYPEVOCHER = [
  {
    value: 1,
    label: "Khuyến mãi giảm giá sản phẩm",
  },
  {
    value: 0,
    label: "Miễn phí vận chuyển, ...",
  },
];
