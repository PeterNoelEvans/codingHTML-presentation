from machine import Pin, I2C
import time

# Initialize I2C
SDA_PIN = 21
SCL_PIN = 22
i2c = I2C(0, sda=Pin(SDA_PIN), scl=Pin(SCL_PIN), freq=400000)

# Define the RTC address
RTC_ADDRESS = 0x68

# Functions for BCD conversion
def decimal_to_bcd(decimal):
    return (decimal // 10) << 4 | (decimal % 10)

def set_time(i2c, year, month, day, weekday, hours, minutes, seconds):
    data = bytearray([
        decimal_to_bcd(seconds),
        decimal_to_bcd(minutes),
        decimal_to_bcd(hours),
        decimal_to_bcd(weekday),
        decimal_to_bcd(day),
        decimal_to_bcd(month),
        decimal_to_bcd(year - 2000)
    ])
    i2c.writeto_mem(RTC_ADDRESS, 0x00, data)

# Replace the following line with the current time before uploading
# For example, if the current time is March 7, 2024, 14:30:00 and it's a Thursday
set_time(i2c, 2024, 3, 8, 4, 13, 56, 0)

print("Time has been set")

