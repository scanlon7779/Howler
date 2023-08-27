import HTTPClient from "./HTTPClient.js";

const API_BASE = '/api';

export default {
  getUsers: () => {
    return HTTPClient.get(API_BASE+'/users')
  },

  getUserByUsername: (username) => {
    return HTTPClient.get(API_BASE + "/users/" + username);
  }, 
  
  getHowlsFollowedByUserId: (id) => {
    return HTTPClient.get(API_BASE+`/howls/following/${id}`);
  },

  getHowlsByUserId: (id) => {
    return HTTPClient.get(API_BASE+`/howls/${id}`);
  },

  getUserById: (id) => {
    return HTTPClient.get(API_BASE+`/users/id/${id}`);
  },

  getCurrentUser: () => {
    return HTTPClient.get(API_BASE+'/users/currentUser');
  },

  logIn: (username, password) => {
    let data = {
      username: username,
      password: password
    }
    return HTTPClient.post(API_BASE+'/users/login', data);
  },

  howl: (userId, datetime, text) => {
    let data = {
      userId: userId,
      datetime, datetime,
      text: text
    }
    return HTTPClient.put(API_BASE+'/howls', data);
  },

  logOut: () => {
    return HTTPClient.post(API_BASE+'/users/logout', {});
  },

  follow: (userId, followId) => {
    return HTTPClient.put(API_BASE + `/users/${userId}/following/${followId}`);
  },

  unfollow: (userId, followId) => {
    return HTTPClient.delete(API_BASE + `/users/${userId}/following/${followId}`);
  },

  getFollowing: (userId) => {
    return HTTPClient.get(API_BASE + '/following/'+ userId);
  }
};
