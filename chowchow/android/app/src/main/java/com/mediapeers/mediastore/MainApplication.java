package com.mediapeers.mediastore;

import com.facebook.react.ReactNativeHost;
import com.facebook.react.ReactPackage;
import com.dylanvann.fastimage.FastImageViewPackage;
import com.oblador.vectoricons.VectorIconsPackage;
import com.oblador.keychain.KeychainPackage;
import com.rnfingerprint.FingerprintAuthPackage;
import com.learnium.RNDeviceInfo.RNDeviceInfo;
import com.reactnativenavigation.NavigationApplication;
import com.reactnativenavigation.react.NavigationReactNativeHost;
import com.reactnativenavigation.react.ReactGateway;
import com.reactnativecommunity.netinfo.NetInfoPackage;
import com.reactnativecommunity.asyncstorage.AsyncStoragePackage;
import com.reactnativecommunity.viewpager.RNCViewPagerPackage;
import java.util.Arrays;
import java.util.List;

import com.swmansion.gesturehandler.react.RNGestureHandlerPackage;
import io.invertase.firebase.RNFirebasePackage;
import io.invertase.firebase.analytics.RNFirebaseAnalyticsPackage;
import io.invertase.firebase.fabric.crashlytics.RNFirebaseCrashlyticsPackage;
import pl.proexe.mediapeersplayer.MediapeersPlayer;

public class MainApplication extends NavigationApplication {

    @Override
    public void onCreate(){
        super.onCreate();
    }

    @Override
    protected ReactGateway createReactGateway() {

        MediapeersPlayer.Companion.initalize(this);

        ReactNativeHost host = new NavigationReactNativeHost(this, isDebug(), createAdditionalReactPackages()) {
            @Override
            protected String getJSMainModuleName() {
                return "index";
            }
        };

        MediapeersPlayer.Companion.setReactNativeHost(host);

        return new ReactGateway(this, isDebug(), host);
    }

    @Override
    public boolean isDebug() {
        return BuildConfig.DEBUG;
    }

    protected List<ReactPackage> getPackages() {
        // Add additional packages you require here
        // No need to add RnnPackage and MainReactPackage
        return Arrays.<ReactPackage>asList(
                new FastImageViewPackage(),
                new VectorIconsPackage(),
                new FingerprintAuthPackage(),
                new KeychainPackage(),
                new NetInfoPackage(),
                new AsyncStoragePackage(),
                new RNCViewPagerPackage(),
                new RNFirebasePackage(),
                new RNFirebaseAnalyticsPackage(),
                new RNFirebaseCrashlyticsPackage(),
                new RNDeviceInfo(),
                new RNGestureHandlerPackage(),
                MediapeersPlayer.Companion.getRnAppPackage()
        );
    }

    @Override
    public List<ReactPackage> createAdditionalReactPackages() {
        return getPackages();
    }
}
