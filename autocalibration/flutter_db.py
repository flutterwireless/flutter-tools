
#!/usr/bin/python
import serial
import serial.tools.list_ports
import subprocess
import time
import sqlite3
import sys

sqlite_file = 'flutter_calibration_db.sqlite'    # name of the sqlite database file
table_name = 'flutter_calibrations'	# name of the table to be created
field_ID = 'CPU_ID' # name of the column
field_ID_type = 'INTEGER'  # column data type
field_offset = 'radio_offset' # name of the column
field_offset_type = 'INTEGER'  # column data type

def check_port():
    port_list = serial.tools.list_ports.comports()
    found = False
    for port in port_list:
        if "ACM0TS" in port[0]:
            found = True
    return found

def update_db(id, offset):
    # Connecting to the database file
    conn = sqlite3.connect(sqlite_file)
    c = conn.cursor()
    # Creating a second table with 1 column and set it as PRIMARY KEY
    # note that PRIMARY KEY column must consist of unique values!
    try:
        c.execute('CREATE TABLE flutter_calibrations (CPU_ID CHARACTER(32), radio_offset INTEGER, record_date DATETIME)')
    except sqlite3.OperationalError:
        print('Table already exists, skipping table creation.')

    print("saving to database: " + id + " " + str(offset))
    # Insert a row of data
    c.execute("INSERT INTO flutter_calibrations (CPU_ID, radio_offset, record_date) VALUES (\"{id_string}\", {cal}, CURRENT_TIMESTAMP)".\
        format( id_string=id, cal=offset))

    # Committing changes and closing the connection to the database file
    conn.commit()
    conn.close()

def read_calibration():
    serialPort = serial.Serial(timeout=1)
    serialPort.baudrate = 115200
    serialPort.port = "/dev/ttyACM0TS"
    serialPort.open()
    match_string = "Flutter Calibration Data. VAL:"
    if serialPort.isOpen():
        while True:
            s = serialPort.readline()
            if match_string in s:
                serialPort.close()
                with open("test.txt", "a") as myfile:
                    myfile.write(s)
                    print s
                    valstart = s.find("VAL:")+4
                    calvalue = int(s[valstart:valstart+7])
                    print calvalue
                    id_start = s.find("ID: ")+4
                    id_value = s[id_start:id_start+32]
                    print id_value
                    update_db(id_value, calvalue)
                    return



if __name__ == "__main__":
    while True:
        try:
            if check_port():
                read_calibration()
                time.sleep(1)
                while check_port():
                    time.sleep(1)
        except:
            e = sys.exc_info()[0]
            print repr(e)
            time.sleep(1)
        print "-"
        time.sleep(1)
