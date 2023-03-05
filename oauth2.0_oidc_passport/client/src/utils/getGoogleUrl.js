export default (state) => {
  const scopes = ["openid", "profile", "email"];
  // add these query paramaters if you want to refresh the access token: &prompt=consent&access_type=offline
  
  return (
    `https://accounts.google.com/o/oauth2/v2/auth?response_type=code&client_id=${
      import.meta.env.VITE_GOOGLE_OAUTH_CLIENT_ID
    }&redirect_uri=${import.meta.env.VITE_GOOGLE_OAUTH_REDIRECT_URL}&scope=${scopes.join(" ")}&state=${state}`
  );
};
