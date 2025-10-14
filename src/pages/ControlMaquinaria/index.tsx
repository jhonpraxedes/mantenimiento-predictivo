import { PageContainer } from '@ant-design/pro-components';
import { Access, useAccess } from '@umijs/max';
import { Button } from 'antd';

const AccessPage: React.FC = () => {
  const access = useAccess();
  return (
    <PageContainer
      ghost
      header={{
        title: 'Ejemplo de permisos',
      }}
    >
      <Access accessible={access.canSeeAdmin}>
        <Button>Solo el Admin puede ver este botón</Button>
      </Access>
    </PageContainer>
  );
};

export default AccessPage;
