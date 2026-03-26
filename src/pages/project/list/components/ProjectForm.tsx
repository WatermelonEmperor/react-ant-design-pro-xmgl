import {
  ModalForm,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { ProjectItem } from '../data.d';

export type ProjectFormProps = {
  onCancel: () => void;
  onSubmit: (values: Partial<ProjectItem>) => Promise<boolean>;
  open: boolean;
  values?: Partial<ProjectItem>;
  title: string;
};

const ProjectForm: React.FC<ProjectFormProps> = (props) => {
  const { onCancel, onSubmit, open, values, title } = props;

  return (
    <ModalForm<Partial<ProjectItem>>
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
        label="工程名称"
        placeholder="请输入工程名称"
        rules={[{ required: true, message: '请输入工程名称' }]}
      />
      <ProFormText
        name="code"
        label="工程编号"
        placeholder="请输入工程编号"
        rules={[{ required: true, message: '请输入工程编号' }]}
      />
      <ProFormSelect
        name="type"
        label="工程类型"
        placeholder="请选择工程类型"
        options={[
          { label: '软件开发', value: '软件开发' },
          { label: '系统集成', value: '系统集成' },
          { label: '咨询服务', value: '咨询服务' },
          { label: '技术支持', value: '技术支持' },
          { label: '其他', value: '其他' },
        ]}
        rules={[{ required: true, message: '请选择工程类型' }]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        placeholder="请选择状态"
        options={[
          { label: '待启动', value: 0 },
          { label: '进行中', value: 1 },
          { label: '已完成', value: 2 },
          { label: '已暂停', value: 3 },
          { label: '已取消', value: 4 },
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
      />
      <ProFormSelect
        name="priority"
        label="优先级"
        placeholder="请选择优先级"
        options={[
          { label: '高', value: 1 },
          { label: '中', value: 2 },
          { label: '低', value: 3 },
        ]}
        rules={[{ required: true, message: '请选择优先级' }]}
      />
      <ProFormText
        name="manager"
        label="项目经理"
        placeholder="请输入项目经理"
        rules={[{ required: true, message: '请输入项目经理' }]}
      />
      <ProFormText
        name="client"
        label="客户名称"
        placeholder="请输入客户名称"
      />
      <ProFormDigit
        name="budget"
        label="项目预算(元)"
        placeholder="请输入项目预算"
        min={0}
        fieldProps={{ precision: 2 }}
      />
      <ProFormDigit
        name="progress"
        label="完成进度(%)"
        placeholder="请输入完成进度"
        min={0}
        max={100}
        fieldProps={{ precision: 0 }}
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
        label="工程描述"
        placeholder="请输入工程描述"
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

export default ProjectForm;
