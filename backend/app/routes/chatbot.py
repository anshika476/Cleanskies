from fastapi import APIRouter, HTTPException
from app.schemas import ChatQuery, ChatResponse # Assuming your schemas are here
from chatbotbackend import handle_user_question # Import your core logic

# Initialize the router
router = APIRouter(
    prefix="/chat",
    tags=["Chatbot"],
)

@router.post("/", response_model=ChatResponse)
async def ask_chatbot(query: ChatQuery):
    """
    Accepts a user question and optional context (ZIP, health, activity),
    and returns a generated air quality response.
    """
    try:
        # Note: handle_user_question only returns 'answer' in your provided code,
        # so we'll modify it slightly or make an assumption.
        # For now, let's assume we can get the active_zip from the query or a placeholder.
        
        # Determine the active ZIP code (replicate logic from handle_user_question for clarity)
        active_zip = query.zip_code or "94103" # Fallback, should ideally be determined within the handler

        answer = handle_user_question(
            user_id="web_user", # Placeholder user_id since it's not used in your logic
            question=query.question,
            zip_code=query.zip_code,
            health_issue=query.health_issue,
            activity=query.activity,
            user_profile={"zip_code": active_zip} # Pass active_zip as a default if needed
        )

        return ChatResponse(
            answer=answer,
            active_zip=active_zip # This is a simplification; a better approach is in the notes below
        )

    except Exception as e:
        # Log the error for debugging
        print(f"Chatbot processing error: {e}")
        raise HTTPException(
            status_code=500,
            detail=f"An error occurred while processing the request: {e}"
        )

# NOTE: The handle_user_question function in chatbotbackend.py needs a minor
# modification to return the 'active_zip' it used, for a perfect API response.
# Currently, it only returns 'answer'.