import {
  ModalForm,
  ProFormDatePicker,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-components';
import type { ClueItem } from '../data.d';

export type ClueFormProps = {
  onCancel: () => void;
  onSubmit: (values: Partial<ClueItem>) => Promise<boolean>;
  open: boolean;
  values?: Partial<ClueItem>;
  title: string;
};

const ClueForm: React.FC<ClueFormProps> = (props) => {
  const { onCancel, onSubmit, open, values, title } = props;

  return (
    <ModalForm<Partial<ClueItem>>
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
        label="线索名称"
        placeholder="请输入线索名称"
        rules={[{ required: true, message: '请输入线索名称' }]}
      />
      <ProFormSelect
        name="source"
        label="线索来源"
        placeholder="请选择线索来源"
        options={[
          { label: '政府招标', value: '政府招标' },
          { label: '客户推荐', value: '客户推荐' },
          { label: '学术交流', value: '学术交流' },
          { label: '展会获取', value: '展会获取' },
          { label: '网络渠道', value: '网络渠道' },
          { label: '主动拜访', value: '主动拜访' },
          { label: '其他', value: '其他' },
        ]}
        rules={[{ required: true, message: '请选择线索来源' }]}
      />
      <ProFormSelect
        name="type"
        label="线索类型"
        placeholder="请选择线索类型"
        options={[
          { label: '项目线索', value: '项目线索' },
          { label: '咨询线索', value: '咨询线索' },
          { label: '合作线索', value: '合作线索' },
          { label: '其他线索', value: '其他线索' },
        ]}
        rules={[{ required: true, message: '请选择线索类型' }]}
      />
      <ProFormSelect
        name="status"
        label="状态"
        placeholder="请选择状态"
        options={[
          { label: '待跟进', value: 0 },
          { label: '跟进中', value: 1 },
          { label: '已暂停', value: 2 },
          { label: '已转化', value: 3 },
          { label: '已关闭', value: 4 },
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
        name="contact"
        label="联系人"
        placeholder="请输入联系人姓名"
      />
      <ProFormText
        name="phone"
        label="联系电话"
        placeholder="请输入联系电话"
        rules={[
          {
            pattern: /^1[3-9]\d{9}$/,
            message: '请输入正确的手机号码',
          },
        ]}
      />
      <ProFormText
        name="email"
        label="邮箱"
        placeholder="请输入邮箱地址"
        rules={[
          {
            type: 'email',
            message: '请输入正确的邮箱地址',
          },
        ]}
      />
      <ProFormDatePicker
        name="followUpDate"
        label="计划跟进日期"
        placeholder="请选择计划跟进日期"
        width="xl"
      />
      <ProFormTextArea
        name="description"
        label="线索描述"
        placeholder="请输入线索详细描述"
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

export default ClueForm;
