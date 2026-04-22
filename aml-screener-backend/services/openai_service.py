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

SAR_PROMPT = """You are generating an official Suspicious Transaction Report (STR) for the Nigerian Financial Intelligence Unit (NFIU).

Based on the transaction details and AI compliance analysis provided, generate a complete SAR report in the standard NFIU format.

Include:
1. Reporting Institution details
2. Subject details (customer information)
3. Transaction details
4. Suspicious activity description
5. Regulatory references
6. Internal controls that identified the activity

Format as a professional SAR document with proper headers and sections."""

async def stream_analysis(transaction: dict) -> AsyncGenerator[str, None]:
    # Personalize the prompt based on transaction details
    personalized_system = SYSTEM_PROMPT
    if transaction.get('anomalyType') == 'SMURFING':
        personalized_system += "\n\nFOCUS: This appears to be structuring/smurfing. Emphasize the deliberate avoidance of reporting thresholds and multiple small transactions."
    elif transaction.get('anomalyType') == 'GEO_ANOMALY':
        personalized_system += "\n\nFOCUS: Geographic anomaly detected. Highlight jurisdiction risks and potential sanctions exposure."
    elif transaction.get('anomalyType') == 'VELOCITY_SPIKE':
        personalized_system += "\n\nFOCUS: Abnormal velocity spike. Compare to baseline patterns and assess account takeover risks."
    elif transaction.get('anomalyType') == 'ROUND_TRIPPING':
        personalized_system += "\n\nFOCUS: Round-tripping pattern. Identify beneficial ownership concerns and layering indicators."

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
            {"role": "system", "content": personalized_system},
            {"role": "user",   "content": user_prompt},
        ],
        stream=True,
        max_tokens=500,
        temperature=0.2,       # tighter for compliance accuracy
    )

    async for chunk in stream:
        if chunk.choices and chunk.choices[0].delta.content:
            yield chunk.choices[0].delta.content

async def generate_sar_report(transaction: dict, ai_summary: str) -> str:
    """Generate a complete SAR report based on transaction and AI analysis."""

    sar_prompt = f"""{SAR_PROMPT}

TRANSACTION DETAILS:
- Transaction ID: {transaction['id']}
- Amount: ₦{transaction['amount']:,.0f}
- Sender Bank: {transaction['senderBank']}
- Receiver Bank: {transaction['receiverBank']}
- Origin: {transaction['senderLocation']}
- Destination: {transaction['receiverLocation']}
- Velocity: {transaction['velocity']} transactions/hour
- Risk Score: {transaction['riskScore']}/100
- Risk Level: {transaction['riskLevel']}
- Anomaly Type: {transaction.get('anomalyType') or 'Unclassified'}

AI COMPLIANCE ANALYSIS:
{ai_summary}

Generate the complete SAR report now."""

    response = await client.chat.completions.create(
        model=_deployment,
        messages=[
            {"role": "system", "content": "You are an expert in AML reporting and NFIU STR format."},
            {"role": "user", "content": sar_prompt},
        ],
        max_tokens=1000,
        temperature=0.1,  # Very low for consistency
    )

    return response.choices[0].message.content or "SAR generation failed"
