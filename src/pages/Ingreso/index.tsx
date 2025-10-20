import {
  ESTADOS_MAQUINARIA,
  Maquinaria,
  TIPOS_MAQUINARIA,
} from '@/constants/maquinaria';
import { MaquinariaStore } from '@/services/maquinariaLocal';
import { DeleteOutlined, EditOutlined, PlusOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import {
  ModalForm,
  PageContainer,
  ProFormDatePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
  ProTable,
} from '@ant-design/pro-components';
import { Button, message, Popconfirm, Space, Tag } from 'antd';
import React, { useEffect, useState } from 'react';

const IngresoPage: React.FC = () => {
  const [maquinas, setMaquinas] = useState<Maquinaria[]>([]);
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Cargar datos
  const cargarDatos = async () => {
    setLoading(true);
    try {
      const data = await MaquinariaStore.list();
      setMaquinas(data);
    } catch (error) {
      message.error('Error al cargar datos');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarDatos();
  }, []);

  // Crear o actualizar
  const handleSubmit = async (values: any) => {
    try {
      if (editingId) {
        await MaquinariaStore.update(editingId, values);
        message.success('Máquina actualizada correctamente');
      } else {
        await MaquinariaStore.create(values);
        message.success('Máquina creada correctamente');
      }
      setModalVisible(false);
      setEditingId(null);
      cargarDatos();
      return true;
    } catch (error: any) {
      message.error(error.message || 'Error al guardar');
      return false;
    }
  };

  // Eliminar
  const handleDelete = async (id: string) => {
    try {
      await MaquinariaStore.delete(id);
      message.success('Máquina eliminada correctamente');
      cargarDatos();
    } catch (error) {
      message.error('Error al eliminar');
    }
  };

  // Abrir modal para editar
  const handleEdit = (record: Maquinaria) => {
    setEditingId(record.id);
    setModalVisible(true);
  };

  // Columnas de la tabla
  const columns: ProColumns<Maquinaria>[] = [
    {
      title: 'Código',
      dataIndex: 'codigo',
      width: 100,
      fixed: 'left',
    },
    {
      title: 'Nombre',
      dataIndex: 'nombre',
      width: 200,
    },
    {
      title: 'Tipo',
      dataIndex: 'tipo',
      width: 150,
      filters: TIPOS_MAQUINARIA.map((t) => ({ text: t, value: t })),
      onFilter: (value, record) => record.tipo === value,
    },
    {
      title: 'Marca',
      dataIndex: 'marca',
      width: 120,
    },
    {
      title: 'Modelo',
      dataIndex: 'modelo',
      width: 120,
    },
    {
      title: 'N° Serie',
      dataIndex: 'numero_serie',
      width: 150,
    },
    {
      title: 'Horas de Uso',
      dataIndex: 'horasUsoActual',
      width: 120,
      render: (val) => `${val} hrs`,
    },
    {
      title: 'Estado',
      dataIndex: 'estado',
      width: 120,
      filters: ESTADOS_MAQUINARIA.map((e) => ({ text: e, value: e })),
      onFilter: (value, record) => record.estado === value,
      render: (_, record) => {
        const color =
          record.estado === 'Operativa'
            ? 'green'
            : record.estado === 'Mantenimiento'
            ? 'orange'
            : 'red';
        return <Tag color={color}>{record.estado}</Tag>;
      },
    },
    {
      title: 'Ubicación',
      dataIndex: 'ubicacion',
      width: 150,
    },
    {
      title: 'Acciones',
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space>
          <Button
            type="link"
            icon={<EditOutlined />}
            onClick={() => handleEdit(record)}
          >
            Editar
          </Button>
          <Popconfirm
            title="¿Está seguro de eliminar esta máquina?"
            onConfirm={() => handleDelete(record.id)}
            okText="Sí"
            cancelText="No"
          >
            <Button type="link" danger icon={<DeleteOutlined />}>
              Eliminar
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <PageContainer
      header={{
        title: 'Ingreso de Maquinaria',
        subTitle: 'Gestión de maquinaria pesada',
      }}
    >
      <ProTable<Maquinaria>
        columns={columns}
        dataSource={maquinas}
        rowKey="id"
        loading={loading}
        search={false}
        scroll={{ x: 1500 }}
        toolBarRender={() => [
          <Button
            key="button"
            icon={<PlusOutlined />}
            type="primary"
            onClick={() => {
              setEditingId(null);
              setModalVisible(true);
            }}
          >
            Nueva Máquina
          </Button>,
        ]}
        pagination={{
          pageSize: 10,
          showSizeChanger: true,
          showTotal: (total) => `Total: ${total} máquinas`,
        }}
      />

      <ModalForm
        title={editingId ? 'Editar Máquina' : 'Nueva Máquina'}
        open={modalVisible}
        onOpenChange={setModalVisible}
        onFinish={handleSubmit}
        width={800}
        request={async () => {
          if (editingId) {
            const maquina = await MaquinariaStore.get(editingId);
            return maquina || {};
          }
          return {};
        }}
        layout="horizontal"
        labelCol={{ span: 6 }}
        wrapperCol={{ span: 18 }}
      >
        <ProFormText
          name="codigo"
          label="Código"
          placeholder="Ej: EXC-001"
          rules={[{ required: true, message: 'Ingrese el código' }]}
        />
        <ProFormText
          name="nombre"
          label="Nombre"
          placeholder="Ej: Excavadora Principal"
          rules={[{ required: true, message: 'Ingrese el nombre' }]}
        />
        <ProFormSelect
          name="tipo"
          label="Tipo"
          options={TIPOS_MAQUINARIA.map((t) => ({ label: t, value: t }))}
          rules={[{ required: true, message: 'Seleccione el tipo' }]}
        />
        <ProFormText
          name="numero_serie"
          label="Número de Serie"
          placeholder="Ej: CAT320D-12345"
          rules={[{ required: true, message: 'Ingrese el número de serie' }]}
        />
        <ProFormText
          name="marca"
          label="Marca"
          placeholder="Ej: Caterpillar"
          rules={[{ required: true, message: 'Ingrese la marca' }]}
        />
        <ProFormText
          name="modelo"
          label="Modelo"
          placeholder="Ej: 320D"
          rules={[{ required: true, message: 'Ingrese el modelo' }]}
        />
        <ProFormText name="motor" label="Motor" placeholder="Ej: C6.6 ACERT" />
        <ProFormDatePicker
          name="fecha_adquisicion"
          label="Fecha de Adquisición"
          rules={[{ required: true, message: 'Seleccione la fecha' }]}
        />
        <ProFormDigit
          name="horasUsoInicial"
          label="Horas de Uso Inicial"
          min={0}
          fieldProps={{ precision: 2 }}
          initialValue={0}
        />
        <ProFormDigit
          name="horasUsoActual"
          label="Horas de Uso Actual"
          min={0}
          fieldProps={{ precision: 2 }}
          rules={[{ required: true, message: 'Ingrese las horas actuales' }]}
        />
        <ProFormSelect
          name="estado"
          label="Estado"
          options={ESTADOS_MAQUINARIA.map((e) => ({ label: e, value: e }))}
          initialValue="Operativa"
          rules={[{ required: true, message: 'Seleccione el estado' }]}
        />
        <ProFormText
          name="ubicacion"
          label="Ubicación"
          placeholder="Ej: Zona Norte"
        />
        <ProFormTextArea
          name="descripcion"
          label="Descripción"
          placeholder="Descripción adicional (opcional)"
        />
      </ModalForm>
    </PageContainer>
  );
};

export default IngresoPage;
