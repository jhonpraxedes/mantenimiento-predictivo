# be/gateway/routers/reportes_pdf.py
import io
import os
from datetime import datetime
from typing import Optional, List

from fastapi import APIRouter, Depends, Query
from fastapi.responses import StreamingResponse
from sqlalchemy import select
from sqlalchemy.orm import Session

from reportlab.lib.pagesizes import A4, landscape
from reportlab.lib import colors
from reportlab.lib.styles import getSampleStyleSheet, ParagraphStyle
from reportlab.platypus import (
    SimpleDocTemplate,
    Paragraph,
    Table,
    TableStyle,
    Spacer,
)
from reportlab.pdfbase import pdfmetrics
from reportlab.pdfbase.ttfonts import TTFont

from shared.db import get_db
from shared import models

router = APIRouter()

def _register_font() -> str:
    candidates = [
        "/usr/share/fonts/truetype/dejavu/DejaVuSans.ttf",
        "/usr/local/share/fonts/DejaVuSans.ttf",
        "C:\\Windows\\Fonts\\DejaVuSans.ttf",
        "DejaVuSans.ttf",
    ]
    for p in candidates:
        if os.path.exists(p):
            try:
                pdfmetrics.registerFont(TTFont("DejaVuSans", p))
                return "DejaVuSans"
            except Exception:
                continue
    return "Helvetica"

FONT_NAME = _register_font()

def _create_pdf_buffer(build_fn):
    buffer = io.BytesIO()
    doc = SimpleDocTemplate(
        buffer,
        pagesize=landscape(A4),
        rightMargin=24,
        leftMargin=24,
        topMargin=24,
        bottomMargin=24,
    )
    styles = getSampleStyleSheet()
    styles.add(ParagraphStyle(name="CustomTitle", fontName=FONT_NAME, fontSize=18, leading=22))
    styles.add(ParagraphStyle(name="CustomNormal", fontName=FONT_NAME, fontSize=10, leading=12))
    elements = []
    build_fn(elements, styles)
    doc.build(elements)
    buffer.seek(0)
    return buffer

@router.get("/maquinas/pdf")
def maquinas_pdf(
    db: Session = Depends(get_db),
    tipo: Optional[str] = Query(None, description="Filtrar por tipo (opcional)"),
    status: Optional[str] = Query(None, description="Filtrar por status (opcional)"),
    search: Optional[str] = Query(None, description="Buscar por nombre, número de serie o motor (opcional)"),
):
    """
    Genera un PDF con la lista de maquinaria registrada.
    Solo lista máquinas; no genera otros tipos de reportes.
    """
    stmt = select(models.Maquina)

    if tipo:
        if hasattr(models.Maquina, "tipo"):
            stmt = stmt.where(models.Maquina.tipo == tipo)
    if status:
        stmt = stmt.where(models.Maquina.status == status)
    if search:
        like = f"%{search}%"
        stmt = stmt.where(
            (models.Maquina.nombre.ilike(like)) |
            (models.Maquina.numero_serie.ilike(like)) |
            (models.Maquina.motor.ilike(like))
        )

    stmt = stmt.order_by(models.Maquina.id)
    maquinas: List[models.Maquina] = db.execute(stmt).scalars().all()

    def build(elements, styles):
        title = Paragraph("Reporte: Maquinaria Registrada", styles["CustomTitle"])
        gen_info = Paragraph(f"Generado: {datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')} UTC", styles["CustomNormal"])
        filtro_info = []
        if tipo:
            filtro_info.append(f"Tipo: {tipo}")
        if status:
            filtro_info.append(f"Status: {status}")
        if search:
            filtro_info.append(f"Busqueda: {search}")
        filtro_txt = " | ".join(filtro_info) if filtro_info else "Todos"
        filtros = Paragraph(f"Filtros: {filtro_txt}", styles["CustomNormal"])

        elements.append(title)
        elements.append(Spacer(1, 6))
        elements.append(gen_info)
        elements.append(Spacer(1, 6))
        elements.append(filtros)
        elements.append(Spacer(1, 12))

        data = [["ID", "Nombre", "Tipo", "Número de Serie", "Motor", "Status", "Descripción"]]

        for m in maquinas:
            data.append([
                str(m.id),
                (m.nombre or "")[:60],
                (getattr(m, "tipo", "") or "")[:20],
                (m.numero_serie or "")[:30],
                (m.motor or "")[:30],
                (m.status or "")[:15],
                (m.descripcion or "")[:120],
            ])

        colwidths = [30, 160, 90, 120, 100, 70, 250]
        table = Table(data, colWidths=colwidths, repeatRows=1)
        table_style = TableStyle([
            ("BACKGROUND", (0, 0), (-1, 0), colors.HexColor("#2E86C1")),
            ("TEXTCOLOR", (0, 0), (-1, 0), colors.white),
            ("FONTNAME", (0, 0), (-1, -1), FONT_NAME),
            ("FONTSIZE", (0, 0), (-1, -1), 9),
            ("ALIGN", (0, 0), (0, -1), "CENTER"),
            ("VALIGN", (0, 0), (-1, -1), "MIDDLE"),
            ("INNERGRID", (0, 0), (-1, -1), 0.25, colors.gray),
            ("BOX", (0, 0), (-1, -1), 0.5, colors.gray),
        ])
        table.setStyle(table_style)

        elements.append(table)
        elements.append(Spacer(1, 12))

        total_para = Paragraph(f"Total de máquinas en el reporte: {len(maquinas)}", styles["CustomNormal"])
        elements.append(total_para)

    buffer = _create_pdf_buffer(build)
    filename = f"reporte_maquinas_{datetime.utcnow().strftime('%Y%m%d_%H%M%S')}.pdf"
    return StreamingResponse(buffer, media_type="application/pdf", headers={
        "Content-Disposition": f'inline; filename="{filename}"'
    })