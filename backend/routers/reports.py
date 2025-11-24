from fastapi import APIRouter, Depends
from auth import get_current_user
from models.user import User

router = APIRouter()

@router.get("/")
async def get_reports(current_user: User = Depends(get_current_user)):
    # Placeholder for reports data
    return [{"id": 1, "title": "Report 1"}, {"id": 2, "title": "Report 2"}]

@router.get("/{report_id}")
async def get_report(report_id: int, current_user: User = Depends(get_current_user)):
    # Placeholder for a single report data
    return {"id": report_id, "title": f"Report {report_id}"}