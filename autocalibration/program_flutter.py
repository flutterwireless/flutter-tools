
#!/usr/bin/python
import serial
import serial.tools.list_ports
import subprocess
import time

def check_port():
    port_list = serial.tools.list_ports.comports()
    found = False
    for port in port_list:
        if "ACM0BL" in port[0]:
            found = True
    return found


if __name__ == "__main__":
    while True:
        try:
            if check_port():
                pwd = subprocess.check_output("pwd",shell=True).split('\n')[0]+'/'
                subprocess.call("{directory}bossac -i -d --port=ttyACM0BL -e -w -v -b FLUTTER_CAL.bin -R".format(directory=pwd), shell=True)
                subprocess.call("figlet Done", shell=True)
                time.sleep(1)
                while check_port():
                    time.sleep(1)
        except:
            time.sleep(1)
