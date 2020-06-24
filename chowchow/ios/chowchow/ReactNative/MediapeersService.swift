//
//  RNVideoPlayerService.swift
//  HLSProxyDemo
//
//  Created by Maciej Krolikowski on 15/10/2018.
//  Copyright © 2018 Rafal Bereski. All rights reserved.
//

import Foundation
import RNMediapeers

open class MediapeersServiceEventEmitter {
    
    public static var sharedInstance = MediapeersServiceEventEmitter()
    
    private static var eventEmitter: MediapeersService!
    
    private init() {}
    
    func registerEventEmitter(eventEmitter: MediapeersService) {
        MediapeersServiceEventEmitter.eventEmitter = eventEmitter
    }
    
    func dispatch(name: String, body: Any?) {
        MediapeersServiceEventEmitter.eventEmitter.sendEvent(withName: name, body: body)
    }
    
    lazy var allEvents: [String] = {
        var allEventNames: [String] = []
        return allEventNames
    }()
}

@objc(MediapeersService)
public class MediapeersService: RCTEventEmitter {
  
    let handleDownloadStateEvent = "handleDownloadStateChange"
    let handleDownloadProgressEvent = "handleDownloadProgress"
    let reloadVideoListEvent = "reloadVideoList"
    let cantDownloadHSLPlaylistEvent = "cantDownloadHSLPlaylist"
  
    
    let services: AppServices = AppServices.shared
    
    var rnAppServicesBridge: RNAppServicesBridge { return services.rnAppServicesBridge }
    
    /// Initializer
    public override init() {
        
        super.init()
        
        MediapeersServiceEventEmitter.sharedInstance.registerEventEmitter(eventEmitter: self)
        
        handleNotifications()
        
        rnAppServicesBridge.startNotifyingOnReachability()
    }
    
    
    /// Get all downloaded videos
    ///
    /// - Parameters:
    ///   - resolve: Success promise
    ///   - reject: Rejected promise (never occurs)
    @objc func getDownloadedVideos(_ resolve: @escaping RCTPromiseResolveBlock,
                                   rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        
        let videos = rnAppServicesBridge.listDownloadedVideos()
        resolve(videos)
    }
    
    /// Remove all downloaded Videos
    ///
    /// - Parameters:
    ///   - resolve: Success promise
    ///   - reject: Rejected promise - When download deletion fails
    @objc func removeAllVideos(_ resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        do {
            try self.rnAppServicesBridge.removeAllVideos()
            resolve(true)
            DispatchQueue.main.async {
                MediapeersServiceEventEmitter.sharedInstance.dispatch(name: self.reloadVideoListEvent, body: [:])
            }
        } catch let error {
            reject("E_REMOVE_ALL_VIDEOS", error.localizedDescription, error)
        }
    }
    
    /// Download a video
    ///
    /// - Parameters:
    ///   - videoJSON: VideoModel - The video to download
    ///   - resolve: Success promise
    ///   - reject: Rejected promise - When download start fails
    @objc func downloadVideo(_ videoJSON: NSDictionary,
                             resolve: @escaping RCTPromiseResolveBlock,
                             rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        do {
            try rnAppServicesBridge.downloadVideo(videoJSON: videoJSON)
            resolve("success")
        } catch {
            reject("E_DOWNLOAD_VIDEOS", error.localizedDescription, nil)
        }
    }
    
    /// Remove a single downloaded video by assetId
    ///
    /// - Parameters:
    ///   - assetId: Integer of th Asset Id to delete
    ///   - resolve: Success promise
    ///   - reject: Rejected promise - When download deletion fails
    @objc func removeVideo(_ assetId: __int64_t,
                           resolve: @escaping RCTPromiseResolveBlock,
                           rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        do {
            let videos = try rnAppServicesBridge.removeVideo(assetId)
            DispatchQueue.main.async {
                resolve(videos)
                MediapeersServiceEventEmitter.sharedInstance.dispatch(name: self.reloadVideoListEvent, body: [:])
            }
        } catch let error {
            reject("E_REMOVE_ITEM", error.localizedDescription, error)
        }
    }
    
    
    /// Check what the 'DownloadOnlyOnWifi' setting is set to
    ///
    /// - Parameters:
    ///   - resolve: Success promise - The settings state
    ///   - reject: Rejected promise (never occurs)
    @objc func getDownloadsVideosViaWifiOnly(_ resolve: @escaping RCTPromiseResolveBlock,
                                             rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        resolve(rnAppServicesBridge.downloadsVideosViaWifiOnly)
    }
    
    /// Set the 'DownloadOnlyOnWifi' setting
    ///
    /// - Parameters:
    ///   - resolve: Success promise - The setting's new state
    ///   - reject: Rejected promise (never occurs)
    @objc func setDownloadsVideosViaWifiOnly(_ value: Bool,
                                             resolve: @escaping RCTPromiseResolveBlock,
                                             rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        rnAppServicesBridge.setDownloadsVideosViaWifiOnly(value: value)
        resolve(rnAppServicesBridge.downloadsVideosViaWifiOnly)
    }
    
    /// Get the current download status of a video
    ///
    /// - Parameters:
    ///   - assetId: Integer of th Asset Id to delete
    ///   - resolve: Success promise
    ///   - reject: Rejected promise (never occurs)
    @objc func getVideoStatus(_ assetId: __int64_t,
                              resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        
        let status = rnAppServicesBridge.videoStatus(assetId: assetId)
        resolve(status)
    }
    
    /// Pause all downloads
    ///
    /// - Parameters:
    ///   - resolve: Success promise
    ///   - reject: Rejected promise (never occurs)
    @objc func pauseDownloads(_ resolve: @escaping RCTPromiseResolveBlock,
                              rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        rnAppServicesBridge.pauseDownloads()
        resolve("paused")
    }
    
    /// Resume all downloads
    ///
    /// - Parameters:
    ///   - resolve: Success promise
    ///   - reject: Rejected promise (never occurs)
    @objc func resumeDownloads(_ resolve: @escaping RCTPromiseResolveBlock,
                               rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        rnAppServicesBridge.resumeDownloads()
        resolve("resumed")
    }
    
    /// Stop all downloads
    ///
    /// - Parameters:
    ///   - resolve: Success promise
    ///   - reject: Rejected promise (never occurs)
    @objc func stopDownloads(_ resolve: @escaping RCTPromiseResolveBlock,
                             rejecter reject: @escaping RCTPromiseRejectBlock) -> Void {
        rnAppServicesBridge.stopDownloads()
        
        DispatchQueue.main.async {
            MediapeersServiceEventEmitter.sharedInstance.dispatch(name: self.reloadVideoListEvent, body: [:])
            resolve("stopped")
        }
    }
    
    
    /******************/
    //MARK: - Notifications
    /******************/
    
    func handleNotifications() {
        
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(self.handleDownloadProgress(_:)),
                                               name: Notifications.downloadProgress.name,
                                               object: nil)

        NotificationCenter.default.addObserver(self,
                                               selector: #selector(self.cantDownloadHLSPlaylistAction(_:)),
                                               name: Notifications.cantDownloadHLSPlaylist.name,
                                               object: nil)
      
        NotificationCenter.default.addObserver(self,
                                               selector: #selector(self.handleDownloadStateChange(_:)),
                                               name: Notifications.downloadStateChanged.name,
                                               object: nil)
      
    }

    @objc func handleDownloadStateChange(_ notification: Notification) {
      
      DispatchQueue.main.async {
        MediapeersServiceEventEmitter.sharedInstance.dispatch(name: self.handleDownloadStateEvent, body: notification.userInfo)
      }
    }
  
  
    @objc func handleDownloadProgress(_ notification: Notification) {
        
        guard let videoDictionary = rnAppServicesBridge.videoDictionary(from: notification) else {
            return
        }
        
        DispatchQueue.main.async {
            MediapeersServiceEventEmitter.sharedInstance.dispatch(name: self.handleDownloadProgressEvent, body: videoDictionary)
        }
    }
    
    @objc func cantDownloadHLSPlaylistAction(_ notification: Notification) {
        
        guard
            let userInfo = notification.userInfo
            else {
                Log.error(message: ""); return
        }
        
        DispatchQueue.main.async {
            
            MediapeersServiceEventEmitter.sharedInstance.dispatch(name: self.cantDownloadHSLPlaylistEvent, body: userInfo)
        }
    }
    
    
    
    @objc open override func supportedEvents() -> [String]! {
        return [handleDownloadStateEvent, handleDownloadProgressEvent, reloadVideoListEvent, cantDownloadHSLPlaylistEvent]
    }
    
    /******************/
    //MARK: - Helper
    /******************/
    
    @objc public override static func requiresMainQueueSetup() -> Bool {
        return false
    }
    
}
