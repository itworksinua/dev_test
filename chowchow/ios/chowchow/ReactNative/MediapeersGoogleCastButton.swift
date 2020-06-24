//
//  RNVideoPlayer.swift
//  HLSProxyDemo
//
//  Created by Maciej Krolikowski on 04/09/2018.
//  Copyright © 2018 Rafal Bereski. All rights reserved.
//

import Foundation
import RNMediapeers

@objc (MediapeersGoogleCastButton)
class MediapeersGoogleCastButton: RCTViewManager {
  
  @objc override func view() -> UIView! {
    return RNGoogleCastButton()
  }
  
  override class func requiresMainQueueSetup() -> Bool {
    return true
  }
}
