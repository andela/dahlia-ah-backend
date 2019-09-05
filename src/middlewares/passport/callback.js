const callback = (accessToken, refreshToken, profile, done) => {
  const { id, provider } = profile;
  const { picture } = profile._json;
  const user = { oauthId: id, type: provider };

  if (provider === 'google') {
    const { family_name: lastName, given_name: firstName, email } = profile._json;
    user.lastName = lastName;
    user.firstName = firstName;
    user.email = email;

    if (picture && picture.trim() !== '') {
      user.profileImage = picture.trim();
    }
  } else if (provider === 'facebook') {
    const { last_name: lastName, first_name: firstName } = profile._json;
    user.lastName = lastName;
    user.firstName = firstName;

    const photo = picture && picture.data && picture.data.url;

    if (photo && photo.trim() !== '') {
      user.profileImage = photo.trim();
    }
  }
  return done(null, user);
};

export default callback;
