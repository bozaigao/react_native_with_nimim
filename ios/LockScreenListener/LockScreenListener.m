//
//  LockScreenListener.m
//  ZhiZhuoUser
//
//  Created by 何晏波 on 2018/11/13.
//  Copyright © 2018年 Facebook. All rights reserved.
//

#import "LockScreenListener.h"

@implementation LockScreenListener
RCT_EXPORT_MODULE();
/**
 *监听屏幕锁屏与屏幕激活
 */
RCT_EXPORT_METHOD(listenerScreenLock)
{
  NSLog(@"监听屏幕锁屏与屏幕激活");
  [[NSNotificationCenter defaultCenter] addObserver:self selector:@selector(screenLockChange:) name:@"screenLockChange" object:nil];
}

-(void)screenLockChange:(NSNotification *)notification
{
 [self sendEventWithName:@"listenerScreenLock" body:nil];
}

/**
 *将通知中心移除
 */
RCT_EXPORT_METHOD(removeAllNotification)
{
  NSLog(@"销毁所有通知");
  [[NSNotificationCenter defaultCenter] removeObserver:self];
}

- (NSArray<NSString *> *)supportedEvents
{
  return @[@"listenerScreenLock"];
}
@end
