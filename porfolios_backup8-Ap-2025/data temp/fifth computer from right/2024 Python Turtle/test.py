import time

counter = 0
colors = ['firebrick', 'firebrick1', 'firebrick2', 'firebrick3', 'firebrick4', 'floralwhite', 'forestgreen', 'gainsboro', 'ghostwhite', 'gold1']

for i in range(1,101):
	for color in colors:
		counter += 1
		print(counter, color)
		time.sleep(1)
	if i % 10 == 0:
		y = y - radius*2
		


