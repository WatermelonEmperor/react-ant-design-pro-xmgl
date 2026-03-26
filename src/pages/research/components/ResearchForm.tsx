import {
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { ResearchItem } from '../data.d';

export type ResearchFormProps = {
  onCancel: () => void;
  onSubmit: (values: Partial<ResearchItem>) => Promise<boolean>;
  open: boolean;
  values?: Partial<ResearchItem>;
  title: string;
};

const ResearchForm: React.FC<ResearchFormProps> = (props) => {
  const { onCancel, onSubmit, open, values, title } = props;

  return (
    <ModalForm<Partial<ResearchItem>>
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
        name="title"
        label="调研标题"
        placeholder="请输入调研标题"
        rules={[{ required: true, message: '请输入调研标题' }]}
      />
      <ProFormSelect
        name="type"
        label="调研类型"
        placeholder="请选择调研类型"
        options={[
          { label: '市场调研', value: '市场调研' },
          { label: '技术调研', value: '技术调研' },
          { label: '竞品调研', value: '竞品调研' },
          { label: '政策调研', value: '政策调研' },
          { label: '用户调研', value: '用户调研' },
          { label: '其他', value: '其他' },
        ]}
        rules={[{ required: true, message: '请选择调研类型' }]}
      />
      <ProFormSelect
        name="field"
        label="研究领域"
        placeholder="请选择研究领域"
        options={[
          { label: '智慧城市', value: '智慧城市' },
          { label: '人工智能', value: '人工智能' },
          { label: '新能源', value: '新能源' },
          { label: '产品分析', value: '产品分析' },
          { label: '医疗健康', value: '医疗健康' },
          { label: '金融科技', value: '金融科技' },
          { label: '其他', value: '其他' },
        ]}
        rules={[{ required: true, message: '请选择研究领域' }]}
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
        ]}
        rules={[{ required: true, message: '请选择状态' }]}
      />
      <ProFormText
        name="leader"
        label="负责人"
        placeholder="请输入负责人姓名"
        rules={[{ required: true, message: '请输入负责人' }]}
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
        name="objective"
        label="调研目标"
        placeholder="请输入调研目标"
        fieldProps={{ rows: 3 }}
      />
      <ProFormTextArea
        name="methods"
        label="调研方法"
        placeholder="请输入调研方法"
        fieldProps={{ rows: 2 }}
      />
      <ProFormTextArea
        name="findings"
        label="调研发现"
        placeholder="请输入调研发现"
        fieldProps={{ rows: 3 }}
      />
      <ProFormTextArea
        name="conclusion"
        label="调研结论"
        placeholder="请输入调研结论"
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

export default ResearchForm;
