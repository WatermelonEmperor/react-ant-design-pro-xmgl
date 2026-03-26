import {
  ModalForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { TopicItem } from '../data.d';

export type TopicFormProps = {
  onCancel: () => void;
  onSubmit: (values: Partial<TopicItem>) => Promise<boolean>;
  open: boolean;
  values?: Partial<TopicItem>;
  title: string;
};

const TopicForm: React.FC<TopicFormProps> = (props) => {
  const { onCancel, onSubmit, open, values, title } = props;

  return (
    <ModalForm<Partial<TopicItem>>
      title={title}
      width={640}
      open={open}
      initialValues={values}
      modalProps={{
        destroyOnClose: true,
        onCancel: onCancel,
        styles: {
          body: {
            maxHeight: '60vh',
            overflowY: 'auto',
            paddingRight: 8,
          },
        },
      }}
      onFinish={async (formValues) => {
        const success = await onSubmit({ ...values, ...formValues });
        return success;
      }}
    >
      <ProFormText
        name="name"
        label="课题名称"
        placeholder="请输入课题名称"
        rules={[{ required: true, message: '请输入课题名称' }]}
      />
      <ProFormText
        name="code"
        label="课题编号"
        placeholder="请输入课题编号"
        rules={[{ required: true, message: '请输入课题编号' }]}
      />
      <ProFormSelect
        name="type"
        label="课题类型"
        placeholder="请选择课题类型"
        options={[
          { label: '纵向课题', value: '纵向课题' },
          { label: '横向课题', value: '横向课题' },
          { label: '校内课题', value: '校内课题' },
          { label: '自主研究', value: '自主研究' },
        ]}
        rules={[{ required: true, message: '请选择课题类型' }]}
      />
      <ProFormSelect
        name="source"
        label="课题来源"
        placeholder="请选择课题来源"
        options={[
          { label: '国家自然科学基金', value: '国家自然科学基金' },
          { label: '省科技厅', value: '省科技厅' },
          { label: '企业委托', value: '企业委托' },
          { label: '校内基金', value: '校内基金' },
          { label: '其他', value: '其他' },
        ]}
        rules={[{ required: true, message: '请选择课题来源' }]}
      />
      <ProFormSelect
        name="level"
        label="课题级别"
        placeholder="请选择课题级别"
        options={[
          { label: '国家级', value: '国家级' },
          { label: '省部级', value: '省部级' },
          { label: '市厅级', value: '市厅级' },
          { label: '校级', value: '校级' },
          { label: '其他', value: '其他' },
        ]}
        rules={[{ required: true, message: '请选择课题级别' }]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        placeholder="请选择状态"
        options={[
          { label: '待启动', value: 0 },
          { label: '进行中', value: 1 },
          { label: '已结题', value: 2 },
          { label: '已暂停', value: 3 },
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
      />
      <ProFormText
        name="leader"
        label="负责人"
        placeholder="请输入负责人姓名"
        rules={[{ required: true, message: '请输入负责人' }]}
      />
      <ProFormDigit
        name="budget"
        label="课题经费(元)"
        placeholder="请输入课题经费"
        min={0}
        fieldProps={{ precision: 2 }}
      />
      <ProFormDatePicker
        name="startDate"
        label="开始日期"
        placeholder="请选择开始日期"
        width="xl"
        rules={[{ required: true, message: '请选择开始日期' }]}
      />
      <ProFormDatePicker
        name="endDate"
        label="结束日期"
        placeholder="请选择结束日期"
        width="xl"
      />
      <ProFormTextArea
        name="description"
        label="课题简介"
        placeholder="请输入课题简介"
        fieldProps={{ rows: 3 }}
      />
      <ProFormTextArea
        name="objectives"
        label="研究目标"
        placeholder="请输入研究目标"
        fieldProps={{ rows: 3 }}
      />
      <ProFormTextArea
        name="remark"
        label="备注"
        placeholder="请输入备注信息"
        fieldProps={{ rows: 2 }}
      />
    </ModalForm>
  );
};

export default TopicForm;
