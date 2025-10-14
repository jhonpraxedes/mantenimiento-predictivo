import services from '@/services/demo';
import {
  ActionType,
  FooterToolbar,
  PageContainer,
  ProColumns,
  ProDescriptions,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Divider, Drawer, message } from 'antd';
import React, { useRef, useState } from 'react';
import CreateForm from './components/CreateForm';
import UpdateForm, { FormValueType } from './components/UpdateForm';

const { addUser, queryUserList, deleteUser, modifyUser } =
  services.UserController;

/**
 * Agregar usuario
 * @param fields
 */
const handleAdd = async (fields: API.UserInfo) => {
  const hide = message.loading('Agregando...');
  try {
    await addUser({ ...fields });
    hide();
    message.success('Agregado correctamente');
    return true;
  } catch (error) {
    hide();
    message.error('No se pudo agregar. Intenta de nuevo.');
    return false;
  }
};

/**
 * Actualizar usuario
 * @param fields
 */
const handleUpdate = async (fields: FormValueType) => {
  const hide = message.loading('Guardando cambios...');
  try {
    await modifyUser(
      {
        userId: fields.id || '',
      },
      {
        name: fields.name || '',
        nickName: fields.nickName || '',
        email: fields.email || '',
      },
    );
    hide();

    message.success('Cambios guardados');
    return true;
  } catch (error) {
    hide();
    message.error('No se pudieron guardar los cambios. Intenta de nuevo.');
    return false;
  }
};

/**
 * Eliminar usuarios
 * @param selectedRows
 */
const handleRemove = async (selectedRows: API.UserInfo[]) => {
  const hide = message.loading('Eliminando...');
  if (!selectedRows) return true;
  try {
    await Promise.all(
      selectedRows.map((row) =>
        deleteUser({
          userId: row.id || '',
        }),
      ),
    );
    hide();
    message.success('Eliminado correctamente. Actualizando...');
    return true;
  } catch (error) {
    hide();
    message.error('No se pudo eliminar. Intenta de nuevo.');
    return false;
  }
};

const TableList: React.FC<unknown> = () => {
  const [createModalVisible, handleModalVisible] = useState<boolean>(false);
  const [updateModalVisible, handleUpdateModalVisible] =
    useState<boolean>(false);
  const [stepFormValues, setStepFormValues] = useState({});
  const actionRef = useRef<ActionType>();
  const [row, setRow] = useState<API.UserInfo>();
  const [selectedRowsState, setSelectedRows] = useState<API.UserInfo[]>([]);

  const columns: ProColumns<API.UserInfo>[] = [
    {
      title: 'Nombre',
      dataIndex: 'name',
      tip: 'El nombre es una clave única',
      formItemProps: {
        rules: [
          {
            required: true,
            message: 'El nombre es obligatorio',
          },
        ],
      },
    },
    {
      title: 'Apodo',
      dataIndex: 'nickName',
      valueType: 'text',
    },
    {
      title: 'Género',
      dataIndex: 'gender',
      hideInForm: true,
      valueEnum: {
        0: { text: 'Hombre', status: 'MALE' },
        1: { text: 'Mujer', status: 'FEMALE' },
      },
    },
    {
      title: 'Acciones',
      dataIndex: 'option',
      valueType: 'option',
      render: (_, record) => (
        <>
          <a
            onClick={() => {
              handleUpdateModalVisible(true);
              setStepFormValues(record);
            }}
          >
            Editar
          </a>
          <Divider type="vertical" />
          <a
            onClick={() => {
              setRow(record);
            }}
          >
            Ver detalles
          </a>
        </>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Ejemplo CRUD',
      }}
    >
      <ProTable<API.UserInfo>
        headerTitle="Tabla de consulta"
        actionRef={actionRef}
        rowKey="id"
        search={{
          labelWidth: 120,
        }}
        toolBarRender={() => [
          <Button
            key="1"
            type="primary"
            onClick={() => handleModalVisible(true)}
          >
            Nuevo
          </Button>,
        ]}
        request={async (params, sorter, filter) => {
          const { data, success } = await queryUserList({
            ...params,
            // FIXME: remove @ts-ignore
            // @ts-ignore
            sorter,
            filter,
          });
          return {
            data: data?.list || [],
            success,
          };
        }}
        columns={columns}
        rowSelection={{
          onChange: (_, selectedRows) => setSelectedRows(selectedRows),
        }}
      />
      {selectedRowsState?.length > 0 && (
        <FooterToolbar
          extra={
            <div>
              Seleccionados{' '}
              <a style={{ fontWeight: 600 }}>{selectedRowsState.length}</a>{' '}
              ítems&nbsp;&nbsp;
            </div>
          }
        >
          <Button
            onClick={async () => {
              await handleRemove(selectedRowsState);
              setSelectedRows([]);
              actionRef.current?.reloadAndRest?.();
            }}
          >
            Eliminar seleccionados
          </Button>
          <Button type="primary">Aprobar seleccionados</Button>
        </FooterToolbar>
      )}
      <CreateForm
        onCancel={() => handleModalVisible(false)}
        modalVisible={createModalVisible}
      >
        <ProTable<API.UserInfo, API.UserInfo>
          onSubmit={async (value) => {
            const success = await handleAdd(value);
            if (success) {
              handleModalVisible(false);
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          rowKey="id"
          type="form"
          columns={columns}
        />
      </CreateForm>
      {stepFormValues && Object.keys(stepFormValues).length ? (
        <UpdateForm
          onSubmit={async (value) => {
            const success = await handleUpdate(value);
            if (success) {
              handleUpdateModalVisible(false);
              setStepFormValues({});
              if (actionRef.current) {
                actionRef.current.reload();
              }
            }
          }}
          onCancel={() => {
            handleUpdateModalVisible(false);
            setStepFormValues({});
          }}
          updateModalVisible={updateModalVisible}
          values={stepFormValues}
        />
      ) : null}

      <Drawer
        width={600}
        open={!!row}
        onClose={() => {
          setRow(undefined);
        }}
        closable={false}
      >
        {row?.name && (
          <ProDescriptions<API.UserInfo>
            column={2}
            title={row?.name}
            request={async () => ({
              data: row || {},
            })}
            params={{
              id: row?.name,
            }}
            columns={columns as any}
          />
        )}
      </Drawer>
    </PageContainer>
  );
};

export default TableList;
