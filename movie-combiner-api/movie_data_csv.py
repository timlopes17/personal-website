from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker
from sqlalchemy import text, select
from db_engine import engine
import asyncio
from datetime import date
import datetime
import csv
import json
import pandas as pd

from schemas import Movies, Actors, MovieActors, Crew, MovieCrew, Genres, MovieGenres, Keywords, MovieKeywords

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def fetch_basic_movie_data():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Movies))
        movies_data = result.scalars().all()
        movies_list = [(movie.id, movie.title, movie.description, movie.release_date, movie.vote_avg) for movie in movies_data]
        # Create a DataFrame from the list of tuples
        df_movies = pd.DataFrame(movies_list, columns=['movie_id', 'title', 'description', 'release_date', 'vote_avg'])
        return df_movies
    
async def fetch_movie_genres(movie_id):
    async with AsyncSessionLocal() as session:
        stmt = select(Genres).join(MovieGenres, Genres.id == MovieGenres.genre_id).where(MovieGenres.movie_id == movie_id)
        result = await session.execute(stmt)
        genres = result.scalars().all()
        return [genre.name for genre in genres]

async def fetch_movie_keywords(movie_id):
    async with AsyncSessionLocal() as session:
        stmt = select(Keywords).join(MovieKeywords, Keywords.id == MovieKeywords.keyword_id).where(MovieKeywords.movie_id == movie_id)
        result = await session.execute(stmt)
        keywords = result.scalars().all()
        return [keyword.name for keyword in keywords]

async def fetch_movie_actors(movie_id):
    async with AsyncSessionLocal() as session:
        # Adjust the statement to also select the 'part' and 'importance' from MovieActors
        stmt = (
            select(Actors, MovieActors.part, MovieActors.importance)
            .join(MovieActors, Actors.id == MovieActors.actor_id)
            .where(MovieActors.movie_id == movie_id)
        )
        result = await session.execute(stmt)
        actors_data = result.all()  # Fetch all results

        # Create a list of strings with actor's name, their part, and importance
        actors_info = [
            f"{actor_data[0].name} | {actor_data[1]} | {actor_data[2]}"
            for actor_data in actors_data
        ]
        return actors_info
    
async def fetch_movie_crew(movie_id):
    async with AsyncSessionLocal() as session:
        # Adjust the statement to also select the 'part' from MovieCrew
        stmt = (
            select(Crew, MovieCrew.part)
            .join(MovieCrew, Crew.id == MovieCrew.crew_id)
            .where(MovieCrew.movie_id == movie_id)
        )
        result = await session.execute(stmt)
        crew_data = result.all()  # Fetch all results

        # Create a list of dictionaries with crew member's name and their part
        crew_members = [f"{crew_member.Crew.name} | {crew_member.part}" for crew_member in crew_data]
        return crew_members

async def aggregate_movie_data():
    df_movies = await fetch_basic_movie_data()
    for index, row in df_movies.iterrows():
        movie_id = row['movie_id']

        # Fetch and aggregate genres
        genres = await fetch_movie_genres(movie_id)
        df_movies.at[index, 'genres'] = ', '.join(genres)

        # Fetch and aggregate actors
        actors = await fetch_movie_actors(movie_id)
        df_movies.at[index, 'actors'] = ', '.join(actors)

        # Fetch and aggregate crew
        crew = await fetch_movie_crew(movie_id)
        # Convert each dictionary to a string and then join them
        df_movies.at[index, 'crew'] = ', '.join(crew)

        # Fetch and aggregate keywords
        keywords = await fetch_movie_keywords(movie_id)
        df_movies.at[index, 'keywords'] = ', '.join(keywords)

    return df_movies

movies_df = asyncio.run(aggregate_movie_data())
movies_df.to_csv('movie_data.csv', index=False)