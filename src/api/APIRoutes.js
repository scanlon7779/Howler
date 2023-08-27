const express = require('express');
const apiRouter = express.Router();

let users = require('../data/users.json');
let howls = require('../data/howls.json');
let follows = require('../data/follows.json');

apiRouter.use(express.json());

apiRouter.get('/users', (req,  res) => {
    res.json(users);
});

apiRouter.post('/users/logout', (req, res) => {
    const { username, password } = req.body;
  
    let user = users.find(user => user.username == username);
    if(user) {
        res.json(user);
    }
    else {
        res.status(404).json({error: 'User not found'});
    }
});

apiRouter.post('/users/login', (req, res) => {
    const { username, password } = req.body;
  
    let user = users.find(user => user.username == username);
    if(user) {
        res.json(user);
    }
    else {
        res.status(404).json({error: 'User not found'});
    }
});

apiRouter.get('/users/:username', (req,  res) => {
    const username = req.params.username;
    let user = users.find(user => user.username == username);
    if(user) {
        res.json(user);
    }
    else {
        res.status(404).json({error: 'User not found'});
        console.log("error");
    }
});

apiRouter.get('/users/currentUser', (req, res) => {
    const userId = req.params.userId;
    let user = users.find(user => user.id == userId);
    if(user) {
      res.json(user);
    }
    else {
      res.status(404).json({error: 'User not found'});
    }
});

apiRouter.put('/howls', (req,  res) => {
    let newHowl = req.body;
    newHowl.id = howls.length + 1;
    howls.push(newHowl);
    res.json(newHowl);
});

apiRouter.get('/howls/:userId', (req, res) => {
    const userId = req.params.userId;
    let userHowls = howls.filter(howl => howl.userId == userId);
    res.json(userHowls);
});

apiRouter.get('/howls/following/:userId', (req, res) => {
    const userId = req.params.userId;
    let userFollows = follows[userId].following;
    const userFollowsHowls = howls.filter((howl) => userFollows.includes(howl.userId));
    res.json(userFollowsHowls);
});

apiRouter.put('/users/:userId/following/:followingId', (req, res) => {
    const userId = req.params.userId;
    const followingId = parseInt(req.params.followingId);
    if (!users[userId] || !users[followingId]) {
      return res.status(404).json({ error: 'User or following user not found' });
    }
  
    if (follows[userId]) {
      if (follows[userId].following.includes(followingId)) {
        return res.status(400).json({ error: 'User is already following the following user' });
      } else {
        follows[userId].following.push(followingId);
      }
    } else {
      follows[userId] = { userId, following: [followingId] };
    }
  
    res.status(200);
    res.json('success');
  });
  

apiRouter.get('/users/id/:userId', (req, res) => {
    const userId = req.params.userId;
    let user = users.find(user => user.id == userId);
    if(user) {
      res.json(user);
    }
    else {
      res.status(404).json({error: 'User not found'});
    }
});

apiRouter.get('/following/:userId', (req, res) => {
    const userId = req.params.userId;
    const userFollows = follows[userId].following;
    res.json(userFollows);
});

apiRouter.delete('/users/:userId/following/:followingId', (req, res) => {
    const followingId = parseInt(req.params.followingId);
    const userId = req.params.userId;
  
    if (!users[userId]) {
        return res.status(404).json({ error: 'User not found' });
      }
    
      const followingIndex = follows[userId].following.indexOf(followingId);
      if (followingIndex === -1) {
        return res.status(400).json({ error: 'User is not following the given user' });
      }
    
      follows[userId].following.splice(followingIndex, 1);
    
      res.status(200).json({ message: 'Follower removed successfully' });
  });

module.exports = apiRouter;