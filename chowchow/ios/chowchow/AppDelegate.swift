//
//  AppController.swift
//  HLSProxyDemo
//
//  Created by Maciej Krolikowski on 29/08/2018.
//  Copyright © 2018 Proexe. All rights reserved.
//

import Foundation
import UIKit
import Firebase

@UIApplicationMain

class AppDelegate: UIResponder, UIApplicationDelegate, RCTBridgeDelegate {

  var window: UIWindow?


  func application(_ application: UIApplication, didFinishLaunchingWithOptions launchOptions: [UIApplication.LaunchOptionsKey: Any]?) -> Bool {

    FirebaseApp.configure()
    
    
    let bridge: RCTBridge = RCTBridge.init(delegate: self, launchOptions: launchOptions)
    ReactNativeNavigation.bootstrap(self.sourceURL(for: bridge), launchOptions: launchOptions)


    return true
  }
  

  func sourceURL(for bridge: RCTBridge!) -> URL! {
//    #if DEBUG
    return RCTBundleURLProvider.sharedSettings()?.jsBundleURL(forBundleRoot: "index", fallbackResource: nil)
//    #else
//    return Bundle.main.url(forResource: "main", withExtension: "jsbundle")
//    #endif
  }
  
}


