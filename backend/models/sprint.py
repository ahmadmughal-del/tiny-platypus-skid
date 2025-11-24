from pydantic import BaseModel, Field, ConfigDict
from pydantic.functional_validators import BeforeValidator
from typing import Optional, List, Annotated
from datetime import datetime
from bson import ObjectId

# Represents an ObjectId field in the database.
# It will be represented as a `str` on the model so that it can be serialized to JSON.
PyObjectId = Annotated[str, BeforeValidator(str)]

class Sprint(BaseModel):
    # The primary key for the Sprint model
    id: Optional[PyObjectId] = Field(alias="_id", default=None)
    user_id: str
    status: str
    content: str
    history: Optional[List[str]] = []
    created_at: datetime = Field(default_factory=datetime.utcnow)
    updated_at: datetime = Field(default_factory=datetime.utcnow)

    model_config = ConfigDict(
        populate_by_name=True,
        arbitrary_types_allowed=True,
        json_schema_extra={
            "example": {
                "user_id": "user123",
                "status": "in_progress",
                "content": "This is the sprint content.",
                "history": ["Initial content."],
            }
        },
    )
