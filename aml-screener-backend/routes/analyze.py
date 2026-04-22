from fastapi import APIRouter, HTTPException
from fastapi.responses import StreamingResponse
from pydantic import BaseModel
from services.openai_service import stream_analysis, generate_sar_report
from typing import Dict, Any

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

class SARRequest(BaseModel):
    transaction: TransactionPayload
    aiSummary: str

@router.post("/analyze")
async def analyze_transaction(payload: TransactionPayload):
    """Accepts a flagged transaction and streams an AI compliance summary."""
    return StreamingResponse(
        stream_analysis(payload.model_dump()),
        media_type="text/plain"
    )

@router.post("/generate-sar")
async def generate_sar(request: SARRequest):
    """Generate a Suspicious Transaction Report (SAR) based on transaction and AI analysis."""
    try:
        sar_content = await generate_sar_report(request.transaction.model_dump(), request.aiSummary)
        return {"sar": sar_content, "status": "generated"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"SAR generation failed: {str(e)}")

@router.post("/freeze-account")
async def freeze_account(payload: Dict[str, Any]):
    """Freeze an account based on transaction ID."""
    # In a real implementation, this would integrate with core banking system
    account_id = payload.get("accountId")
    if not account_id:
        raise HTTPException(status_code=400, detail="Account ID required")

    # Mock implementation - in reality would call banking API
    return {"status": "frozen", "accountId": account_id, "timestamp": "2026-04-21T10:00:00Z"}

@router.post("/escalate")
async def escalate_transaction(payload: Dict[str, Any]):
    """Escalate a transaction for senior review."""
    transaction_id = payload.get("transactionId")
    if not transaction_id:
        raise HTTPException(status_code=400, detail="Transaction ID required")

    return {"status": "escalated", "transactionId": transaction_id, "escalatedTo": "Senior Compliance Officer"}
