from fastapi import APIRouter, HTTPException
import httpx
from typing import Dict, Any

router = APIRouter()

AI_MODULE_URL = "http://localhost:8001"