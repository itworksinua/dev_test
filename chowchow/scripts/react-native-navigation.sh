############################
# React Native Navigation
############################

# This file needs to be overwritten - sadly I am not sure why, But it implements nothing so thats ok
cp ./scripts/replacements/NoOpPromise.java ./node_modules/react-native-navigation/lib/android/app/src/main/java/com/reactnativenavigation/utils/NoOpPromise.java

cd ./node_modules/react-native-navigation/

# Annotation
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.\*/import androidx.annotation.\*/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.NonNull/import androidx.annotation.NonNull/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.Nullable/import androidx.annotation.Nullable/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.RestrictTo/import androidx.annotation.RestrictTo/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.ColorInt/import androidx.annotation.ColorInt/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.Keep/import androidx.annotation.Keep/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.IntRange/import androidx.annotation.IntRange/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.VisibleForTesting/import androidx.annotation.VisibleForTesting/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.CallSuper/import androidx.annotation.CallSuper/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.annotation.CheckResult/import androidx.annotation.CheckResult/g' {} \;

# this one is not a one 2 one. It is wildcard to specific
find . -name '*BottomTabPresenter.java' -exec sed -i -e 's/import android.support.v4.content.\*;/import androidx.core.content.ContextCompat;/g' {} \;
find . -name '*SideMenu.java' -exec sed -i -e 's/import android.support.v4.widget.\*;/import androidx.drawerlayout.widget.DrawerLayout;/g' {} \;

# Widgets and view
find . -name '*.java' -exec sed -i -e 's/import android.support.v4.view.ViewPager/import androidx.viewpager.widget.ViewPager/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.v4.content.ContextCompat/import androidx.core.content.ContextCompat/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.v4.app.FragmentActivity/import androidx.fragment.app.FragmentActivity/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.v4.widget.DrawerLayout/import androidx.drawerlayout.widget.DrawerLayout/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.v4.view.PagerAdapter/import androidx.viewpager.widget.PagerAdapter/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.v4.graphics.ColorUtils/import androidx.core.graphics.ColorUtils/g' {} \;
# find . -name '*.java' -exec sed -i -e 's/import /import /g' {} \;

find . -name '*.java' -exec sed -i -e 's/import android.support.v7.app.AppCompatActivity/import androidx.appcompat.app.AppCompatActivity/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.v7.widget.Toolbar/import androidx.appcompat.widget.Toolbar/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.v7.widget.ActionMenuView/import androidx.appcompat.widget.ActionMenuView/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.design.widget.AppBarLayout/import com.google.android.material.appbar.AppBarLayout/g' {} \;
find . -name '*.java' -exec sed -i -e 's/import android.support.design.widget.TabLayout/import com.google.android.material.tabs.TabLayout/g' {} \;

find . -name '*.java' -exec sed -i -e 's/android.support.v4.graphics.ColorUtils\./androidx.core.graphics.ColorUtils\./g' {} \;


# THIS IS FOR IOS TO FIX THE TOP BAR
find . -name 'RNNViewControllerPresenter.m' -exec sed -i -e '/\[\_customTitleView setFrame\:frame];/s/^/\/\//g' {} \;

cd ../../

