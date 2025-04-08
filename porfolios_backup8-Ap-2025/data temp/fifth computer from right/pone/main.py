from machine import Pin, I2C
import time

# Initialize I2C for both RTC and LCD
SDA_PIN = 21
SCL_PIN = 22
i2c = I2C(0, sda=Pin(SDA_PIN), scl=Pin(SCL_PIN), freq=400000)

# RTC and LCD addresses
RTC_ADDRESS = 0x68
LCD_ADDRESS = 0x27  # Change this if your LCD uses a different address

# Import the LCD driver
import i2c_lcd

# Setup LCD (Assuming a 2x16 LCD)
lcd_columns = 16
lcd_rows = 2
lcd = i2c_lcd.I2cLcd(i2c, LCD_ADDRESS, lcd_rows, lcd_columns)

# Function for BCD to decimal conversion
def bcd_to_decimal(bcd):
    return (bcd & 0x0F) + ((bcd >> 4) * 10)

# Function to read time from DS3231 RTC
def read_time(i2c):
    data = i2c.readfrom_mem(RTC_ADDRESS, 0x00, 7)
    seconds = bcd_to_decimal(data[0])
    minutes = bcd_to_decimal(data[1])
    hours = bcd_to_decimal(data[2] & 0x3F)  # Convert 24-hour format
    day = bcd_to_decimal(data[4])
    month = bcd_to_decimal(data[5])
    year = bcd_to_decimal(data[6]) + 2000  # Adjust for years since 2000
    return year, month, day, hours, minutes, seconds

# Main loop
while True:
    # Read current time
    year, month, day, hours, minutes, seconds = read_time(i2c)

    # Format date and time
    date_str = "{:02d}/{:02d}/{:04d}".format(day, month, year)
    time_str = "{:02d}:{:02d}:{:02d}".format(hours, minutes, seconds)

    # Display date and time on the LCD
    lcd.clear()
    lcd.move_to(0, 0)
    lcd.putstr(date_str)
    lcd.move_to(0, 1)
    lcd.putstr(time_str)

    # Update every second
    time.sleep(1)
