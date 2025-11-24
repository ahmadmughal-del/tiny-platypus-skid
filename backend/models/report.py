from pydantic import BaseModel, Field, ConfigDict
from pydantic.functional_validators import BeforeValidator
from typing import Optional, Annotated
from datetime import datetime

# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]

class Report(BaseModel):
    # The primary key for the Report model
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    sprint_id: str
    title: str
    summary: str
    full_content: str
    created_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "user_id": "user123",
                "sprint_id": "sprint123",
                "title": "Sprint Report",
                "summary": "This is a summary of the sprint.",
                "full_content": "This is the full content of the sprint report.",
            }
        },
    )