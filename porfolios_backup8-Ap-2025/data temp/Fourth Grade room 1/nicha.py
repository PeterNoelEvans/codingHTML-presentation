import turtle
window = turtle.Screen()
window.bgcolor('skyblue')
window.setup(2000,1800,0,0)
nicha=turtle.Turtle()
nicha.speed(0)
nicha.shape('turtle')
nicha.shapesize(2)
nicha.pensize(3)
step = 100
radius= 200

elephant = turtle.Turtle()
window.addshape("1855-1893.gif")


def draw_square_red():
	nicha.penup()
	nicha.goto(-300,-300)
	nicha.pendown()
	nicha.color('#A51931') # red
	nicha.begin_fill()
	nicha.forward(step*9)
	nicha.left(90)
	nicha.forward(step*6)
	nicha.left(90)
	nicha.forward(step*9)
	nicha.left(90)
	nicha.forward(step*6)
	nicha.left(90)
	nicha.end_fill()

draw_square_red()
elephant.shape("1855-1893.gif")
nicha.goto(-300,-0)

nicha.right(90)
nicha.forward(500)







turtle.exitonclick()