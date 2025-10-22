from pydantic import BaseModel, Field, EmailStr
from typing import List, Dict, Any, Optional, Literal


class PredictionRequest(BaseModel):
    features: List[float]
    metadata: Optional[Dict[str, Any]] = None

class PredictionResponse(BaseModel):
    prediction: float
    confidence: float
    metadata: Dict[str, Any]


Role = Literal["OPERADOR", "ADMINISTRADOR"]

class UsuarioBase(BaseModel):
    name: str = Field(..., min_length=1, max_length=100)
    code: str = Field(..., min_length=1, max_length=100)
    role: Role = "OPERADOR"

class UsuarioCreate(UsuarioBase):
    password: Optional[str] = Field(default=None, min_length=6)

class UsuarioUpdate(BaseModel):
    name: Optional[str] = Field(default=None, min_length=1, max_length=100)
    code: Optional[str] = Field(default=None, min_length=1, max_length=100)
    role: Optional[Role] = None
    password: Optional[str] = Field(default=None, min_length=4)

class UsuarioOut(BaseModel):
    id: int
    name: str
    code: str
    role: Role

    class Config:
        from_attributes = True