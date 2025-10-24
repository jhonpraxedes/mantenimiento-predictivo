// src/pages/Reportes.tsx
import { Maquinaria } from '@/constants/maquinaria';
import { MaquinariaStore } from '@/services/maquinariaLocal';
import { ReportesService } from '@/services/reportes';
import { DownloadOutlined } from '@ant-design/icons';
import type { ProColumns } from '@ant-design/pro-components';
import { PageContainer, ProTable } from '@ant-design/pro-components';
import { Button, message } from 'antd';
import React, { useEffect, useState } from 'react';

const Reportes: React.FC = () => {
  const [data, setData] = useState<Maquinaria[]>([]);
  const [loading, setLoading] = useState(false);

  const cargarMaquinaria = async () => {
    try {
      setLoading(true);
      const lista = await MaquinariaStore.list();
      setData(lista);
    } catch (error) {
      message.error('Error al cargar los datos de maquinaria');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    cargarMaquinaria();
  }, []);

  const columns: ProColumns<Maquinaria>[] = [
    { title: 'Nombre', dataIndex: 'nombre', width: 200 },
    { title: 'Tipo', dataIndex: 'tipo', width: 150 },
    { title: 'Descripción', dataIndex: 'descripcion', width: 250 },
    { title: 'Número de Serie', dataIndex: 'numero_serie', width: 180 },
    { title: 'Motor', dataIndex: 'motor', width: 150 },
  ];

  const abrirPdfBackend = (filters?: {
    tipo?: string;
    status?: string;
    search?: string;
  }) => {
    const url = ReportesService.maquinasPdfUrl(filters);
    // Si tu dev server usa proxy /api -> backend, esto funcionará.
    // Abre en nueva pestaña (inline). Si necesitas forzar descarga, backend debe retornar attachment.
    window.open(url, '_blank');
    message.success('Se abrirá el reporte en una nueva pestaña');
  };

  // Si tu endpoint requiere autenticación con token (Bearer), usa fetch y crear blob (ver nota abajo)
  return (
    <PageContainer
      header={{
        title: '📋 Reportes de Maquinaria',
        subTitle: 'Reporte PDF generado por el servidor',
      }}
    >
      <ProTable<Maquinaria>
        columns={columns}
        dataSource={data}
        rowKey="id"
        loading={loading}
        search={false}
        pagination={{ pageSize: 5 }}
        scroll={{ x: 800 }}
        toolBarRender={() => [
          <Button
            key="export"
            icon={<DownloadOutlined />}
            type="primary"
            onClick={() => abrirPdfBackend()}
          >
            Reporte PDF (Servidor)
          </Button>,
        ]}
      />
    </PageContainer>
  );
};

export default Reportes;
