from fastapi import FastAPI
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse
import os

from app.database import Base, engine
from app import router

Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="Kraftwerte",
)

app.mount("/static", StaticFiles(directory="static"), name="static")


@app.get("/", response_class=FileResponse)
async def read_root_frontend():
    return FileResponse(os.path.join("static", "index.html"))


app.include_router(router.router)
