############################
# React Native TouchId
############################

cd ./node_modules/@react-native-community/netinfo/

# Compile
find . -name '*.java' -exec sed -i -e 's/android.support.v4.net.ConnectivityManagerCompat/androidx.core.net.ConnectivityManagerCompat/g' {} \;


cd ../../