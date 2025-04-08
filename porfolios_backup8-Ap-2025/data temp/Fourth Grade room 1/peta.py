import turtle
window=turtle.Screen()
window.setup(15000,1000,0,0)
window.bgcolor('skyblue')
peta=turtle.Turtle()

def draw_square_red():
peta.color('#A51931') # red
peta.begin_fill()
peta.forward(step*9)
peta.left(90)
peta.forward(step*1)
peta.left(90)
peta.forward(step*9)
peta.left(90)
peta.forward(step*1)
peta.left(90)
peta.end_fill()

peta.right(90)
peta.backward(step)
peta.left(90)

def draw_square_white():
peta.color('#F4F5F8')#white	
peta.begin_fill()
peta.forward(step*9)
peta.left(90)
peta.forward(step*1)
peta.left(90)
peta.forward(step*9)
peta.left(90)
peta.forward(step*1)	
peta.left(90)
peta.end_fill()
peta.right(90)
peta.backward(step)
peta.left(90)
def draw_square_blue():
peta.color('#2D2A4A') #blue
peta.begin_fill()
peta.forward(step*9)
peta.left(90)
peta.forward(step*1)
peta.left(90)
peta.forward(step*9)
peta.left(90)
peta.forward(step*1)
peta.left(90
peta.end_fill()

peta.right(90)
peta.backward(step)
peta.left(90)


draw_square_red()
draw_square_white()
draw_square_blue()
draw_square_blue()
draw_square_white()
draw_square_red()


peta.pendown()
peta.pensize(10)
peta.right(90)
peta.pencolor('black')
peta.pensize(10)
peta.forward()










turtle.exitonclick()