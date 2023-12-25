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

from schemas import Movies, Actors, MovieActors, Crew, MovieCrew, Genres, MovieGenres, Keywords, MovieKeywords

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

async def post_movie():
    async with AsyncSessionLocal() as session:
        # Assuming `MyTable` is a mapped class
        release_date = date.fromisoformat('1999-01-01')
        new_movie = Movies(id=1, title="Test Title", description="Test description", vote_avg=7.5, release_date=release_date, image='test')
        session.add(new_movie)
        await session.commit()

async def clear_movies_table():
    async with AsyncSessionLocal() as session:
        await session.execute(text('DELETE FROM ' + Movies.__tablename__))
        await session.commit()

async def clear_cast_table():
    async with AsyncSessionLocal() as session:
        await session.execute(text('DELETE FROM ' + MovieActors.__tablename__))
        await session.execute(text('DELETE FROM ' + Actors.__tablename__))
        await session.commit()

async def populate_movies():
    async with AsyncSessionLocal() as session:
        with open("data\\tmdb_5000_movies.csv", newline='\n', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Handle empty values
                id_val = int(row['id']) if row['id'] else None
                title_val = row['title'] if row['title'] else None
                description_val = row['overview'] if row['overview'] else None
                vote_avg_val = float(row['vote_average']) if row['vote_average'] else None
                release_date_val = datetime.datetime.strptime(row['release_date'], '%Y-%m-%d').date() if row['release_date'] else None
                popularity = float(row['popularity']) if row['popularity'] else None

                movie = Movies(
                    id=id_val,
                    title=title_val,
                    description=description_val,
                    vote_avg=vote_avg_val,
                    release_date=release_date_val,
                    popularity=popularity
                )
                session.add(movie)
            
            await session.commit()
            await session.close()

async def populate_actors():
    async with AsyncSessionLocal() as session:
        with open("data\\tmdb_5000_credits.csv", newline='\n', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                movie_id = int(row['movie_id'])
                cast_data = json.loads(row['cast'])

                for index, cast_member in enumerate(cast_data[:5]):
                    # Process actor data
                    actor_id = cast_member['id']
                    actor_name = cast_member['name']
                    actor_gender = 'm' if cast_member['gender'] == 2 else 'f' if cast_member['gender'] == 1 else None

                    # Check if the actor already exists
                    exists = (await session.execute(
                        select(Actors.id).filter_by(id=actor_id)
                    )).scalar() is not None

                    if not exists:
                        actor = Actors(id=actor_id, name=actor_name, gender=actor_gender)
                        session.add(actor)

                    # Process movie-actor relationship data
                    character_name = cast_member['character']
                    importance = index
                    movie_actor = MovieActors(movie_id=movie_id, actor_id=actor_id, part=character_name, importance=importance)
                    try:
                        session.add(movie_actor)
                        await session.commit()
                    except IntegrityError:
                        await session.rollback()

                await session.commit()

async def populate_crew():
    async with AsyncSessionLocal() as session:
        with open("data\\tmdb_5000_credits.csv", newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                movie_id = int(row['movie_id'])
                crew_data = json.loads(row['crew'])

                for crew_member in crew_data:
                    if crew_member['job'] in ['Director', 'Producer']:
                        # Process crew member data
                        crew_id = crew_member['id']
                        crew_name = crew_member['name']
                        crew_gender = 'm' if crew_member['gender'] == 2 else 'f' if crew_member['gender'] == 1 else None
                        crew_job = crew_member['job']

                        # Check if the crew member already exists
                        exists = (await session.execute(
                            select(Crew.id).filter_by(id=crew_id)
                        )).scalar() is not None

                        if not exists:
                            crew = Crew(id=crew_id, name=crew_name, gender=crew_gender)
                            session.add(crew)

                        # Process movie-crew relationship data
                        movie_crew = MovieCrew(movie_id=movie_id, crew_id=crew_id, part=crew_job)
                        session.add(movie_crew)

                await session.commit()

async def populate_genres():
    async with AsyncSessionLocal() as session:
        with open("data\\tmdb_5000_movies.csv", newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                movie_id = int(row['id'])
                genres_data = json.loads(row['genres'])

                for genre in genres_data:
                    genre_id = genre['id']
                    genre_name = genre['name']

                    # Check if the genre already exists
                    exists = (await session.execute(
                        select(Genres.id).filter_by(id=genre_id)
                    )).scalar() is not None

                    if not exists:
                        new_genre = Genres(id=genre_id, name=genre_name)
                        session.add(new_genre)

                    # Insert the movie-genre relationship
                    movie_genre_relation = MovieGenres(movie_id=movie_id, genre_id=genre_id)
                    session.add(movie_genre_relation)

                await session.commit()

async def populate_keywords():
    async with AsyncSessionLocal() as session:
        with open("data\\tmdb_5000_movies.csv", newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                movie_id = int(row['id'])
                keywords_data = json.loads(row['keywords'])

                for keyword in keywords_data:
                    keyword_id = keyword['id']
                    keyword_name = keyword['name']

                    # Check if the keyword already exists in Keywords table
                    exists = (await session.execute(
                        select(Keywords.id).filter_by(id=keyword_id)
                    )).scalar() is not None

                    if not exists:
                        new_keyword = Keywords(id=keyword_id, name=keyword_name)
                        session.add(new_keyword)

                    # Insert the movie-keyword relationship into MovieKeywords
                    movie_keyword_relation = MovieKeywords(movie_id=movie_id, keyword_id=keyword_id)
                    session.add(movie_keyword_relation)

                await session.commit()

async def test_connection():
    async with AsyncSessionLocal() as session:
        result = await session.execute(select(Movies))
        movies = result.scalars().all()
        for movie in movies:
            print(movie.title)

#asyncio.run(clear_movies_table())
#asyncio.run(clear_cast_table())
#asyncio.run(populate_actors())
#asyncio.run(populate_crew())
#asyncio.run(populate_genres())
#asyncio.run(populate_keywords())
asyncio.run(test_connection())