const configs = {
  firebaseConfig: import.meta.env.VITE_FIREBASE_CONFIG as string,
  giphyAPIKey: import.meta.env.VITE_GIPHY_API_KEY as string,
};

export default configs;
