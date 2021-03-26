#!/usr/bin/env python
# -*- coding: utf-8 -*-
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
    tiffsend = True
    duration = 0.166
    pixel_dwell_time = 1
    count = 4
    frequency = 60
    savefile = "/tmp/work/websocket.bin"
    input_file = ""

    def __init__(self):
        parser = argparse.ArgumentParser(
            description="tiff file websocket sender")
        parser.add_argument("--port", type=int, required=True)
        parser.add_argument("--savefile", type=str, default=self.savefile)
        parser.add_argument("--input-file", type=str, default=self.input_file)
        parser.add_argument("--count", type=int, default=self.count)
        parser.add_argument("--frequency",
                            type=int,
                            default=self.frequency,
                            help="video rate: 60")
        parser.add_argument("--pixel-dwell-time",
                            type=float,
                            default=self.pixel_dwell_time,
                            help="unit us")
        parsed = parser.parse_args()
        print(repr(parsed))
        self.port = parsed.port
        self.savefile = parsed.savefile
        self.input_file = parsed.input_file
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
            [y_begin1, y_end1, y_begin2, y_end2, z_current_index]
        """
        (width, height) = size

        # pixel num per message
        pixel_num = int((1000000 / self.pixel_dwell_time) / self.frequency)
        y_begin_accm = websocket_i * pixel_num // width
        y_end_accm = (websocket_i + 1) * pixel_num // width
        y_begin_mod = y_begin_accm % height
        y_end_mod = y_end_accm % height
        z_current_index = 0
        z_previous_index = -1
        if websocket_i > 0:
            z_current_index = websocket_i * pixel_num // (width * height)
            z_previous_index = (websocket_i - 1) * pixel_num // (width *
                                                                 height)
        new_z = 0
        if z_previous_index < z_current_index:
            new_z = 1

        if pixel_num >= width * height or (height == 1 and new_z == 1):
            return [0, height, 0, 0, z_current_index]
        if y_begin_mod > y_end_mod:
            return [y_begin_mod, height, 0, y_end_mod, z_current_index]
        return [y_begin_mod, y_end_mod, -1, -1, z_current_index]

    # pylint: disable=too-many-locals
    async def send_img_data(self, websocket, _):
        """
        main function send image data
        """
        tiff_img = Image.open(self.input_file)

        tiff_img.seek(0)
        (width, height) = tiff_img.size
        n_frames = tiff_img.n_frames
        recvtxt = await websocket.recv()
        print(recvtxt)
        # while True:
        f_i = -1
        ui16arr = np.array([])
        for w_i in range(self.count):
            time_start = time.perf_counter()
            y_coord = self.y_coord((width, height), w_i)
            imgbytes = bytes(np.array(y_coord[:4], dtype=np.uint16))
            imgbytes += bytes(np.array(y_coord[4:5], dtype=np.uint32))
            print(y_coord)
            f_i = y_coord[4] % n_frames
            tiff_img.seek(f_i)
            ui16arr = np.asarray(tiff_img, dtype=np.uint16)
            imgbytes += bytes(ui16arr[y_coord[0]:y_coord[1], :])
            if y_coord[2] != -1:
                f_i = (f_i + 1) % n_frames
                tiff_img.seek(f_i)
                ui16arr2 = np.asarray(tiff_img, dtype=np.uint16)
                imgbytes2 = bytes(ui16arr2[y_coord[2]:y_coord[3], :])
                print(ui16arr2[y_coord[2]])
                imgbytes += imgbytes2
            print(len(imgbytes))
            await websocket.send(imgbytes)
            time_end = time.perf_counter()
            print(time_end - time_start)
            time.sleep(max(self.duration - time_end + time_start, 0))
        imgbytes = bytes(np.asarray([0, 0, -1], dtype=np.int32))
        await websocket.send(imgbytes)

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
