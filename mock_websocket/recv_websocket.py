"""
send image data with websocket
"""
import asyncio
from websocket_wrap import WebsocketWrap

WSW = WebsocketWrap()
asyncio.run(WSW.recv_img_data())
