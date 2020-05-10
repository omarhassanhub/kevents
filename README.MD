Features:
---
- Sign-up user
- Create, Delete, and Update events
- Sync with s3 to save/retrieve event posters
- Launch the app on iOS, Android, and Web (provided that date/time picker is commented out since its not supported on the web)
- Admin user with FULL ACCESS.
- Join/Leave events
- Chat channel within each event

To Do:
-------
Issues need fixing:
- Amplify auth.signout() does not return to Sign In page (due to using AppContainer and Navigators)
- Improve UI 
- Implement Test Driven Development


Improve Dev environment:
 
Current

- [ ] Python
- [ ] NPM
- [ ] Expo cli
- [ ] Amplify
- [ ] React
- [ ] Android Studio (To use the Emulator)
- [ ] Xcode (To use the Emulator)

Ideal:
- [ ] Dockerize the current Dev environment to incorporate all the above
    - [ ] This above will require Vmware Fusion (supports nested virtualization) with Ubuntu OS image
Status:
Currently, I have been able to Dockerize the environment by utilizing [andocker](https://github.com/ccarcaci/andocker)
and [docker-android](https://github.com/budtmo/docker-android) but facing a few issues with the emulator not starting up and being flaky.

App deployment:
- [ ] Use Code Deploy to push the changes from github to an ec2 instance on AWS
- [ ] Implement Docker on the ec2 instance
- [ ] Deploy to app/play store 


Notes to self:
s3 works with the below amplify versions as of now:

- "aws-amplify": "3.0.8-unstable.5",
- "aws-amplify-react-native": "4.0.4-unstable.5",

Comment out date picker to launch the app on the web

