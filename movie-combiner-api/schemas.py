from sqlalchemy import Column, Integer, String, create_engine, Float, Date
from sqlalchemy.orm import sessionmaker, mapped_column
from db_engine import engine, Base



# Define a sample model (table)
class Movies(Base):
    __tablename__ = 'movies'

    id = mapped_column(Integer, primary_key=True)
    title = mapped_column(String)
    description = mapped_column(String)
    vote_avg = mapped_column(Float)
    release_date = mapped_column(Date)
    image = mapped_column(String)
    popularity = mapped_column(Float)

class Actors(Base):
    __tablename__ = 'actors'

    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String)
    gender = mapped_column(String)

class MovieActors(Base):
    __tablename__ = 'movieactors'

    movie_id = mapped_column(Integer, primary_key=True)
    actor_id = mapped_column(Integer, primary_key=True)
    part = mapped_column(String)
    importance = mapped_column(Integer)

class Crew(Base):
    __tablename__ = 'crew'
    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String)
    gender = mapped_column(String) 

class MovieCrew(Base):
    __tablename__ = 'moviecrew'
    movie_id = mapped_column(Integer, primary_key=True)
    crew_id = mapped_column(Integer, primary_key=True)
    part = mapped_column(String, primary_key=True)

class Genres(Base):
    __tablename__ = 'genres'
    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String)

class MovieGenres(Base):
    __tablename__ = 'moviegenres'
    movie_id = mapped_column(Integer, primary_key=True)
    genre_id = mapped_column(Integer, primary_key=True)

class Keywords(Base):
    __tablename__ = 'keywords'
    id = mapped_column(Integer, primary_key=True)
    name = mapped_column(String)

class MovieKeywords(Base):
    __tablename__ = 'moviekeywords'
    movie_id = mapped_column(Integer, primary_key=True)
    keyword_id = mapped_column(Integer, primary_key=True)