import turtle
c = turtle.Turtle()
c.pensize(1)
c.speed(0)
angle = 90
distance = 200

def square():
	for _ in range(4):
		c.forward(distance)
		c.left(angle)
	c.left(20)
for _ in range(18):
	square()

turtle.exitonclick()                     