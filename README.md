# SignifyPlus Backend

## Overview
SignifyPlus Backend is built using **Node.js** and **Express.js**, with **MongoDB** as the database. The application includes WebSocket management and routing for user and home endpoints.

---

## Features
- REST API for user and home functionalities.
- WebSocket management for real-time communication.
- MongoDB integration for database operations.

---

## Prerequisites

Before setting up the project, ensure you have the following installed:

- [Node.js](https://nodejs.org/) (v14 or later recommended)
- [MongoDB](https://www.mongodb.com/) (local or Atlas instance)
- [npm](https://www.npmjs.com/) (bundled with Node.js)

---

## Installation Guide

### 1. Clone the Repository
```bash
git clone https://github.com/YunoGasasi9862/signify-plus.git
cd signify-plus
cd backend
```

### 2. Install Dependencies
Install all required Node.js packages using the `package.json` file:
```bash
npm install
```

### 3. Set Up Environment Variables
Create a `.env` file in the root of the project and add the following:

```env
MONGO_DB_URL=<Your MongoDB Connection String>
PORT=3000
```
- Replace `<Your MongoDB Connection String>` with your MongoDB URI.
- `PORT` is the port number where the application will run.

### 4. Firebase Integration (Optional)
If connecting the MongoDB URI from Firebase, ensure the Firebase SDK is configured and the URI is retrieved dynamically.

### 5. Run the Application
Start the server:
```bash
node server/server.js
```

---

## Project Structure

```plaintext
signify-plus/backend/
├── managers/
│   └── websocketManager.js
├── routes/
│   ├── HomeRoute.js
│   └── UserRoutes.js
├── utilities/
│   └── encrypt.js
├── server/
│   └── server.js
├── .env
├── package.json
└── README.md
```

- **managers/**: WebSocket management.
- **routes/**: API route handlers for users and home.
- **utilities/**: Utility functions like encryption.
- **server/**: Entry point for starting the server.

---

## Usage

### API Endpoints
- **User Routes**: `/users`
- **Home Routes**: `/`

### WebSocket Management
WebSocketManager is initialized after the server starts. Extend its functionality by editing `managers/websocketManager.js`.

---

## Troubleshooting

### MongoDB Connection Error
If you encounter a MongoDB connection error:
1. Verify the `MONGO_DB_URL` in your `.env` file.
2. Check your network access and credentials for MongoDB Atlas or local instance.
3. Ensure MongoDB is running if using a local instance.

### Port Already in Use
If the specified port is in use, modify the `PORT` value in the `.env` file to a different number.

---

## Future Enhancements
- Add detailed API documentation (e.g., using Swagger).
- Enhance WebSocketManager with more real-time event handling.
- Implement Firebase dynamic configuration for MongoDB URI.

---

## License
This project is licensed under the MIT License.


# SignifyPlus Frontend

# VideoSDK for Expo React Native

[![Documentation](https://img.shields.io/badge/Read-Documentation-blue)](https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/getting-started)
[![Discord](https://img.shields.io/discord/876774498798551130?label=Join%20on%20Discord)](https://discord.gg/kgAvyxtTxv)
[![Register](https://img.shields.io/badge/Contact-Know%20More-blue)](https://app.videosdk.live/signup)

At Video SDK, we’re building tools to help companies create world-class collaborative products with capabilities of live audio/videos, compose cloud recordings/rtmp/hls and interaction APIs

<br/>

## Setup Guide

- Sign up on [VideoSDK](https://app.videosdk.live/) and visit [API Keys](https://app.videosdk.live/api-keys) section to get your API key and Secret key.

- Get familiarized with [Authentication and tokens](https://docs.videosdk.live/react/guide/video-and-audio-calling-api-sdk/authentication-and-token)

<br/>

### Prerequisites

- Node.js v12+
- NPM v6+ (comes installed with newer Node versions)
- Android Studio or Xcode installed
- Expo Setup
- Valid [Video SDK Account](https://app.videosdk.live/signup)

## Run the Sample App

### Step 1: Clone the sample project

Clone the repository to your local environment.

```js
git clone https://github.com/videosdk-live/quickstart.git
cd quickstart/expo-react-native-rtc
```

### Step 2: Update the `api.js` file.

Update the `api.js` file with your Authentication Token generated from [VideoSDK Dashboard](https://app.videosdk.live/api-keys).

### Step 3: Install the dependecies

Install all the dependecies to run the project.

```js
npm install
```

### Step 4: Run the App

Bingo, it's time to push the launch button.

```js
npx expo run:android // run for android

npx expo run:ios // run for android
```

<br/>

## Key Concepts

- `Meeting` - A Meeting represents Real time audio and video communication.

  **`Note : Don't confuse with Room and Meeting keyword, both are same thing 😃`**

- `Sessions` - A particular duration you spend in a given meeting is a referred as session, you can have multiple session of a particular meetingId.
- `Participant` - Participant represents someone who is attending the meeting's session, `local partcipant` represents self (You), for this self, other participants are `remote participants`.
- `Stream` - Stream means video or audio media content that is either published by `local participant` or `remote participants`.

<br/>

## Token Generation

Token is used to create and validate a meeting using API and also initialise a meeting.

🛠️ `Development Environment`:

- You may use a temporary token for development. To create a temporary token, go to VideoSDK [dashboard](https://app.videosdk.live/api-keys) .

🌐 `Production Environment`:

- You must set up an authentication server to authorise users for production. To set up an authentication server, refer to our official example repositories. [videosdk-rtc-api-server-examples](https://github.com/videosdk-live/videosdk-rtc-api-server-examples)

<br/>

## API: Create and Validate meeting

- `create meeting` - Please refer this [documentation](https://docs.videosdk.live/api-reference/realtime-communication/create-room) to create meeting.
- `validate meeting`- Please refer this [documentation](https://docs.videosdk.live/api-reference/realtime-communication/validate-room) to validate the meetingId.

<br/>

## [Initialize a Meeting](https://docs.videosdk.live/react-native/api/sdk-reference/meeting-provider)

- You can initialize the meeting using `MeetingProvider`. Meeting Provider simplifies configuration of meeting with by wrapping up core logic with `react-context`.

```js
<MeetingProvider
  config={{
    meetingId: "meeting-id",
    micEnabled: true,
    webcamEnabled: true,
    name: "Participant Name",
  }}
  token={"token"}
></MeetingProvider>
```

<br/>

## [Enable/Disable Local Webcam](https://docs.videosdk.live/react-native/guide/video-and-audio-calling-api-sdk/handling-media/on-off-camera)

```js
const { toggleWebcam } = useMeeting();

const onPress = () => {
  // Enable/Disable Webcam in Meeting
  toggleWebcam();
};
```

<br/>

## [Mute/Unmute Local Audio](https://docs.videosdk.live/react-native/guide/video-and-audio-calling-api-sdk/handling-media/mute-unmute-mic)

```js
const { toggleMic } = useMeeting();

const onPress = () => {
  // Enable/Disable Mic in Meeting
  toggleMic();
};
```

<br/>

## [Leave or End Meeting](https://docs.videosdk.live/react-native/guide/video-and-audio-calling-api-sdk/setup-call/leave-end-meeting)

```js
const { leave, end } = useMeeting();

const onPress = () => {
  // Leave Meeting
  leave();

  //End Meeting
  end();
};
```

<br/>

## [Meeting Event callbacks](https://docs.videosdk.live/react-native/api/sdk-reference/use-meeting/events)

By registering callback handlers, VideoSDK sends callbacks to the client app whenever there is a change or update in the meeting after a user joins.

```js
function onMeetingJoined() {
  // This event will be emitted when a localParticipant(you) successfully joined the meeting.
  console.log("onMeetingJoined");
}
function onMeetingLeft() {
  // This event will be emitted when a localParticipant(you) left the meeting.
  console.log("onMeetingLeft");
}

const { meetingId, meeting, localParticipant } = useMeeting({
  onMeetingJoined,
  onMeetingLeft,
});
```

<br/>

If you want to learn more about the SDK, read the Complete Documentation of [React Native VideoSDK](https://docs.videosdk.live/react-native/api/sdk-reference/setup)

<br/>

## Examples

### Examples for Conference

- [videosdk-rtc-prebuilt-examples](https://github.com/videosdk-live/videosdk-rtc-prebuilt-examples)
- [videosdk-rtc-javascript-sdk-example](https://github.com/videosdk-live/videosdk-rtc-javascript-sdk-example)
- [videosdk-rtc-react-sdk-examplee](https://github.com/videosdk-live/videosdk-rtc-react-sdk-example)
- [videosdk-rtc-react-native-sdk-example](https://github.com/videosdk-live/videosdk-rtc-react-native-sdk-example)
- [videosdk-rtc-flutter-sdk-example](https://github.com/videosdk-live/videosdk-rtc-flutter-sdk-example)
- [videosdk-rtc-android-java-sdk-example](https://github.com/videosdk-live/videosdk-rtc-android-java-sdk-example)
- [videosdk-rtc-android-kotlin-sdk-example](https://github.com/videosdk-live/videosdk-rtc-android-kotlin-sdk-example)
- [videosdk-rtc-ios-sdk-example](https://github.com/videosdk-live/videosdk-rtc-ios-sdk-example)

### Examples for Live Streaming

- [videosdk-hls-react-sdk-example](https://github.com/videosdk-live/videosdk-hls-react-sdk-example)
- [videosdk-hls-react-native-sdk-example](https://github.com/videosdk-live/videosdk-hls-react-native-sdk-example)
- [videosdk-hls-flutter-sdk-example](https://github.com/videosdk-live/videosdk-hls-flutter-sdk-example)
- [videosdk-hls-android-java-example](https://github.com/videosdk-live/videosdk-hls-android-java-example)
- [videosdk-hls-android-kotlin-example](https://github.com/videosdk-live/videosdk-hls-android-kotlin-example)

## Documentation

[Read the documentation](https://docs.videosdk.live/) to start using VideoSDK.

## Community

- [Discord](https://discord.gg/Gpmj6eCq5u) - To get involved with the Video SDK community, ask questions and share tips.
- [Twitter](https://twitter.com/video_sdk) - To receive updates, announcements, blog posts, and general Video SDK tips.
