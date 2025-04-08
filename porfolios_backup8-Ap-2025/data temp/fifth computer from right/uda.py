import turtle
import time
uda = turtle.Turtle()	
screen = turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('udablue')

uda.goto(-400,-300)
uda.speed(0)

length = 130
angle = 90

uda.forward(length*9)
uda.left(angle)
uda.forward(length*6)
uda.left(angle)
uda.forward(length*9)
uda.left(angle)
uda.forward(length*6)
uda.left(angle)


uda.color('#A51931')
uda.begin_fill()
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.end_fill()

uda.right(90)
uda.backward(length)
uda.left(90)


uda.fillcolor('#FFFFFF')
uda.begin_fill()
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.end_fill()

uda.right(90)
uda.backward(length)
uda.left(90)


uda.color('#2D2A4A')
uda.begin_fill()
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.end_fill()

uda.right(90)
uda.backward(length)
uda.left(90)


uda.color('#2D2A4A')
uda.begin_fill()
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.end_fill()


uda.right(90)
uda.backward(length)
uda.left(90)



uda.color('#FFFFFF')
uda.begin_fill()
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.end_fill()


uda.right(90)
uda.backward(length)
uda.left(90)



uda.color('#A51931')
uda.begin_fill()
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.forward(length*9)
uda.left(angle)
uda.forward(length*1)
uda.left(angle)
uda.end_fill()


uda.right(90)
uda.backward(length)
uda.left(90)
uda.right(90)

uda.color('black')
uda.pensize(15)
uda.forward(length*9+100)


time.sleep(3)
uda.clear()

uda = turtle.Turtle()
uda.setheading(0)

uda.forward(length*6)
uda.left(angle)
uda.forward(length*9)
uda.left(angle)
uda.forward(length*6)
uda.left(angle)
uda.forward(length*9)

turtle.exitonclick()