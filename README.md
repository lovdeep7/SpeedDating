# SpeedDating
Find your Valentine this year by building a PubNub ChatEngine powered speed dating app. 

Tutorial: https://medium.com/@lovdeepsingh/how-to-find-your-love-through-pubnub-chatengine-%EF%B8%8F-5847e9a16a8b

## Background 
As Valentine's Day is just around the corner, what better way is to spend it alone and building a fun Speed Dating app through using PubNub's SDK? SpeedDating is built behind the idea that current dating apps incorrectly focus on matchmaking through static images - SpeedDating frontloads the messaging experience. It uses a powerful chat engine by PubNub to create a dating experience where you have five minutes to speak to the person you are matched with. While this app focusses on the chatting and speed dating experience, this app can be expanded to allow for matchmaking after the five minutes, incorporating a sophisticated map system and image-based profiles. 

## How it Works
The backend of this app is a simple node.js service running on an Express server. Due to PubNub's powerful realtime data-streaming capabilities, it eliminates the need for a complicated back-end. The client-facing chat is created through PubNub's next generation chat library, `ChatEngine`, through the use of `rooms` that a maximum of two `Users` may connect to. After the app connects two users to the same user through some simple logic matching age and gender, the users send messages using `emit` message events and PubNub messages that the users subscribe and publish to. This works beautifully with ChatEngine's `on` method that is able to run logic through a promise when the event is triggered (or emitted). After 5 minutes, or when a user disconnects, the users are disconnected from the ChatEngine chatroom and they have the opportunity to chat with their next match. 

## Demo
https://pubnubdate.herokuapp.com/

![SpeedDatingGif](https://media.giphy.com/media/31X5ZwTiPW4hQWuBn5/giphy.gif)

## Installation
Prerequisities: 
```
node.js
```

Install node_modules: 
```
npm i
```

Start service:
```
npm start
```




