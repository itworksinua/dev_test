//
//  RNMediapeers.m
//  RNMediapeers
//
//  Created by Brendon Blackwell on 11.04.19.
//  Copyright © 2019 mediapeers GmbH. All rights reserved.
//

//#import <RNMediapeers/RNMediapeers.h>
#import <React/RCTBridgeModule.h>
#import <React/RCTEventEmitter.h>
#import <React/RCTViewManager.h>

@interface RCT_EXTERN_MODULE(MediapeersService, RCTEventEmitter)


RCT_EXTERN_METHOD(
                  downloadVideo: (NSDictionary)json
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  removeVideo: (int64_t)assetId
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getDownloadedVideos: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  removeAllVideos: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getDownloadsVideosViaWifiOnly: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )


RCT_EXTERN_METHOD(
                  setDownloadsVideosViaWifiOnly: (BOOL)value
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  getVideoStatus: (int64_t)assetId
                  resolve: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(
                  stopDownloads: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(pauseDownloads: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(resumeDownloads: (RCTPromiseResolveBlock)resolve
                  rejecter: (RCTPromiseRejectBlock)reject
                  )

RCT_EXTERN_METHOD(supportedEvents)

RCT_EXTERN_METHOD(sendEvent)

@end

@interface RCT_EXTERN_MODULE(MediapeersPlayer, RCTViewManager)


RCT_EXPORT_VIEW_PROPERTY(options, NSDictionary)


RCT_EXTERN_METHOD(
                  playOnlineVideo:(nonnull NSNumber *)node
                  assetId:(int64_t)assetId
                  playlistURL:(NSString)playlistURL
                  title:(NSString)title
                  )

RCT_EXTERN_METHOD(
                  playOfflineVideo:(nonnull NSNumber *)node
                  assetId:(int64_t)assetId
                  )

RCT_EXTERN_METHOD(
                  destroyPlayer:(nonnull NSNumber *)node
                  )

@end

@interface RCT_EXTERN_MODULE(MediapeersGoogleCastButton, RCTViewManager)

RCT_EXPORT_VIEW_PROPERTY(color, NSString)

@end
