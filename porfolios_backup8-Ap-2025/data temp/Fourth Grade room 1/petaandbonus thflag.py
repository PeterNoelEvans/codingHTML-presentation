import turtle
window = turtle.Screen()
window.bgcolor('skyblue')
window.setup(2000,1800,0,0)

peta=turtle.Turtle()
peta.shape('turtle')
peta.shapesize(2)
peta.pensize(3)
step = 100
radius= 200

elephant = turtle.Turtle()
window.addshape("1855-1893.gif")


def draw_square_red():
	peta.penup()
	peta.goto(-300,-300)
	peta.pendown()
	peta.color('#A51931') # red
	peta.begin_fill()
	peta.forward(step*9)
	peta.left(90)
	peta.forward(step*6)
	peta.left(90)
	peta.forward(step*9)
	peta.left(90)
	peta.forward(step*6)
	peta.left(90)
	peta.end_fill()

draw_square_red()
elephant.shape("1855-1893.gif")
peta.goto(-100,-00)

turtle.exitonclick()