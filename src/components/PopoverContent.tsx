import { Typography } from "antd";

type PopoverContentProps = {
  title?: string;
  phone?: string;
  doctor?: string;
  status?: string;
  type?: string;
  comment?: string;
};

export const PopoverContent = (props: PopoverContentProps) => {
  const { title, phone, doctor, status, type, comment } = props;
  return (
    <div className="p-2 flex flex-col gap-2">
      <Typography.Text strong>{title}</Typography.Text>
      <Typography.Text>Телефон: {phone}</Typography.Text>
      <Typography.Text>Врач: {doctor}</Typography.Text>
      <Typography.Text>Статус: {status}</Typography.Text>
      <Typography.Text>Статус: {type}</Typography.Text>
      <Typography.Text>Статус: {comment}</Typography.Text>
    </div>
  );
};
