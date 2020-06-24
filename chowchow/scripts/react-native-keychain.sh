############################
# React Native Keychain
############################

cd ./node_modules/react-native-keychain/

# Annotation
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.NonNull/import androidx.annotation.NonNull/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.Nullable/import androidx.annotation.Nullable/g' {} \;

# Compile
find . -name 'build.gradle' -exec sed -i -e 's/compile /implementation /g' {} \;

cd ../../
