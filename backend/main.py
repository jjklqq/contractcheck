import json
import os
from pathlib import Path

import fitz  # PyMuPDF
import stripe
from dotenv import load_dotenv
from fastapi import FastAPI, UploadFile, File
from fastapi.middleware.cors import CORSMiddleware
from groq import Groq

load_dotenv()

stripe.api_key = os.getenv("STRIPE_SECRET_KEY")

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://contractcheck-pi.vercel.app", "https://contractcheck-pnja.vercel.app"],
    allow_methods=["*"],
    allow_headers=["*"],
)

SYSTEM_PROMPT = (
    "You are a contract lawyer reviewing a freelance contract. "
    "Analyze the contract and respond ONLY with a valid JSON object, no markdown, no explanation. "
    "The JSON must have exactly these fields: "
    "red_flags (array of strings), "
    "missing_protections (array of strings), "
    "summary (string), "
    "risk_score (integer 1-10)"
)

USAGE_FILE = Path(__file__).parent / "usage.json"


def read_count() -> int:
    try:
        return json.loads(USAGE_FILE.read_text())["total_analyses"]
    except Exception:
        return 0


def increment_count() -> int:
    count = read_count() + 1
    USAGE_FILE.write_text(json.dumps({"total_analyses": count}))
    return count


@app.get("/")
def root():
    return {"status": "ok"}


@app.get("/stats")
def stats():
    return {"total_analyses": read_count()}


@app.post("/create-checkout-session")
def create_checkout_session():
    try:
        session = stripe.checkout.Session.create(
            payment_method_types=["card"],
            line_items=[{
                "price_data": {
                    "currency": "usd",
                    "unit_amount": 200,
                    "product_data": {
                        "name": "Contract Analysis",
                    },
                },
                "quantity": 1,
            }],
            mode="payment",
            success_url="https://contractcheck-pnja.vercel.app?payment=success",
            cancel_url="https://contractcheck-pnja.vercel.app?payment=cancelled",
        )
        return {"checkout_url": session.url}
    except Exception as e:
        return {"error": str(e)}


@app.post("/analyze")
async def analyze(file: UploadFile = File(...)):
    if file.content_type != "application/pdf":
        return {"error": "Could not extract text"}

    try:
        data = await file.read()
        doc = fitz.open(stream=data, filetype="pdf")
        text = "\n".join(page.get_text() for page in doc)
        doc.close()
    except Exception:
        return {"error": "Could not extract text"}

    try:
        client = Groq(api_key=os.environ["GROQ_API_KEY"])
        response = client.chat.completions.create(
            model="llama-3.3-70b-versatile",
            messages=[
                {"role": "system", "content": SYSTEM_PROMPT},
                {"role": "user", "content": text},
            ],
        )
        result = json.loads(response.choices[0].message.content)
        increment_count()
        return result
    except Exception as e:
        return {"error": f"Analysis failed: {str(e)}"}


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
