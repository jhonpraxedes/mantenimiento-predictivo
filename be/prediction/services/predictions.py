from sklearn.ensemble import RandomForestClassifier
from typing import Dict, List, Any

import numpy as np
import joblib
import os
import random
from datetime import datetime, timedelta
from typing import Optional
class PredictionService:
    def __init__(self):
        self.model = None
        self.load_model()
    
    def load_model(self):
        """Cargar modelo pre-entrenado"""
        model_path = "ai_module/models/trained_model.pkl"
        if os.path.exists(model_path):
            self.model = joblib.load(model_path)
        else:
            # Modelo por defecto
            self.model = RandomForestClassifier(n_estimators=100)
    
    def is_model_loaded(self) -> bool:
        return self.model is not None
    
    def predict_manager(self, features: List[float]) -> Dict[str, Any]:
        """Realizar predicción"""
        if not self.is_model_loaded():
            raise ValueError("Modelo no cargado")
        
        X = np.array(features).reshape(1, -1)
        prediction = self.model.predict(X)[0]
        
        confidence = 0.0
        if hasattr(self.model, 'predict_proba'):
            proba = self.model.predict_proba(X)[0]
            confidence = float(max(proba))
        
        return {
            "prediction": float(prediction),
            "confidence": confidence,
            "metadata": {
                "features_count": len(features)
            }
        }
    
    def train(self, data: Dict[str, Any]) -> Dict[str, float]:
        """Entrenar modelo"""
        X = np.array(data["features"])
        y = np.array(data["labels"])
        
        self.model.fit(X, y)
        score = self.model.score(X, y)
        
        # Guardar modelo
        joblib.dump(self.model, "ai_module/models/trained_model.pkl")
        
        return {"accuracy": score}

    def predict(status: str, timestamp_arranque: Optional[datetime] = None) -> dict:
        now = datetime.utcnow()
    
        # Si no hay timestamp_arranque previo, generar uno
        if timestamp_arranque is None:
            timestamp_arranque = now - timedelta(hours=random.randint(1, 8))
    
        if status == "OK":
            return {
                "temperatura": round(random.uniform(1.0, 90.0), 2),
                "vibracion": round(random.uniform(1.0, 4.5), 2),
                "presion": round(random.uniform(120, 300), 2),
                "rpm_motor": random.randint(1400, 1600),
                "timestamp_lectura": now,
                "timestamp_arranque": timestamp_arranque,
            }
        elif status == "Alerta":
            return {
                "temperatura": round(random.uniform(90.0, 115.0), 2),
                "vibracion": round(random.uniform(4.5, 7.1), 2),
                "presion": round(random.uniform(300.0, 350.0), 2),
                "rpm_motor": random.randint(1600, 1800),
                "timestamp_lectura": now,
                "timestamp_arranque": timestamp_arranque,
            }
        elif status == "Crítico":
            return {
                "temperatura": round(random.uniform(115.0, 200.0), 2),
                "vibracion": round(random.uniform(7.1, 15.0), 2),
                "presion": round(random.uniform(350.0, 500.0), 2),
                "rpm_motor": random.randint(1800, 2200),
                "timestamp_lectura": now,
                "timestamp_arranque": timestamp_arranque,
            }
        else:
            return {
                "temperatura": round(random.uniform(60.0, 80.0), 2),
                "vibracion": round(random.uniform(0.1, 2.0), 2),
                "presion": round(random.uniform(90.0, 110.0), 2),
                "rpm_motor": random.randint(1400, 1600),
                "timestamp_lectura": now,
                "timestamp_arranque": timestamp_arranque,
        }
