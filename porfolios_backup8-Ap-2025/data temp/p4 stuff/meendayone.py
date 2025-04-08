import turtle

meen = turtle.Turtle()
meen.speed(2)

meen.penup()
meen.back(500)
meen.left(90)
meen.back(300)
meen.right(90)
meen.pendown()


def square():
	# this is a square
	meen.color("red")
	meen.begin_fill() 
	meen.forward(100)
	meen.left(90)
	meen.forward(100)
	meen.left(90)
	meen.forward(100)
	meen.left(90)
	meen.forward(100)
	meen.left(90)
	meen.end_fill()
   

def circle():
	# this is a circle
	meen.color("yellow")
	meen.begin_fill()
	meen.circle(50)
	meen.end_fill()

square()
meen.forward(150)
circle()
meen.forward(50)
square()
meen.forward(150)
circle()
meen.forward(50)
square()
meen.forward(150)
circle()
meen.forward(50)
square()
meen.forward(150)
circle()
meen.forward(50)
square()
meen.forward(150)
circle()
meen.forward(50)
square()
meen.forward(150)
circle()
turtle.exitonclick()
                                      
