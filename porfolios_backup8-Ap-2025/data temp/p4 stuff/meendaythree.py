import turtle
meen=turtle.Turtle()
screen=turtle.Screen()
meen.shape("turtle")
meen.shapesize(2)


meen.penup()
meen.goto(0,-300)
meen.pendown()
turtle.bgcolor("SlateGrey")
meen.pensize(5)
meen.color('green','yellow')
meen.shape("turtle")
meen.speed(10)


def smallcircle():
	meen.color("green",'yellow')
	meen.begin_fill()
	meen.circle(50)
	meen.end_fill()



meen.circle(300,45)
smallcircle()
meen.circle(300,45)
smallcircle()
meen.circle(300,45)
smallcircle()
meen.circle(300,45)
smallcircle()
meen.circle(300,45)
smallcircle()
meen.circle(300,45)
smallcircle()
meen.circle(300,45)
smallcircle()
meen.circle(300,45)
smallcircle()

meen.hideturtle()

turtle.exitonclick()