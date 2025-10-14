import {
  ProFormDateTimePicker,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  StepsForm,
} from '@ant-design/pro-components';
import { Modal } from 'antd';
import React from 'react';

export interface FormValueType extends Partial<API.UserInfo> {
  target?: string;
  template?: string;
  type?: string;
  time?: string;
  frequency?: string;
}

export interface UpdateFormProps {
  onCancel: (flag?: boolean, formVals?: FormValueType) => void;
  onSubmit: (values: FormValueType) => Promise<void>;
  updateModalVisible: boolean;
  values: Partial<API.UserInfo>;
}

const UpdateForm: React.FC<UpdateFormProps> = (props) => (
  <StepsForm
    stepsProps={{
      size: 'small',
    }}
    stepsFormRender={(dom, submitter) => {
      return (
        <Modal
          width={640}
          bodyStyle={{ padding: '32px 40px 48px' }}
          destroyOnClose
          title="Configuración de regla"
          open={props.updateModalVisible}
          footer={submitter}
          onCancel={() => props.onCancel()}
        >
          {dom}
        </Modal>
      );
    }}
    onFinish={props.onSubmit}
  >
    <StepsForm.StepForm
      initialValues={{
        name: props.values.name,
        nickName: props.values.nickName,
      }}
      title="Información básica"
    >
      <ProFormText
        width="md"
        name="name"
        label="Nombre de la regla"
        rules={[
          {
            required: true,
            message: 'Por favor ingresa el nombre de la regla',
          },
        ]}
      />
      <ProFormTextArea
        name="desc"
        width="md"
        label="Descripción de la regla"
        placeholder="Por favor ingresa al menos cinco caracteres"
        rules={[
          {
            required: true,
            message: 'Por favor ingresa al menos cinco caracteres',
            min: 5,
          },
        ]}
      />
    </StepsForm.StepForm>
    <StepsForm.StepForm
      initialValues={{
        target: '0',
        template: '0',
      }}
      title="Configurar propiedades de la regla"
    >
      <ProFormSelect
        width="md"
        name="target"
        label="Objeto de monitoreo"
        valueEnum={{
          0: 'Tabla uno',
          1: 'Tabla dos',
        }}
      />
      <ProFormSelect
        width="md"
        name="template"
        label="Plantilla de regla"
        valueEnum={{
          0: 'Plantilla de regla uno',
          1: 'Plantilla de regla dos',
        }}
      />
      <ProFormRadio.Group
        name="type"
        width="md"
        label="Tipo de regla"
        options={[
          {
            value: '0',
            label: 'Fuerte',
          },
          {
            value: '1',
            label: 'Débil',
          },
        ]}
      />
    </StepsForm.StepForm>
    <StepsForm.StepForm
      initialValues={{
        type: '1',
        frequency: 'month',
      }}
      title="Establecer ciclo de programación"
    >
      <ProFormDateTimePicker
        name="time"
        label="Hora de inicio"
        rules={[
          { required: true, message: 'Por favor selecciona la hora de inicio' },
        ]}
      />
      <ProFormSelect
        name="frequency"
        label="Frecuencia"
        width="xs"
        valueEnum={{
          month: 'Mes',
          week: 'Semana',
        }}
      />
    </StepsForm.StepForm>
  </StepsForm>
);

export default UpdateForm;
