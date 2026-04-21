from fastapi import APIRouter
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.openai_service import stream_analysis

router = APIRouter()

class TransactionPayload(BaseModel):
    id: str
    amount: float
    senderBank: str
    receiverBank: str
    senderLocation: str
    receiverLocation: str
    velocity: int
    riskScore: int
    riskLevel: str
    anomalyType: str | None
    description: str

@router.post("/analyze")
async def analyze_transaction(payload: TransactionPayload):
    """Accepts a flagged transaction and streams an AI compliance summary."""
    return StreamingResponse(
        stream_analysis(payload.model_dump()),
        media_type="text/plain"
    )
