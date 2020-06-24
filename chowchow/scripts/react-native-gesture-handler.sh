cd ./node_modules/react-native-gesture-handler/

# Compile
find . -name '*.java' -exec sed -i -e 's/android.support.v4.util.Pools/androidx.core.util.Pools/g' {} \;

cd ../../
