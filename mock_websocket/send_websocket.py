#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
send image data with websocket
"""
import asyncio
from websocket_wrap import WebsocketWrap

WSW = WebsocketWrap()
SERVER = WSW.start_server()
asyncio.get_event_loop().run_until_complete(SERVER)
asyncio.get_event_loop().run_forever()
