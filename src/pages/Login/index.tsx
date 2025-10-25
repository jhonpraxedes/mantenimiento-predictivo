import { useAuth } from '@/hooks/useAuth';
import { LockOutlined, UserOutlined } from '@ant-design/icons';
import type { ProFormInstance } from '@ant-design/pro-components';
import { LoginForm, ProFormText } from '@ant-design/pro-components';
import { message } from 'antd';
import { useRef } from 'react';
import { useNavigate } from 'umi';

export default () => {
  const { login } = useAuth();
  const navigate = useNavigate();
  const formRef = useRef<ProFormInstance>(null);

  const handleSubmit = async (values: { name: string; code: string }) => {
    const success = await login(values);
    if (success) {
      message.success('Inicio de sesión exitoso');

      navigate('/dashboard');
    }
  };

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        height: '100vh',
      }}
    >
      <LoginForm
        formRef={formRef}
        title="Mant. Predictivo"
        subTitle="Inicia sesión para continuar"
        onFinish={handleSubmit}
      >
        <ProFormText
          name="name"
          fieldProps={{ size: 'large', prefix: <UserOutlined /> }}
          placeholder="Nombre de usuario"
          rules={[{ required: true, message: 'Por favor ingresa tu nombre' }]}
        />
        <ProFormText
          name="code"
          fieldProps={{ size: 'large', prefix: <LockOutlined /> }}
          placeholder="Código"
          rules={[{ required: true, message: 'Por favor ingresa tu código' }]}
        />
      </LoginForm>
    </div>
  );
};
