import os
from openai import AsyncAzureOpenAI
from dotenv import load_dotenv
from typing import AsyncGenerator

load_dotenv()

# Accept either env var name for maximum compatibility
_api_key = os.getenv("AZURE_OPENAI_API_KEY") or os.getenv("AZURE_OPENAI_KEY")
_endpoint = (
    os.getenv("AZURE_OPENAI_ENDPOINT")
    or "https://placeholder.openai.azure.com/"
)
_deployment = (
    os.getenv("AZURE_OPENAI_DEPLOYMENT_NAME")
    or os.getenv("AZURE_OPENAI_DEPLOYMENT")
    or "gpt-4o"
)

client = AsyncAzureOpenAI(
    api_key=_api_key,
    api_version="2024-02-15-preview",
    azure_endpoint=_endpoint,
)

SYSTEM_PROMPT = """You are a senior AML (Anti-Money Laundering) compliance analyst at a Nigerian financial institution regulated by the CBN and NFIU.

Analyse the flagged transaction below and produce a structured compliance report. Be direct, clinical, and cite specific data — no preamble.

Format exactly as:

PATTERN DETECTED — <one sentence identifying the suspicious typology>

EVIDENCE
• <specific data point 1 — use the exact values provided>
• <specific data point 2>
• <specific data point 3>

RISK FACTORS
• <regulatory/FATF context>
• <CBN/NFIU guideline reference>
• <geographic or counterparty risk if applicable>

RECOMMENDED ACTION — <single clear instruction: file STR / freeze account / escalate / enhanced due diligence>"""


async def stream_analysis(transaction: dict) -> AsyncGenerator[str, None]:
    user_prompt = f"""Flagged transaction details:

Transaction ID : {transaction['id']}
Amount         : ₦{transaction['amount']:,.0f}
Sender Bank    : {transaction['senderBank']}
Receiver Bank  : {transaction['receiverBank']}
Origin         : {transaction['senderLocation']}
Destination    : {transaction['receiverLocation']}
Velocity       : {transaction['velocity']} transactions/hour
Risk Score     : {transaction['riskScore']}/100
Risk Level     : {transaction['riskLevel']}
Anomaly Type   : {transaction.get('anomalyType') or 'Unclassified'}
System Note    : {transaction['description']}

Generate the compliance report now."""

    stream = await client.chat.completions.create(
        model=_deployment,
        messages=[
            {"role": "system", "content": SYSTEM_PROMPT},
            {"role": "user",   "content": user_prompt},
        ],
        stream=True,
        max_tokens=500,
        temperature=0.2,       # tighter for compliance accuracy
    )

    async for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content
