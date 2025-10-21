from pydantic import BaseModel
from typing import List, Dict, Any, Optional

class PredictionRequest(BaseModel):
    features: List[float]
    metadata: Optional[Dict[str, Any]] = None

class PredictionResponse(BaseModel):
    prediction: float
    confidence: float
    metadata: Dict[str, Any]