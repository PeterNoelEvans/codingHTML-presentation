import turtle
c = turtle.Turtle()
c.pensize(1)
c.speed(0)

size = 250

for i in range(360):
	for i in range(4):
		c.forward(size)
		c.left(90)
	c.left(1)

turtle.exitonclick()