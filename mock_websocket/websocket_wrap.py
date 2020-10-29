"""
websocket wrap shared library
"""
import argparse
import time
import math
import websockets
import numpy as np
from PIL import Image


class WebsocketWrap:
    """
    websocket sending class
    """
    tiffsend = True
    duration = 0.166
    pixel_dwell_time = 1
    count = 4
    frequency = 60
    savefile = "/tmp/work/websocket.bin"

    def __init__(self):
        parser = argparse.ArgumentParser(
            description="tiff file websocket sender")
        parser.add_argument("--port", type=int, required=True)
        parser.add_argument("--savefile", type=str, default=self.savefile)
        parser.add_argument("--count", type=int, default=self.count)
        parser.add_argument("--frequency", type=int,
                            default=self.frequency, help="video rate: 60")
        parser.add_argument("--pixel-dwell-time", type=float,
                            default=self.pixel_dwell_time)
        parsed = parser.parse_args()
        print(repr(parsed))
        self.port = parsed.port
        self.savefile = parsed.savefile
        self.count = parsed.count
        self.frequency = parsed.frequency
        self.pixel_dwell_time = parsed.pixel_dwell_time

    def start_server(self):
        """
        return server object
        """
        return websockets.serve(self.send_img_data, "localhost", self.port)

    def y_coord(self, size, websocket_i) -> list:
        """
        return y_coord of the websocket packet whose index is websocket_i

        Parameters
        ----------
        size: tuple
            (width, height)
        websocket_i : int
            websocket index

        Returns
        -------
        y_coords : list
            [y_begin1, y_end1, y_begin2, y_end2, z_index1, z_index2]
        """
        (width, height) = size
        packet_num = width*height * \
            self.frequency//(1000000*self.pixel_dwell_time)
        if packet_num == 0:
            return [0, height, -1, -1, websocket_i, -1]
        pixel_num = (1000000/self.pixel_dwell_time)/self.frequency
        y_begin_accm = math.floor(websocket_i*pixel_num/width)
        y_end_accm = math.floor((websocket_i+1)*pixel_num/width)
        new_z = 0

        if y_begin_accm % height > (y_end_accm-1) % height:
            return [y_begin_accm % height, height, 0, y_end_accm % height, new_z]

        if websocket_i > 0:
            z_current_index = math.floor(websocket_i*pixel_num/(width*height))
            z_previous_index = math.floor(
                (websocket_i-1)*pixel_num/(width*height))
            if z_previous_index < z_current_index:
                new_z = 1
        return [y_begin_accm % height, (y_end_accm-1) % height+1, -1, -1, new_z]

    async def send_img_data(self, websocket, _):
        """
        main function send image data
        """
        tiff_img = Image.open(
            "/home/endo/Documents/2papp/receiver/mock_data/dummy_tiff/pref500.tiff")

        tiff_img.seek(0)
        (width, height) = tiff_img.size
        packet_num = width*height * \
            self.frequency//(1000000*self.pixel_dwell_time)
        n_frames = tiff_img.n_frames
        recvtxt = await websocket.recv()
        print(recvtxt)
        # while True:
        if packet_num == 0:
            for f_i in range(n_frames):
                time_start = time.perf_counter()
                tiff_img.seek(f_i)
                ui32arr = np.asarray(tiff_img, dtype=np.uint32)
                if not self.tiffsend:
                    ui32arr += 255*(256**3)
                ui32arr = np.append(ui32arr, np.array(
                    [65536*f_i+1], dtype=np.uint32))
                imgbytes = bytes(ui32arr)
                time_ws_begin = time.perf_counter()
                await websocket.send(imgbytes)
                time_end = time.perf_counter()
                print(time_end-time_start)
                print("ws", time_end-time_ws_begin)
                time.sleep(max(self.duration-time_end+time_start, 0))
        else:
            f_i = 0
            tiff_img.seek(f_i)
            ui32arr = np.asarray(tiff_img, dtype=np.uint32)
            print(ui32arr.shape)
            for w_i in range(self.count):
                time_start = time.perf_counter()
                y_coord = self.y_coord((width, height), w_i)
                print(y_coord)
                if y_coord[4] == 1:
                    f_i = (f_i+1) % n_frames
                    tiff_img.seek(f_i)
                    ui32arr2 = np.asarray(tiff_img, dtype=np.uint32)
                imgbytes = bytes(ui32arr[y_coord[0]:y_coord[1], :])
                if y_coord[2] != -1:
                    f_i = (f_i+1) % n_frames
                    tiff_img.seek(f_i)
                    ui32arr2 = np.asarray(tiff_img, dtype=np.uint32)
                    imgbytes2 = bytes(
                        ui32arr2[y_coord[2]:y_coord[3], :])
                    imgbytes += imgbytes2
                imgbytes += bytes(np.array(y_coord[:4], dtype=np.uint32))
                print(len(imgbytes))
                await websocket.send(imgbytes)
                time_end = time.perf_counter()
                print(time_end-time_start)
                time.sleep(max(self.duration-time_end+time_start, 0))

    async def recv_img_data(self):
        """
        main function receive image data
        """
        uri = f"ws://localhost:{self.port}"
        async with websockets.connect(uri) as websocket:
            await websocket.send("Hello World")
            with open(f"{self.savefile}", "wb") as f:
                for i in range(self.count):
                    print(i)
                    data = await websocket.recv()
                    f.write(data)
