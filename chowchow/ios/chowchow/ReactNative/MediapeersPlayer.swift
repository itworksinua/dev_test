//
//  RNVideoPlayer.swift
//  HLSProxyDemo
//
//  Created by Maciej Krolikowski on 04/09/2018.
//  Copyright © 2018 Rafal Bereski. All rights reserved.
//

import Foundation
import RNMediapeers

@objc(MediapeersPlayer)
class MediapeersPlayer: RCTViewManager {
  
  @objc override func view() -> UIView! {
    return  RNVideoPlayer()
  }
  
  @objc func playOnlineVideo(_ node:NSNumber, assetId: __int64_t, playlistURL: NSString, title: NSString) {
    DispatchQueue.main.async {
      let player = self.bridge.uiManager.view(forReactTag: node) as! RNVideoPlayer
      player.playOnlinePlaylist(playlistURLString: playlistURL as String, assetId: assetId as Int64)
    }
  }
  
  @objc func playOfflineVideo(_ node: NSNumber, assetId: __int64_t) {
    DispatchQueue.main.async {
      let player = self.bridge.uiManager.view(forReactTag: node) as! RNVideoPlayer
      player.playOfflineTrack(assetId: assetId as Int64)
    }
  }
  
  @objc func destroyPlayer(_ node: NSNumber) {
    DispatchQueue.main.async {
      let player = self.bridge.uiManager.view(forReactTag: node) as! RNVideoPlayer
      player.destroyPlayer()
    }
  }
  
  override class func requiresMainQueueSetup() -> Bool {
    return true
  }
}
