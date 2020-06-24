fastlane documentation
================
# Installation

Make sure you have the latest version of the Xcode command line tools installed:

```
xcode-select --install
```

Install _fastlane_ using
```
[sudo] gem install fastlane -NV
```
or alternatively using `brew cask install fastlane`

# Available Actions
## iOS
### ios staging
```
fastlane ios staging
```
Submit a new Staging Build to Apple TestFlight
### ios release
```
fastlane ios release
```
Submit a new Release Build to Apple TestFlight
### ios getTeamNames
```
fastlane ios getTeamNames
```
Helper function to get the Team Id and Developer Id
### ios upload
```
fastlane ios upload
```
Deploy lastest IPA to Testflight internal
### ios certificates
```
fastlane ios certificates
```
Updates devices & creates certificates

----

## Android
### android getKeyStore
```
fastlane android getKeyStore
```

### android push_credentials_to_repo
```
fastlane android push_credentials_to_repo
```
Releases a build connected to staging to the alpha lane
### android pull_credentials_from_repo
```
fastlane android pull_credentials_from_repo
```

### android staging
```
fastlane android staging
```
Releases a build connected to staging to the alpha lane
### android upload_stage
```
fastlane android upload_stage
```

### android release
```
fastlane android release
```
Deploy a new alpha version to the Google Play Store
### android injectVersion
```
fastlane android injectVersion
```


----

This README.md is auto-generated and will be re-generated every time [fastlane](https://fastlane.tools) is run.
More information about fastlane can be found on [fastlane.tools](https://fastlane.tools).
The documentation of fastlane can be found on [docs.fastlane.tools](https://docs.fastlane.tools).
