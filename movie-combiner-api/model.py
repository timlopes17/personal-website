import nltk
from nltk.corpus import stopwords
from nltk.tokenize import word_tokenize
import pandas as pd
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.metrics.pairwise import cosine_similarity
from sklearn.preprocessing import StandardScaler
import string
import numpy as np
from scipy.sparse import hstack, csr_matrix
from sklearn.preprocessing import MinMaxScaler
import joblib

df = pd.read_csv('data/movie_data.csv')

nltk.download('punkt')
nltk.download('stopwords')

#--------------------Preprocess description--------------------
def preprocess_text(text):
    if not isinstance(text, str):
        return []

    # Tokenize the text into words
    tokens = word_tokenize(text)

    # Convert to lowercase
    tokens = [word.lower() for word in tokens]

    # Remove punctuation from each word
    table = str.maketrans('', '', string.punctuation)
    stripped = [word.translate(table) for word in tokens]

    # Remove remaining tokens that are not alphabetic
    words = [word for word in stripped if word.isalpha()]

    # Filter out stop words
    stop_words = set(stopwords.words('english'))
    words = [w for w in words if not w in stop_words]

    return words

df['processed_description'] = df['description'].apply(preprocess_text)

#--------------------Feature Extraction--------------------

# Initialize TF-IDF Vectorizer
tfidf_vectorizer_desc = TfidfVectorizer()
tfidf_vectorizer_genres = TfidfVectorizer()
tfidf_vectorizer_keywords = TfidfVectorizer()

# Apply TF-IDF to each text field
tfidf_matrix_desc = tfidf_vectorizer_desc.fit_transform(df['processed_description'].astype(str))
df['genres'] = df['genres'].fillna('')
df['keywords'] = df['keywords'].fillna('')
tfidf_matrix_genres = tfidf_vectorizer_genres.fit_transform(df['genres'])
tfidf_matrix_keywords = tfidf_vectorizer_keywords.fit_transform(df['keywords'])

#----------TESTING TFIDF-------------

def print_keywords_for_movie(movie_id, df, feature_names, tfidf_matrix):
    # Find the index of the movie
    movie_idx = df.index[df['movie_id'] == movie_id].tolist()
    if not movie_idx:
        print(f"Movie ID {movie_id} not found.")
        return
    movie_idx = movie_idx[0]

    # Iterate through each keyword and its TF-IDF score
    print(f"Keywords and their TF-IDF scores for movie ID {movie_id}:")
    for keyword_idx, score in enumerate(tfidf_matrix[movie_idx]):
        if score > 0:  # Optionally, filter out non-zero scores
            print(f"{feature_names[keyword_idx]}: {score}")

#-------------------------------

scaler = StandardScaler()
# Standardize 'vote_avg'
df['vote_avg_scaled'] = scaler.fit_transform(df[['vote_avg']])

# Standardize 'popularity'
df['popularity_scaled'] = scaler.fit_transform(df[['popularity']])

# Handling 'release_date'
# Convert 'release_date' to a numerical value like year or timestamp
df['release_date'] = pd.to_datetime(df['release_date'])
df['release_year'] = df['release_date'].dt.year
df['release_year_scaled'] = scaler.fit_transform(df[['release_year']])

vote_avg_scaled_sparse = csr_matrix(df['vote_avg_scaled'].values.reshape(-1, 1))
popularity_scaled_sparse = csr_matrix(df['popularity_scaled'].values.reshape(-1, 1))
release_year_scaled_sparse = csr_matrix(df['release_year_scaled'].values.reshape(-1, 1))

# Define your weights
weight_for_description = 4
weight_for_genres = 3
weight_for_keywords = 4
weight_for_vote_avg = 0.25
weight_for_popularity = 0.25
weight_for_release_year = 0.25

# Apply weights
weighted_tfidf_desc = tfidf_matrix_desc * weight_for_description
weighted_tfidf_genres = tfidf_matrix_genres * weight_for_genres
weighted_tfidf_keywords = tfidf_matrix_keywords * weight_for_keywords

# You might also want to apply weights to your scaled features
weighted_vote_avg = vote_avg_scaled_sparse * weight_for_vote_avg
weighted_popularity = popularity_scaled_sparse * weight_for_popularity
weighted_release_year = release_year_scaled_sparse * weight_for_release_year

# Concatenate all weighted features
final_features = hstack([weighted_tfidf_desc, 
                         weighted_tfidf_genres, 
                         weighted_tfidf_keywords, 
                         weighted_vote_avg, 
                         weighted_popularity, 
                         weighted_release_year])

joblib.dump(final_features, 'data/features.pkl')

def print_movie(movie_id):
    movie_row = df[df['movie_id'] == movie_id]

    # Check if a movie was found
    if not movie_row.empty:
        return movie_row.iloc[0]['title']
    else:
        return "Movie not found"

no_keywords_mask = df['keywords'].isna() | (df['keywords'] == '')

def recommend_movie(movie_id1, movie_id2, df, final_features, num_recommendations=5, penalty_factor=0.5):
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
        recommended_movies.append((df.iloc[idx]['movie_id'], df.iloc[idx]['title']))
        recommended_collections.add(current_movie_collection)

    return recommended_movies

# Example usage
id1 = 155
id2 = 166426
recommended_movies = recommend_movie(id1, id2, df, final_features, num_recommendations=5)

print(f"Movie Combiner for {print_movie(id1)} and {print_movie(id2)}:")
for movie_id, movie_title in recommended_movies:
    print(f"Combined Movie: {movie_title} (ID: {movie_id})")