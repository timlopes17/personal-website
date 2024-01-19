from flask import Flask, request, jsonify
from flask_cors import CORS
import pandas as pd
import joblib
from sklearn.metrics.pairwise import cosine_similarity
import numpy as np
import os


app = Flask(__name__)
CORS(app, resources={r"/api/*": {"origins": "http://localhost:3000"}})

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

if __name__ == '__main__':
    app.run(debug=True)