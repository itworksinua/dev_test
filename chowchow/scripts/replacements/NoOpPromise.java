package com.reactnativenavigation.utils;

import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.WritableMap;

import javax.annotation.Nullable;

public class NoOpPromise implements Promise {
    @Override
    public void resolve(@Nullable Object value) {

    }

    @Override
    public void reject(String code, String message) {

    }

    @Override
    public void reject(String code, Throwable e) {

    }

    @Override
    public void reject(String code, String message, Throwable e) {

    }

    @Deprecated
    @Override
    public void reject(String message) {

    }

    @Override
    public void reject(Throwable reason) {

    }

    // added during the postinstall script for androidx support
    public void reject(Throwable reason, WritableMap map) {

    }

    // added during the postinstall script for androidx support
    public void reject(String code, WritableMap map) {

    }

    // added during the postinstall script for androidx support
    public void reject(String code, Throwable reason, WritableMap map) {

    }

    // added during the postinstall script for androidx support
    public void reject(String code, String message, WritableMap map) {

    }

    // added during the postinstall script for androidx support
    public void reject(String code, String message, Throwable reason, WritableMap map) {

    }
}
