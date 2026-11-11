"""
Convenience script to run the MINT FastAPI server.
"""
import uvicorn
import os
from dotenv import load_dotenv

if __name__ == "__main__":
    load_dotenv()
    port = int(os.getenv("PORT", 8000))
    host = os.getenv("HOST", "0.0.0.0")
    print(f"Starting MINT FastAPI Server on http://{host}:{port}")
    uvicorn.run("app.main:app", host=host, port=port, reload=True)
