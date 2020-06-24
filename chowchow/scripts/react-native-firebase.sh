############################
# React Native Fast Image
############################

cd ./node_modules/react-native-firebase/

# Annotation
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.RequiresPermission/import androidx.annotation.RequiresPermission/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.v4.app.NotificationManagerCompat/import androidx.core.app.NotificationManagerCompat/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.v4.content.LocalBroadcastManager/import androidx.localbroadcastmanager.content.LocalBroadcastManager/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.v4.app.RemoteInput/import androidx.core.app.RemoteInput/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.v4.app.NotificationCompat/import androidx.core.app.NotificationCompat/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.Keep/import androidx.annotation.Keep/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.RequiresApi/import androidx.annotation.RequiresApi/g' {} \;

cd ../../