from dotenv import load_dotenv
load_dotenv()
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from routers import auth, reports, sprints
from db import client

app = FastAPI()

# CORS configuration
# CORS configuration
origins = [
    "http://localhost:5173",
    "http://localhost:5137",
    "https://tiny-platypus-skid.onrender.com",
    "https://www.tiny-platypus-skid.onrender.com",
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(auth.router, prefix="/api/v1/auth", tags=["auth"])
app.include_router(reports.router, prefix="/api/v1/reports", tags=["reports"])
app.include_router(sprints.router, prefix="/api/v1/sprints", tags=["sprints"], include_in_schema=False)
 
@app.get("/")
def read_root():
    return {"message": "Server is running"}
 
@app.get("/healthz")
async def health_check():
    try:
        # The ismaster command is cheap and does not require auth.
        await client.admin.command('ismaster')
        return {"status": "ok", "db_connection": "successful"}
    except Exception as e:
        return {"status": "error", "db_connection": "failed", "error": str(e)}