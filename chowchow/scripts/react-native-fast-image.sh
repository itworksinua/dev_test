############################
# React Native Fast Image
############################

cd ./node_modules/react-native-fast-image/

# Annotation
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.NonNull/import androidx.annotation.NonNull/g' {} \;
# find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.CheckResult/import androidx.annotation.CheckResult/g' {} \;
find . -name '*.java' -exec sed -i -e 's/@android.support.annotation.Nullable/@androidx.annotation.Nullable/g' {} \;


cd ../../