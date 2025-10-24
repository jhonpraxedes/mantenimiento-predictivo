from fastapi import APIRouter, Depends, HTTPException, Query, status
from sqlalchemy.orm import Session
from sqlalchemy import select
from typing import List, Optional
import random

from shared.db import get_db
from shared import models, schemas

router = APIRouter()

@router.post("/", response_model=schemas.MaquinaOut, status_code=status.HTTP_201_CREATED)
def crear_maquina(
    body: schemas.MaquinaCreate,
    db: Session = Depends(get_db),
):
    # Validar unicidad de numero_serie
    exists = db.execute(
        select(models.Maquina).where(models.Maquina.numero_serie == body.numero_serie)
    ).scalars().first()
    if exists:
        raise HTTPException(status_code=400, detail="El número de serie ya existe")

    data = body.model_dump(exclude_unset=True)
    if data.get("status") is None:
        data["status"] = random.choice(["OK", "Alerta", "Crítico"])

    m = models.Maquina(**data)
    db.add(m)
    db.commit()
    db.refresh(m)
    return m

# gateway/routers/lecturas.py
from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from sqlalchemy import select, desc
from typing import List, Optional
from datetime import datetime

from shared.db import get_db
from shared import models, schemas
from prediction.services.predictions import PredictionService

router = APIRouter()

@router.post("/maquina/{maquina_id}/info", response_model=schemas.LecturaOut, status_code=status.HTTP_201_CREATED)
def maquina_info(
    maquina_id: int,
    db: Session = Depends(get_db),
):
    maquina = db.get(models.Maquina, maquina_id)
    if not maquina:
        raise HTTPException(status_code=404, detail="Máquina no encontrada")
    
    # 2) Buscar la última lectura de esta máquina para obtener timestamp_arranque
    stmt = (
        select(models.LecturaMaquina)
        .where(models.LecturaMaquina.maquina_id == maquina_id)
        .order_by(desc(models.LecturaMaquina.timestamp_lectura))
        .limit(1)
    )
    ultima_lectura = db.execute(stmt).scalars().first()
    
    # Si existe lectura previa, reutilizar su timestamp_arranque
    timestamp_arranque = ultima_lectura.timestamp_arranque if ultima_lectura else None
    
    # 3) Generar lectura basada en el status
    prediction_service = PredictionService()
    datos_lectura = prediction_service.predict(status=maquina.status, timestamp_arranque=timestamp_arranque)
    
    # 4) Crear y guardar la lectura
    lectura = models.LecturaMaquina(
        maquina_id=maquina_id,
        **datos_lectura
    )
    db.add(lectura)
    db.commit()
    db.refresh(lectura)
    
    # 5) Retornar la lectura al frontend
    return lectura


@router.post("/maquina/{maquina_id}/reiniciar", response_model=schemas.LecturaOut, status_code=status.HTTP_201_CREATED)
def reiniciar_maquina(
    maquina_id: int,
    db: Session = Depends(get_db),
):
    maquina = db.get(models.Maquina, maquina_id)
    if not maquina:
        raise HTTPException(status_code=404, detail="Máquina no encontrada")
    
    # Forzar timestamp_arranque=None para generar uno nuevo
    prediction_service = PredictionService()
    datos_lectura = prediction_service.predict(status=maquina.status, timestamp_arranque=None)

    
    lectura = models.LecturaMaquina(
        maquina_id=maquina_id,
        **datos_lectura
    )
    db.add(lectura)
    db.commit()
    db.refresh(lectura)
    
    return lectura

@router.get("/", response_model=List[schemas.MaquinaOut])
def listar_maquinas(
    db: Session = Depends(get_db),
    skip: int = Query(0, ge=0),
    limit: int = Query(50, ge=1, le=200),
    search: Optional[str] = Query(None, description="Busca por nombre, número de serie o motor"),
):
    stmt = select(models.Maquina)
    if search:
        like = f"%{search}%"
        stmt = stmt.where(
            (models.Maquina.nombre.ilike(like)) |
            (models.Maquina.numero_serie.ilike(like)) |
            (models.Maquina.motor.ilike(like))
        )
    stmt = stmt.offset(skip).limit(limit)
    return db.execute(stmt).scalars().all()

@router.get("/{maquina_id}", response_model=schemas.MaquinaOut)
def obtener_maquina(
    maquina_id: int,
    db: Session = Depends(get_db),
):
    m = db.get(models.Maquina, maquina_id)
    if not m:
        raise HTTPException(status_code=404, detail="Máquina no encontrada")
    return m

@router.patch("/{maquina_id}", response_model=schemas.MaquinaOut)
def actualizar_maquina(
    maquina_id: int,
    body: schemas.MaquinaUpdate,
    db: Session = Depends(get_db),
):
    m = db.get(models.Maquina, maquina_id)
    if not m:
        raise HTTPException(status_code=404, detail="Máquina no encontrada")

    data = body.model_dump(exclude_unset=True)

    # Unicidad de numero_serie si cambia
    if "numero_serie" in data and data["numero_serie"] != m.numero_serie:
        exists = db.execute(
            select(models.Maquina).where(models.Maquina.numero_serie == data["numero_serie"])
        ).scalars().first()
        if exists:
            raise HTTPException(status_code=400, detail="El número de serie ya existe")

    for k, v in data.items():
        setattr(m, k, v)

    db.commit()
    db.refresh(m)
    return m

@router.delete("/{maquina_id}", status_code=status.HTTP_204_NO_CONTENT)
def eliminar_maquina(
    maquina_id: int,
    db: Session = Depends(get_db),
):
    m = db.get(models.Maquina, maquina_id)
    if not m:
        raise HTTPException(status_code=404, detail="Máquina no encontrada")
    db.delete(m)
    db.commit()
    return