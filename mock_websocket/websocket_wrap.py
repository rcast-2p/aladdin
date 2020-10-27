"""
websocket wrap shared library
"""
import argparse
import time
import websockets
import numpy as np
from PIL import Image


class WebsocketWrap:
    """
    websocket sending class
    """

    def __init__(self):
        parser = argparse.ArgumentParser(
            description="tiff file websocket sender")
        parser.add_argument("--port", type=int, required=True)
        parser.add_argument("--savefile", type=str)
        parser.add_argument("--count", type=int)
        parsed = parser.parse_args()
        self.port = parsed.port
        self.savefile = parsed.savefile
        self.count = parsed.count

    def start_server(self):
        """
        return server object
        """
        return websockets.serve(self.send_img_data, "localhost", self.port)

    async def send_img_data(self, websocket, _):
        """
        main function send image data
        """
        tiff_img = Image.open(
            "/home/endo/Documents/2papp/receiver/mock_data/dummy_tiff/pref20.tiff")
        n_frames = tiff_img.n_frames
        recvtxt = await websocket.recv()
        print(recvtxt)
        while True:
            for f_i in range(n_frames):
                tiff_img.seek(f_i)
                ui32arr = np.asarray(tiff_img, dtype=np.uint32)
                ui32arr += 255*(256**3)
                print(ui32arr.dtype)
                ui32arr = np.append(ui32arr, np.array(
                    [65536*f_i+1], dtype=np.uint32))
                imgbytes = bytes(ui32arr)
                await websocket.send(imgbytes)
                time.sleep(0.5)

    async def recv_img_data(self):
        """
        main function receive image data
        """
        uri = f"ws://localhost:{self.port}"
        async with websockets.connect(uri) as websocket:
            await websocket.send("Hello World")
            with open(f"{self.savefile}", "wb") as f:
                for _ in range(self.count):
                    data = await websocket.recv()
                    f.write(data)
