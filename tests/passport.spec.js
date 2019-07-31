import {
  describe, it,
} from 'mocha';
import { assert, expect } from 'chai';
import sinon from 'sinon';
import PassportSocialCallback from '../src/middlewares/passport/callback';
import { facebookProfileData, googleProfileData } from './mockData/authProfileData';

const accessToken = 'xxxxxqjad';
const refreshToken = 'xasdjkdahlasdsd';


describe('Passport Social Callback', () => {
  it('handles facebook authentication', () => {
    const done = sinon.spy();
    const { id: oauthId, _json } = facebookProfileData;
    const {
      last_name: lastName,
      first_name: firstName,
      picture: {
        data: {
          url: profileImage
        }
      }
    } = _json;

    PassportSocialCallback(accessToken, refreshToken, facebookProfileData, done);
    const user = {
      oauthId,
      type: 'facebook',
      lastName,
      firstName,
      profileImage,
    };
    assert(done.calledOnce);

    let callbackArgs = done.getCall(0).args;
    let returnedUser = callbackArgs[1];
    expect(callbackArgs[0]).to.equal(null);
    expect(returnedUser).deep.equal(user);

    facebookProfileData._json.picture.data.url = '';
    PassportSocialCallback(accessToken, refreshToken, facebookProfileData, done);
    callbackArgs = done.getCall(1).args;
    ([, returnedUser] = callbackArgs);

    assert(done.calledTwice);
    expect(returnedUser.profileImage).to.equal(undefined);
  });
});

describe('Google Social Callback', () => {
  it('handles google authentication', () => {
    const done = sinon.spy();
    const { id: oauthId, _json } = googleProfileData;
    const {
      given_name: firstName,
      family_name: lastName,
      picture: profileImage,
      email,
    } = _json;

    PassportSocialCallback(accessToken, refreshToken, googleProfileData, done);
    const user = {
      oauthId,
      type: 'google',
      lastName,
      firstName,
      email,
      profileImage,
    };

    assert(done.calledOnce);
    const callbackArgs = done.getCall(0).args;
    const returnedUser = callbackArgs[1];
    expect(callbackArgs[0]).to.equal(null);
    expect(returnedUser).deep.equal(user);
  });
});
