from sqlalchemy.ext.asyncio import create_async_engine
from sqlalchemy.ext.declarative import declarative_base

conn_string = "postgresql+asyncpg://postgres:m0j07180@localhost:5432/movies"
engine = create_async_engine(conn_string)
Base = declarative_base()