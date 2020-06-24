#import <Foundation/Foundation.h>
#import "HTTPResponse.h"


@interface HTTPDataAndHeadersResponse : NSObject <HTTPResponse>
{
	NSUInteger offset;
	NSData *data;
    NSDictionary * hdrs;
}

- (id)initWithData:(NSData *)data headers:(NSDictionary *)headers;

@end
