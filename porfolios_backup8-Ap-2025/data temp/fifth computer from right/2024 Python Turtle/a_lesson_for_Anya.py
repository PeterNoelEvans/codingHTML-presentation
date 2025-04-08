import turtle

mack = turtle.Turtle()
screen = turtle.Screen()
screen.bgcolor('ivory')
mack.shape('turtle')
mack.speed(0)	# slow down so it is easier to see
mack.pensize(3)
radius = 30
y = 240       # we want to start the circles above the center point. Not too high!
counter = 0   # add a counter so you can see what is happening.
colors = ['firebrick', 'firebrick1', 'firebrick2', 'firebrick3', 'firebrick4', 'floralwhite', 'forestgreen', 'gainsboro', 'ghostwhite', 'gold1']

mack.forward(300)
mack.backward(300)
mack.left(90)
mack.forward(300)
mack.backward(600)
mack.forward(300)
mack.left(90)
mack.forward(300)
mack.right(180)

mack.goto(0,0)

mack.penup()  # don't write on the screen when we are moving around.
mack.goto(-270, y)
mack.pendown()

for i in range(1,101):
	mack.pendown()
	mack.fillcolor(colors[(i-1)%10])
	mack.begin_fill()
	mack.circle(radius)
	mack.end_fill()
	counter += 1
	print(counter)
	mack.penup()
	mack.forward(radius*2)   # == means when it is the same.
	if i % 10 == 0:         # this thing (%) is called Modulus.
		y = y - radius*2    # if i modulus 10 equals 0 then the pen will go left
		mack.goto(-270, y)  # 300 and down by radius*2

turtle.exitonclick()