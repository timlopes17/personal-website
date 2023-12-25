import pandas as pd
import numpy as np
import tensorflow as tf
from tensorflow.python.keras import layers
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.feature_extraction.text import TfidfVectorizer

# Read in the movie data
df_movies = pd.read_csv('movie_data.csv')

# Text Vectorization for Description and Keywords
df_movies['description'] = df_movies['description'].fillna('')
df_movies['keywords'] = df_movies['keywords'].fillna('')
df_movies['combined_text'] = df_movies['description'] + " " + df_movies['keywords']
df_movies['combined_text'] = df_movies['combined_text'].astype(str)
# Create a TF-IDF Vectorizer with min_df
vectorizer = TfidfVectorizer(max_features=10000, min_df=2)  # Set min_df as needed

# Combine your text data for TF-IDF
combined_text = df_movies['description'] + " " + df_movies['keywords']
combined_text = combined_text.fillna('')

# Fit and transform the vectorizer
tfidf_matrix = vectorizer.fit_transform(combined_text)

tfidf_dense_matrix = tfidf_matrix.toarray()

# Process Genres (Assuming genres are separated by commas)
df_movies['genres'] = df_movies['genres'].apply(lambda x: x.split(', ') if isinstance(x, str) else [])
all_genres = set(genre for sublist in df_movies['genres'] for genre in sublist)

# Create a lookup table
genre_lookup = tf.lookup.StaticVocabularyTable(
    tf.lookup.KeyValueTensorInitializer(
        keys=tf.constant(list(all_genres)),
        key_dtype=tf.string,
        values=tf.constant(range(len(all_genres)), dtype=tf.int64),  # Ensure this is int64
        value_dtype=tf.int64
    ),
    num_oov_buckets=1
)
def encode_genres(genres):
    # Initialize an empty array to store the encoded genres
    encoded_genres = np.zeros((len(all_genres) + 1,))  # +1 for the OOV bucket

    # Loop through each genre in the movie's genres list
    for genre in genres:
        # Lookup and one-hot encode the genre
        genre_index = genre_lookup.lookup(tf.constant([genre]))  # Lookup expects a batch of strings
        genre_encoded = tf.one_hot(genre_index, depth=len(all_genres) + 1).numpy()
        
        # Combine the encoding with previous encodings
        encoded_genres += genre_encoded[0]  # [0] to select the encoding from the batch

    return encoded_genres
df_movies['genres_encoded'] = df_movies['genres'].apply(encode_genres)

genres_encoded_array = np.array(df_movies['genres_encoded'].tolist())

# Combine Features
combined_features = np.concatenate([tfidf_dense_matrix, genres_encoded_array], axis=1)

# Recommendation Function
def get_movie_features(movie_id, df_movies, vectorizer):
    movie = df_movies[df_movies['movie_id'] == movie_id]
    combined_text = movie['description'].iloc[0] + " " + movie['keywords'].iloc[0]
    tfidf_features = vectorizer.transform([combined_text]).toarray()  # Use transform here
    genre_features = movie['genres_encoded'].iloc[0]
    return np.concatenate([tfidf_features[0], genre_features])

def recommend_movie(movie1_id, movie2_id, df_movies, vectorizer):
    features_movie1 = get_movie_features(movie1_id, df_movies, vectorizer)
    features_movie2 = get_movie_features(movie2_id, df_movies, vectorizer)
    combined_features = (features_movie1 + features_movie2) / 2

    # Calculate similarities
    similarities = []
    for index, row in df_movies.iterrows():
        movie_features = get_movie_features(row['movie_id'], df_movies, vectorizer)
        similarity = cosine_similarity([combined_features], [movie_features])
        similarities.append((row['movie_id'], similarity[0][0]))

    # Sort and find the top movie
    sorted_movies = sorted(similarities, key=lambda x: x[1], reverse=True)
    top_movie = next((movie for movie in sorted_movies if movie[0] not in [movie1_id, movie2_id]), None)
    return top_movie[0] if top_movie else None

# Example Usage
recommended_movie_id = recommend_movie(10054, 1584, df_movies, vectorizer)
print(f"Recommended Movie ID: {recommended_movie_id}")