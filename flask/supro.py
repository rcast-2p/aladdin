import subprocess
from subprocess import PIPE
import sys
proc = subprocess.run("date", shell=True, stdout=PIPE, stderr=PIPE)
date = sys.stdout.buffer.write(proc.stdout)
print('STDOUT: {}'.format(date))
