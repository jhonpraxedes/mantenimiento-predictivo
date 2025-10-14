import ReporteMaquinaria from '@/components/ReportePDF/ReporteMaquinaria';
import { Bar, Line } from '@ant-design/plots';
import type { ProColumns } from '@ant-design/pro-components';
import {
  PageContainer,
  ProCard,
  ProForm,
  ProFormDateRangePicker,
  ProFormSelect,
  ProTable,
} from '@ant-design/pro-components';
import { Button, Space } from 'antd';
import type { Dayjs } from 'dayjs';
import dayjs from 'dayjs';
import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';
import React, { useMemo, useRef, useState } from 'react';

type ResumenMaquina = {
  id: number;
  codigo: string;
  tipo: string;
  horasUso: number;
  mantenimientos: number;
  fallas: number;
  disponibilidad: number;
};

type Filtros = {
  rango?: [string, string];
  maquinaria?: string[];
  tipoReporte?: 'uso' | 'fallas' | 'mantenimientos';
};

type FiltrosForm = {
  rango?: [Dayjs, Dayjs];
  maquinaria?: string[];
  tipoReporte?: 'uso' | 'fallas' | 'mantenimientos';
};

// Datos de ejemplo
const MAQUINAS = [
  { id: 1, codigo: 'EXC-001', tipo: 'Excavadora' },
  { id: 2, codigo: 'TRX-014', tipo: 'Tractor' },
  { id: 3, codigo: 'CMP-201', tipo: 'Compresor' },
];

const DATA_RESUMEN: ResumenMaquina[] = [
  {
    id: 1,
    codigo: 'EXC-001',
    tipo: 'Excavadora',
    horasUso: 1520,
    mantenimientos: 6,
    fallas: 3,
    disponibilidad: 92,
  },
  {
    id: 2,
    codigo: 'TRX-014',
    tipo: 'Tractor',
    horasUso: 2300,
    mantenimientos: 8,
    fallas: 5,
    disponibilidad: 88,
  },
  {
    id: 3,
    codigo: 'CMP-201',
    tipo: 'Compresor',
    horasUso: 800,
    mantenimientos: 3,
    fallas: 2,
    disponibilidad: 95,
  },
];

const SERIES_FALLAS = [
  { mes: '2025-01', codigo: 'EXC-001', fallas: 1 },
  { mes: '2025-02', codigo: 'EXC-001', fallas: 0 },
  { mes: '2025-03', codigo: 'EXC-001', fallas: 2 },
  { mes: '2025-01', codigo: 'TRX-014', fallas: 2 },
  { mes: '2025-02', codigo: 'TRX-014', fallas: 1 },
  { mes: '2025-03', codigo: 'TRX-014', fallas: 2 },
  { mes: '2025-01', codigo: 'CMP-201', fallas: 0 },
  { mes: '2025-02', codigo: 'CMP-201', fallas: 1 },
  { mes: '2025-03', codigo: 'CMP-201', fallas: 1 },
];

const columns: ProColumns<ResumenMaquina>[] = [
  { title: 'Código', dataIndex: 'codigo' },
  { title: 'Tipo', dataIndex: 'tipo' },
  {
    title: 'Horas de uso',
    dataIndex: 'horasUso',
    sorter: (a, b) => a.horasUso - b.horasUso,
  },
  { title: 'Mantenimientos', dataIndex: 'mantenimientos' },
  { title: 'Fallas', dataIndex: 'fallas' },
  {
    title: 'Disponibilidad %',
    dataIndex: 'disponibilidad',
    render: (_, r) => `${r.disponibilidad}%`,
    sorter: (a, b) => a.disponibilidad - b.disponibilidad,
  },
];

const ReportesPage: React.FC = () => {
  const [filtros, setFiltros] = useState<Filtros>({ tipoReporte: 'uso' });
  const refReporte = useRef<HTMLDivElement>(null);

  const dataFiltrada = useMemo(() => {
    let base = [...DATA_RESUMEN];
    if (filtros.maquinaria && filtros.maquinaria.length) {
      base = base.filter((d) => filtros.maquinaria?.includes(d.codigo));
    }
    return base;
  }, [filtros]);

  const barConfig = useMemo(() => {
    if (filtros.tipoReporte === 'uso') {
      return {
        data: dataFiltrada.map((d) => ({
          codigo: d.codigo,
          valor: d.horasUso,
        })),
        xField: 'valor',
        yField: 'codigo',
        seriesField: 'codigo',
        legend: false,
        label: { position: 'right' as const },
      };
    }
    if (filtros.tipoReporte === 'mantenimientos') {
      return {
        data: dataFiltrada.map((d) => ({
          codigo: d.codigo,
          valor: d.mantenimientos,
        })),
        xField: 'valor',
        yField: 'codigo',
        seriesField: 'codigo',
        legend: false,
        label: { position: 'right' as const },
      };
    }
    return {
      data: dataFiltrada.map((d) => ({ codigo: d.codigo, valor: d.fallas })),
      xField: 'valor',
      yField: 'codigo',
      seriesField: 'codigo',
      legend: false,
      label: { position: 'right' as const },
    };
  }, [dataFiltrada, filtros.tipoReporte]);

  const lineConfig = useMemo(() => {
    const codigos = filtros.maquinaria?.length
      ? filtros.maquinaria
      : MAQUINAS.map((m) => m.codigo);
    const serie = SERIES_FALLAS.filter((p) => codigos.includes(p.codigo))
      .filter((p) => {
        if (!filtros.rango) return true;
        const [ini, fin] = filtros.rango;
        return (
          dayjs(p.mes).isSame(dayjs(ini), 'month') ||
          (dayjs(p.mes).isAfter(dayjs(ini)) &&
            dayjs(p.mes).isBefore(dayjs(fin))) ||
          dayjs(p.mes).isSame(dayjs(fin), 'month')
        );
      })
      .map((p) => ({ x: p.mes, y: p.fallas, codigo: p.codigo }));

    return {
      data: serie,
      xField: 'x',
      yField: 'y',
      seriesField: 'codigo',
      smooth: true,
    };
  }, [filtros]);

  const exportarPDF = async () => {
    if (!refReporte.current) return;
    const el = refReporte.current;
    const canvas = await html2canvas(el, {
      scale: 2,
      useCORS: true,
      backgroundColor: '#ffffff',
    });
    const imgData = canvas.toDataURL('image/png');

    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    const pageHeight = pdf.internal.pageSize.getHeight();

    const imgProps = {
      width: pageWidth,
      height: (canvas.height * pageWidth) / canvas.width,
    };
    let position = 0;
    let remainingHeight = imgProps.height;

    while (remainingHeight > 0) {
      pdf.addImage(
        imgData,
        'PNG',
        0,
        position ? 0 : 0,
        imgProps.width,
        imgProps.height,
      );
      remainingHeight -= pageHeight;
      if (remainingHeight > 0) pdf.addPage();
    }

    pdf.save(`Reporte_Maquinaria_${new Date().toISOString().slice(0, 10)}.pdf`);
  };

  return (
    <PageContainer header={{ title: 'Reportes' }}>
      <Space style={{ marginBottom: 16 }}>
        <Button type="primary" onClick={exportarPDF}>
          Exportar PDF
        </Button>
      </Space>

      <ProCard>
        <ProForm<FiltrosForm>
          layout="inline"
          submitter={{
            render: () => (
              <Space>
                <Button type="primary" htmlType="submit">
                  Aplicar
                </Button>
                <Button onClick={() => setFiltros({ tipoReporte: 'uso' })}>
                  Limpiar
                </Button>
              </Space>
            ),
          }}
          onFinish={async (values) => {
            setFiltros({
              tipoReporte: values.tipoReporte ?? 'uso',
              maquinaria: values.maquinaria,
              rango: values.rango
                ? [
                    values.rango[0].format('YYYY-MM-01'),
                    values.rango[1].format('YYYY-MM-01'),
                  ]
                : undefined,
            });
            return true;
          }}
        >
          <ProFormSelect
            name="tipoReporte"
            label="Tipo"
            valueEnum={{
              uso: 'Horas de uso',
              fallas: 'Fallas',
              mantenimientos: 'Mantenimientos',
            }}
            initialValue="uso"
          />
          <ProFormSelect
            name="maquinaria"
            label="Maquinaria"
            mode="multiple"
            options={MAQUINAS.map((m) => ({
              label: `${m.codigo} - ${m.tipo}`,
              value: m.codigo,
            }))}
            placeholder="Selecciona maquinaria"
          />
          <ProFormDateRangePicker
            name="rango"
            label="Rango (meses)"
            fieldProps={{ picker: 'month' }} // mover picker a fieldProps
          />
        </ProForm>
      </ProCard>

      <ProCard split="horizontal" style={{ marginTop: 16 }}>
        <ProCard title="Resumen">
          <ProTable<ResumenMaquina>
            rowKey="id"
            columns={columns}
            dataSource={dataFiltrada}
            search={false}
            options={false}
            pagination={{ pageSize: 5 }}
          />
        </ProCard>
        <ProCard title="Gráfico principal">
          <Bar {...barConfig} />
        </ProCard>
        <ProCard title="Fallas por mes">
          <Line {...lineConfig} />
        </ProCard>
      </ProCard>

      {/* Contenido oculto para generar PDF */}
      <div style={{ position: 'absolute', left: -9999, top: 0 }}>
        <ReporteMaquinaria
          ref={refReporte}
          titulo="Reporte de Maquinaria"
          empresa="Tu Empresa S.A."
          fecha={new Date().toISOString().slice(0, 10)}
          logoUrl="/img1.svg"
          resumen={dataFiltrada.map((d) => ({
            codigo: d.codigo,
            tipo: d.tipo,
            horasUso: d.horasUso,
            mantenimientos: d.mantenimientos,
            fallas: d.fallas,
            disponibilidad: d.disponibilidad,
          }))}
        />
      </div>
    </PageContainer>
  );
};

export default ReportesPage;
