import turtle
window=turtle.Screen()
window.setup(15000,1000,0,0)
window.bgcolor('skyblue')
nicha=turtle.Turtle()
step = 100


nicha.goto(-300,-300)
def draw_square_red():
	nicha.color('#A51931') # red
	nicha.begin_fill()
	nicha.forward(step*9)
	nicha.left(90)
	nicha.forward(step*1)
	nicha.left(90)
	nicha.forward(step*9)
	nicha.left(90)
	nicha.forward(step*1)
	nicha.left(90)
	nicha.end_fill()

	nicha.right(90)
	nicha.backward(step)
	nicha.left(90)

def draw_square_white():
	nicha.color('#F4F5F8')#white
	nicha.begin_fill()
	nicha.forward(step*9)
	nicha.left(90)
	nicha.forward(step*1)
	nicha.left(90)
	nicha.forward(step*9)
	nicha.left(90)
	nicha.forward(step*1)
	nicha.left(90)
	nicha.end_fill()

	nicha.right(90)
	nicha.backward(step)
	nicha.left(90)

def draw_square_blue():
	nicha.color('#2D2A4A') #blue
	nicha.begin_fill()
	nicha.forward(step*9)
	nicha.left(90)
	nicha.forward(step*1)
	nicha.left(90)
	nicha.forward(step*9)
	nicha.left(90)
	nicha.forward(step*1)
	nicha.left(90)
	nicha.end_fill()

	nicha.right(90)
	nicha.backward(step)
	nicha.left(90)


draw_square_red()
draw_square_white()
draw_square_blue()
draw_square_blue()
draw_square_white()
draw_square_red()

nicha.pensize(15)
nicha.pencolor('black')
nicha.right(90)
nicha.forward(720)
nicha.right(180)
nicha.forward(720)


turtle.exitonclick()

