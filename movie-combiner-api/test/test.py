#https://image.tmdb.org/t/p/original/[poster_path]

import requests
from time import sleep
from schemas import Movies, Genres, MovieGenres, Keywords, MovieKeywords
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy.exc import IntegrityError
from sqlalchemy.orm import sessionmaker
from db_engine import engine
import asyncio
from sqlalchemy import text, select
import datetime

AsyncSessionLocal = sessionmaker(engine, class_=AsyncSession, expire_on_commit=False)

def get_top_movies_by_vote_count(api_key, total_movies=3000):
    movies = []
    base_url = "https://api.themoviedb.org/3/discover/movie"
    params = {
        "api_key": api_key,
        "sort_by": "popularity.desc",
        "with_original_language": "en",
        "page": 1
    }

    while len(movies) < total_movies:
        response = requests.get(base_url, params=params)
        data = response.json()
        movies.extend(data['results'])

        if 'total_pages' in data and params["page"] >= data['total_pages']:
            break  # Break if no more pages are available

        params["page"] += 1

    return movies[:total_movies]  # Return only the top 100 movies

async def get_movie_details(api_key, movies):
    async with AsyncSessionLocal() as session:
        params = {
            "api_key": api_key,
            "page": 1
        }

        for i, movie in enumerate(movies):
            print(i, movie['title'])
            try:
                url = f"https://api.themoviedb.org/3/movie/{movie['id']}?language=en-US"
                response = requests.get(url, params=params)
                sleep(0.1)
                data = response.json()
                if data['belongs_to_collection'] != None:
                    collection_id = data['belongs_to_collection']['id']
                else: 
                    collection_id = None

                release_date_val = datetime.datetime.strptime(movie['release_date'], '%Y-%m-%d').date() if movie['release_date'] else None

                new_movie = Movies(id=movie['id'], title=movie['title'], description=movie['overview'],
                                vote_avg=movie['vote_average'], release_date=release_date_val,
                                image=movie['poster_path'], popularity=movie['popularity'], 
                                vote_count=movie['vote_count'], collection_id=collection_id)
                session.add(new_movie)

                await session.commit()

                genre_ids = movie['genre_ids']
                for id in genre_ids:
                    movie_genre = MovieGenres(movie_id=movie['id'], genre_id=id)
                    session.add(movie_genre)
                
                url = f"https://api.themoviedb.org/3/movie/{movie['id']}/keywords"
                response = requests.get(url, params=params)
                sleep(0.1)
                data = response.json()
                keywords = data['keywords']

                for keyword in keywords:
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
                    movie_keyword_relation = MovieKeywords(movie_id=movie['id'], keyword_id=keyword_id)
                    session.add(movie_keyword_relation)

                await session.commit()
            except IntegrityError:  # Replace with the specific integrity error for your DBMS
                print(f"Duplicate entry for MovieID {movie['title']}. Skipping...")
                await session.rollback()
                continue
            except Exception as e:
                print(f"An error occurred: {e}")
                await session.rollback()
                # Handle or log other exceptions if necessary
            

# Use your TMDB API key here
api_key = "YOUR_API_KEY"
top_movies = get_top_movies_by_vote_count("261a8d0b37f551828aac844522452b89")
asyncio.run(get_movie_details("261a8d0b37f551828aac844522452b89", top_movies))