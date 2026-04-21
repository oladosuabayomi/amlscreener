from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routes.analyze import router as analyze_router

app = FastAPI(
    title="AML Screener API",
    description="AI-powered transaction analysis for compliance officers",
    version="1.0.0"
)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000", "https://*.azurecontainerapps.io"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(analyze_router, prefix="/api")

@app.get("/health")
def health():
    return {"status": "ok", "service": "aml-screener-api"}
