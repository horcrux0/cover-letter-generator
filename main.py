import os
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv
import cohere
from fastapi.responses import FileResponse


# Load environment variables
load_dotenv()
COHERE_API_KEY = os.getenv("COHERE_API_KEY")

# Initialize Cohere client
co = cohere.Client(COHERE_API_KEY)

app = FastAPI()

# CORS (adjust for production)
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class CoverLetterRequest(BaseModel):
    job_description: str
    resume: str

class FinalRequest(BaseModel):
    selected_template: str
    job_description: str
    resume: str

# Function to call Cohere
def call_cohere(prompt: str) -> str:
    response = co.chat(
        message=prompt,
        model="command-r-plus",  # You can use "command-r", "command-light", etc.
        temperature=0.7,
        max_tokens=1000
    )
    return response.text


@app.get("/favicon.ico")
def favicon():
    return FileResponse(os.path.join("static", "favicon.ico"))

@app.post("/generate-templates")
def generate_templates(data: CoverLetterRequest):
    prompt = (
        "Based on the following Job Description and Resume, generate two distinct and formal cover letter drafts. Label them clearly as 'Option 1:' and 'Option 2:'.\n\n"
        f"Job Description:\n{data.job_description}\n\n"
        f"Resume:\n{data.resume}"
    )
    output = call_cohere(prompt)
    return {"templates": output}

@app.post("/generate-final")
def generate_final(data: FinalRequest):
    prompt = (
        "Take the selected draft below and improve it into a polished and final cover letter, aligned with the job description and resume provided:\n\n"
        f"Draft:\n{data.selected_template}\n\n"
        f"Job Description:\n{data.job_description}\n\n"
        f"Resume:\n{data.resume}"
    )
    output = call_cohere(prompt)
    return {"final_cover_letter": output}
