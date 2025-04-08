
import turtle
captain = turtle.Turtle()
#captain.speed(0)
captain.speed(0)

def square():
	for i in range(4):
		captain.forward(400)
		captain.left(90)
		captain.forward(400)
		captain.left(90)
		captain.forward(400)
		captain.left(90)
		captain.forward(400)
		captain.left(90)
		captain.left(90)

square()
captain.left(10)
square()
captain.left(10)
square()
captain.left(10)
square()
captain.left(10)
square()
captain.left(10)
square()
captain.left(10)
square()
captain.left(10)
square()
captain.left(10)
square()
captain.left(10)
square()

turtle.exitonclick()