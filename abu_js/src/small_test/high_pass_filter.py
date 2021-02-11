#!/usr/bin/env python
# -*- coding: utf-8 -*-
"""
low pass filter and high pass filter
"""
from PIL import Image
import numpy as np
import matplotlib.pyplot as plt


class PassFilter:
    """
    main class
    """
    delta_t = 0.01
    RC = 0.5 / np.pi

    def low_pass_update(self, v_in, v_now) -> float:
        """
        update
        """
        return (v_in -
                (1 - self.RC / self.delta_t) * v_now) * self.delta_t / self.RC

    def high_pass_update(self, v_in0, v_in1, v_out0) -> float:
        """
        update
        """
        dv_diff = v_out0 / self.RC * self.delta_t
        return v_in1 - (dv_diff + (v_in0 - v_out0))
        # k = -self.RC / self.delta_t
        # return (v_in - v_now) / k + v_now
        # return ((self.RC / self.delta_t) * (v_in_next - v_in) -
        #         (1 - self.RC / self.delta_t) * v_now) / self.RC * self.delta_t

    @staticmethod
    def filter(v_in_array, v_out_ini, func):
        """
        low pass wrapper
        """
        v_out_array = np.empty_like(v_in_array)
        v_out_array[0] = v_out_ini
        for t_i, _ in enumerate(v_in_array[:-1]):
            v_out_array[t_i + 1] = func(v_in_array[t_i], v_in_array[t_i + 1],
                                        v_out_array[t_i])
        return v_out_array

    def open_tiff(self):
        """
        open tiff
        """
        path = "/home/endo/Documents/2papp/scan/flask/octo_test/1222/xf20201222-154105.tiff"
        img = Image.open(path)
        img_array = np.empty(0)
        for z_i in range(img.n_frames):
            img.seek(z_i)
            img_array = np.concatenate([img_array, np.asarray(img).flatten()])
        print(img_array[:10])
        filtered_array = (self.filter(img_array, 0, self.high_pass_update) +
                          img_array[0]).astype("uint16")
        print(filtered_array[:10])
        filtered_array.resize((img.n_frames, img.size[1], img.size[0]))
        output_stack = []
        for f_img in filtered_array:
            output_stack.append(Image.fromarray(f_img))
        save_path = "/home/endo/Documents/2papp/scan/flask/octo_test/1222/xf20201222-154105_hpf.tiff"
        print(len(output_stack))
        output_stack[0].save(save_path,
                             save_all=True,
                             append_images=output_stack[1:])

    def prepare_input_0(self, freq):
        """
        prepare input
        """
        time_course = np.arange(0, 10, self.delta_t)
        v_in = np.sin(time_course * 2 * np.pi * freq)
        v_out = self.filter(v_in, 0, self.high_pass_update)
        plt.plot(time_course, v_in)
        plt.plot(time_course, v_out)
        power = 1 / np.sqrt(1 + (self.RC * 2 * np.pi * freq)**2)
        power = self.RC * 2 * np.pi * freq / np.sqrt(1 + (self.RC * 2 * np.pi *
                                                          freq)**2)
        # power = 1 - 1 / np.sqrt(1 + (self.RC * 2 * np.pi * freq)**2)
        plt.axhline(y=power)
        print(power)
        print(f"time constant: {0.5/self.RC/np.pi}")

    def prepare_input(self, freq):
        """
        prepare input
        """
        time_course = np.arange(0, 10, self.delta_t)
        v_drift = 1.5 * np.sin(time_course * 2 * np.pi * freq)
        v_uniform_pulse = np.random.uniform(size=time_course.size) * 1
        v_uniform_pulse[v_uniform_pulse < 0.99] = 0
        v_noise = 0.02 * np.random.normal(size=time_course.size)
        v_in = v_drift + v_noise + v_uniform_pulse * 0.1 + 2
        v_out = self.filter(v_in, 0, self.high_pass_update)
        plt.plot(time_course, v_in)
        plt.plot(time_course, v_out + 0.5)
        power = 1 / np.sqrt(1 + (self.RC * 2 * np.pi * freq)**2)
        power = self.RC * 2 * np.pi * freq / np.sqrt(1 + (self.RC * 2 * np.pi *
                                                          freq)**2)
        # power = 1 - 1 / np.sqrt(1 + (self.RC * 2 * np.pi * freq)**2)
        plt.axhline(y=power)
        print(power)
        print(f"time constant: {0.5/self.RC/np.pi}")


def main():
    """
    main function
    """
    pf = PassFilter()
    pf.open_tiff()
    # pf.prepare_input(0.01)
    # # pf.prepare_input(0.1)
    # plt.savefig("./low_pass.png", transparent=True)


if __name__ == "__main__":
    main()
