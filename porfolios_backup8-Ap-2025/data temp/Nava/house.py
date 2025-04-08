import turtle
screen=turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('skyblue')
n=turtle.Turtle()
n.speed(0)

def house():
	n.color('gray')
	n. begin_fill()
	n.forward(200)
	n.right(90)
	n.forward(100)
	n.right(90)
	n.forward(200)
	n.right(90)
	n.forward(100)
	n.end_fill()

	n.color('brown')
	n.begin_fill()/
	n.forward(200)
	n.right(120)
	n.forward(200)
	n.end_fill()
	n.penup()
	n.hideturtle()



def sun():
	sun = turtle.Turtle()
	sun.color('red')
	sun.begin_fill()
	sun.circle(100)
	sun.end_fill()
	sun.hideturtle()


sun()
house()
sun()
house()




turtle.exitonclick()
