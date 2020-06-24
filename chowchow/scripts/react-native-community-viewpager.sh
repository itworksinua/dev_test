############################
# React Native Community / ViewPager
############################

cd ./node_modules/@react-native-community/viewpager/

# Compile
find . -name '*.java' -exec sed -i -e 's/android.support.v4.view.PagerAdapter/androidx.viewpager.widget.PagerAdapter/g' {} \;
find . -name '*.java' -exec sed -i -e 's/android.support.v4.view.ViewPager/androidx.viewpager.widget.ViewPager/g' {} \;

cd ../../