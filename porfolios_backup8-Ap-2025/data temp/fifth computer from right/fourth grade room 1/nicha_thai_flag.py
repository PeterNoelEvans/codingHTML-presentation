import turtle
window=turtle.Screen()
window.setup(15000,1000,0,0)
window.bgcolor('skyblue')
nicha=turtle.Turtle()
nicha.speed(0)
nicha.shape('turtle')
nicha.shapesize(3)
nicha.penup()
nicha.goto(x=-400,y=-200)
nicha.pendown()
step=80

def draw_square():
	nicha.forward(step*9)
	nicha.left(90)
	nicha.forward(step*6)
	nicha.left(90)
	nicha.forward(step*9)
	nicha.left(90)
	nicha.forward(step*6)
	nicha.left(90)

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


draw_square()
draw_square_red()
draw_square_white()
draw_square_blue()
draw_square_blue()
draw_square_white()
draw_square_red()



turtle.exitonclick()

