from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os
import openai
from dotenv import load_dotenv
import json


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

load_dotenv()
openai_api_key = os.getenv('OPENAI_API_KEY')

print("API Key:", openai_api_key)

openai.api_key = openai_api_key

script_dir = os.path.dirname(os.path.abspath(__file__))
features_path = os.path.join(script_dir, 'data', 'features.pkl')
final_features = joblib.load(features_path)
csv_path = os.path.join(script_dir, 'data', 'movie_data_api.csv')
df = pd.read_csv(csv_path)
no_keywords_mask = df['keywords'].isna() | (df['keywords'] == '')

def recommend_movie(movie_id1, movie_id2, df, final_features, num_recommendations=3, penalty_factor=0.5):
    # Indices of the movies
    idx1 = df.index[df['movie_id'] == movie_id1].tolist()[0]
    idx2 = df.index[df['movie_id'] == movie_id2].tolist()[0]

    # Collections and indices of the input movies
    input_collections = set(df.loc[[idx1, idx2], 'collection_id'].values)
    input_indices = {idx1, idx2}
    recommended_collections = set()

    # Average the features of the two movies
    avg_feature = (final_features[idx1] + final_features[idx2]) / 2

    # Compute similarity
    sim_scores = cosine_similarity(final_features, avg_feature).flatten()

    # Apply a penalty to movies with no keywords
    sim_scores[no_keywords_mask] *= penalty_factor

    # Get movie indices sorted by similarity score
    sorted_indices = np.argsort(sim_scores)[::-1]

    recommended_movies = []
    for idx in sorted_indices:
        if len(recommended_movies) >= num_recommendations:
            break

        current_movie_collection = df.iloc[idx]['collection_id']
        
        # Skip if the movie is from an excluded collection or is one of the input movies
        if current_movie_collection in input_collections or idx in input_indices:
            continue

        # Skip if the movie's collection has already been recommended
        if current_movie_collection in recommended_collections:
            continue

        # Add movie to recommendations and update collections
        recommended_movies.append(df.iloc[idx]['movie_id'])
        recommended_collections.add(current_movie_collection)

    return recommended_movies

@app.route('/api/recommend', methods=['POST'])
def recommend():
    data = request.json
    print(data)
    movie_id1 = data['movie_id1']
    movie_id2 = data['movie_id2']
    recommendations_ids = recommend_movie(movie_id1, movie_id2, df, final_features, num_recommendations=3)
    df_clean = df.fillna("N/A")
    recommendations = df_clean[df_clean['movie_id'].isin(recommendations_ids)].to_dict(orient='records')
    print(recommendations)
    return jsonify(recommendations)

@app.route('/api/movies', methods=['GET'])
def movies():
    # Selecting required columns
    movies_df = df[['movie_id', 'title', 'release_date', 'vote_avg', 'image']]

    # Replace NaN values with None (which will become 'null' in JSON)
    movies_df = movies_df.where(pd.notnull(movies_df), None)

    # Convert DataFrame to a list of dictionaries for JSON serialization
    movies_list = movies_df.to_dict(orient='records')

    return jsonify(movies_list)

@app.route('/api/gpt_movie', methods=['POST'])
def gpt_movie():
    data = request.json
    print(data)
    movie_id1 = data['movie_id1']
    movie_id2 = data['movie_id2']

    movie1 = df[df['movie_id'] == movie_id1][['title', 'description']]
    movie2 = df[df['movie_id'] == movie_id2][['title', 'description']]
    mov1Title = movie1.iloc[0]['title']
    mov1Desc = movie1.iloc[0]['description']
    mov2Title = movie2.iloc[0]['title']
    mov2Desc = movie2.iloc[0]['description']

    response = openai.chat.completions.create(
        model="gpt-3.5-turbo-1106",
        response_format={ "type": "json_object" },
        messages=[
            {"role": "system", "content": "You are a helpful assistant designed to output JSON. I will give you two movie titles and descriptions. You are in charge of creating a new movie that combines aspects from both of these movies into one, a brand new movie not as if they're universes combined. I want you to return a JSON structure response like this {'title': '<New Movie Title>', 'description': '<New Movie Description>' }" },
            {"role": "user", "content": "Movie 1 is Toy Story which is about Led by Woody, Andy's toys live happily in his room until Andy's birthday brings Buzz Lightyear onto the scene. Afraid of losing his place in Andy's heart, Woody plots against Buzz. But when circumstances separate Buzz and Woody from their owner, the duo eventually learns to put aside their differences. Movie 2 is Monsters, Inc. which is about Lovable Sulley and his wisecracking sidekick Mike Wazowski are the top scare team at Monsters, Inc., the scream-processing factory in Monstropolis. When a little girl named Boo wanders into their world, it's the monsters who are scared silly, and it's up to Sulley and Mike to keep her out of sight and get her back home."},
            {"role": "assistant", "content": "{'title': 'Whispers in the Attic', 'description': 'Toys and closet monsters join forces in a whimsical adventure to transform a child's fears into a world of laughter and imagination.'}"},
            {"role": "user", "content": f"Movie 1 is {mov1Title} which is about {mov1Desc}. Movie 2 is {mov2Title} which is about {mov2Desc}."}
        ]
    )

    json_string = response.choices[0].message.content
    data = json.loads(json_string)
    print("JSON:", data)

    response = openai.images.generate(
        model="dall-e-3",
        prompt=f"A movie poster for a movie called {data['title']} which is about: {data['description']}.",
        size="1024x1024",
        quality="standard",
        n=1,
    )

    image_url = response.data[0].url

    return {'imageUrl': image_url, 'title': data['title'], 'description': data['description']}

if __name__ == '__main__':
    app.run(debug=True)