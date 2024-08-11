import React, { useEffect } from "react";
import { Form, Input } from "antd";

type CategoryFormProps = {
  initialValues: { id?: number; name: string };
  onValuesChange: (changedValues: any, allValues: any) => void;
  form: any;
  value?: string;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
};

const CategoryForm: React.FC<CategoryFormProps> = ({
  initialValues,
  onValuesChange,
  form,
  value,
  onChange,
}) => {
  useEffect(() => {
    form.setFieldsValue(initialValues);
  }, [form, initialValues]);

  return (
    <Form form={form} onValuesChange={onValuesChange}>
      <Form.Item
        name="name"
        label="ชื่อหมวดหมู่ค่ายเพลง"
        rules={[{ required: true, message: "กรุณากรอกชื่อหมวดหมู่ค่ายเพลง" }]}
      >
        <Input
          placeholder="ชื่อหมวดหมู่ค่ายเพลง"
          value={value}
          onChange={onChange}
        />
      </Form.Item>
    </Form>
  );
};

export default CategoryForm;