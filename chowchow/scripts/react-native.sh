############################
# React Native 
############################

# This file needs to be overwritten - to remove android studio warnings
cp ./scripts/replacements/react.gradle ./node_modules/react-native/react.gradle

# Was needed for < 0.59.2 with Xcode 10.2 & Swift 5
# cp ./scripts/replacements/RCTBridgeModule.h ./node_modules/react-native/React/Base/RCTBridgeModule.h

cd ./node_modules/react-native/Libraries/Utilities

# Get rid of annoying logging
find . -name 'RCTLog.js' -exec sed -i -e 's/console\[logFn\]/\/\/console\[logFn\]/g' {} \;
find . -name 'infoLog.js' -exec sed -i -e 's/return console/\/\/return console/g' {} \;

cd ../../../../