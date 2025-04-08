import turtle
window = turtle.Screen()
window.setup(2000,1800,0,0)
window.bgcolor('skyblue')
length=100


nioun=turtle.Turtle()
nioun.speed(0)
nioun.fillcolor('turquoise')
nioun.penup()
nioun.begin_fill()
nioun.forward(1000)
nioun.right(90)
nioun.forward(1000)
nioun.right(90)
nioun.forward(2000)
nioun.right(90)
nioun.forward(1000)
nioun.right(90)
nioun.forward(1000)
nioun.end_fill()

def boat():
	nioun.color('gray60')
	nioun.begin_fill()
	point1 = nioun.pos()
	print(point1)
	nioun.pendown()
	nioun.forward(100)
	nioun.left(90)
	nioun.forward(100)
	nioun.left(90)
	nioun.forward(100)
	nioun.goto(point1)
	nioun.end_fill()

nioun.penup()
nioun.goto(-50,-240)
nioun.left(90)
nioun.pensize(3)
nioun.pendown()
nioun.forward(400)
nioun.right(45)
nioun.forward(300)
nioun.right(45)
nioun.forward(300)
nioun.right(90)
nioun.forward(400)
nioun.right(90)
nioun.forward(510)

nioun.penup()
nioun.goto(-50,-240)
nioun.pendown()

boat()




turtle.exitonclick()