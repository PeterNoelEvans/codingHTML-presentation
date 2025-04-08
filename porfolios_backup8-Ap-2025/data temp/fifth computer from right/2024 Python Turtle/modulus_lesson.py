import time # import the time module so you can slow the code down.

for i in range(0,50): # i will start at 0 and slowly cycle through all numbers up to, but not including 50
	print(i, 'modulus 10 = ', i%10) # print on the screen i modulus 10 = _
	time.sleep(0.5) # use sleep in the time module to slow the code down to once every half second
	if i%10 == 0: # if the modulus equation is equal to 0 print the blank line
		print('') # blank line