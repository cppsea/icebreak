![icebreak logo](/assets/small_banner.jpg)

A platform for organizations to interact with their members. A central hub for members to be always updated on the latest events while providing features to incentivize member growth.

## Getting Started

This monorepo contains both the client and server codebase. In order to run the development enviroment, you must run follow the setup based on your operating system.

- [Windows](<https://github.com/cppsea/icebreak/wiki/Environment-Setup-(Windows)>)
- [MacOS](<https://github.com/cppsea/icebreak/wiki/Environment-Setup-(MacOS)>)

## Run

All these commands must be ran in order to get a fully running application.

Start the backend server by running:

```
yarn server:start
```

Port Forward; require since expo can't reach localhost networks.

```
ngrok http 5050
```

Start Expo; begins the client server. Scan the QRCode on your phone.

```
yarn app:start
```
