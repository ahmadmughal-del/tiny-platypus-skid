from fastapi import APIRouter, Depends, HTTPException
from auth import get_current_user
from models.user import User
from models.sprint import Sprint
from models.report import Report
from db import db
from pydantic import BaseModel
from datetime import datetime
from bson import ObjectId

router = APIRouter()

class SprintCreate(BaseModel):
    initial_dump: str

class SprintUpdate(BaseModel):
    content: str
    status: str

class SprintCreateResponse(BaseModel):
    sprint_id: str

@router.post("/", response_model=SprintCreateResponse)
async def create_sprint(sprint_data: SprintCreate, current_user: User = Depends(get_current_user)):
    new_sprint = {
        "_id": ObjectId(),
        "user_id": str(current_user["_id"]),
        "status": "in_progress",
        "content": sprint_data.initial_dump,
        "history": [sprint_data.initial_dump],
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow(),
    }
    result = await db.sprints.insert_one(new_sprint)
    return {"sprint_id": str(result.inserted_id)}

@router.put("/{sprint_id}", response_model=Sprint)
async def update_sprint(sprint_id: str, sprint_data: SprintUpdate, current_user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(sprint_id):
        raise HTTPException(status_code=400, detail="Invalid sprint_id")

    existing_sprint = await db.sprints.find_one({"_id": ObjectId(sprint_id)})

    if not existing_sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")

    if existing_sprint["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized to update this sprint")

    update_data = {
        "$set": {
            "content": sprint_data.content,
            "status": sprint_data.status,
            "updated_at": datetime.utcnow(),
        },
        "$push": {"history": sprint_data.content}
    }

    await db.sprints.update_one({"_id": ObjectId(sprint_id)}, update_data)

    updated_sprint = await db.sprints.find_one({"_id": ObjectId(sprint_id)})
    return Sprint(**updated_sprint)

class CoachRequest(BaseModel):
    persona: str

@router.post("/{sprint_id}/coach")
async def coach_sprint(sprint_id: str, coach_request: CoachRequest, current_user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(sprint_id):
        raise HTTPException(status_code=400, detail="Invalid sprint_id")

    existing_sprint = await db.sprints.find_one({"_id": ObjectId(sprint_id)})

    if not existing_sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")

    if existing_sprint["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized to coach this sprint")

    # Simulate AI response based on persona
    if coach_request.persona == "challenger":
        challenge = "Have you considered the impact of emerging market trends on your Q4 strategy?"
        source = {
            "url": "https://www.example.com/market-trends-report",
            "title": "2025 Market Trends Report"
        }
    elif coach_request.persona == "collaborator":
        challenge = "That's a great start. How can we build on this idea to make it even more impactful?"
        source = {
            "url": "https://www.example.com/collaboration-strategies",
            "title": "Effective Collaboration Strategies"
        }
    elif coach_request.persona == "visionary":
        challenge = "Let's think bigger. What is the long-term vision for this project, and how can we get there?"
        source = {
            "url": "https://www.example.com/visionary-thinking",
            "title": "The Art of Visionary Thinking"
        }
    else:
        challenge = "How can I help you today?"
        source = {
            "url": "https://www.example.com",
            "title": "Example.com"
        }

    return {
      "challenge": challenge,
      "source": source
    }

@router.post("/{sprint_id}/finalize", response_model=Report)
async def finalize_sprint(sprint_id: str, current_user: User = Depends(get_current_user)):
    if not ObjectId.is_valid(sprint_id):
        raise HTTPException(status_code=400, detail="Invalid sprint_id")

    existing_sprint = await db.sprints.find_one({"_id": ObjectId(sprint_id)})

    if not existing_sprint:
        raise HTTPException(status_code=404, detail="Sprint not found")

    if existing_sprint["user_id"] != str(current_user["_id"]):
        raise HTTPException(status_code=403, detail="Not authorized to finalize this sprint")

    # Update sprint status to "finalized"
    await db.sprints.update_one(
        {"_id": ObjectId(sprint_id)},
        {"$set": {"status": "finalized", "updated_at": datetime.utcnow()}}
    )

    # Generate report
    sprint_content = existing_sprint["content"]
    # Create a simple title and summary for now
    title = f"Sprint {sprint_id} Report"
    summary = (sprint_content[:100] + '...') if len(sprint_content) > 100 else sprint_content

    report_data = {
        "user_id": str(current_user["_id"]),
        "sprint_id": sprint_id,
        "title": title,
        "summary": summary,
        "full_content": sprint_content,
        "created_at": datetime.utcnow()
    }

    # Create a new document in the reports collection
    result = await db.reports.insert_one(report_data)
    created_report = await db.reports.find_one({"_id": result.inserted_id})

    return created_report