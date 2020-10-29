"""
test
"""

from websocket_wrap import WebsocketWrap

WSW = WebsocketWrap()
for i in range(10, 20):
    print(WSW.y_coord((512, 512), i))
