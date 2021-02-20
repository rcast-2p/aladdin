#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
test of y_coord function and etc.
"""
from websocket_wrap import WebsocketWrap


class TestYCoord(WebsocketWrap):
    """
    testing y_coord function
    """
    frequency = 10
    pixel_dwell_time = 1

    # pylint: disable=super-init-not-called
    def __init__(self):
        """
        rewriting constructor
        """
        self.test_y_coord()

    def test_y_coord(self):
        """
        tester
        """
        print("case 300 1")
        for i in range(10):
            print(self.y_coord((300, 1), i))
        print("case 500 500")
        for i in range(10):
            print(self.y_coord((500, 500), i))


if __name__ == "__main__":
    TestYCoord()
