import turtle
uda=turtle.Turtle()		
uda.shapesize(2)
uda.shape('turtle')
screen=turtle.Screen()
screen.setup(2000,1800,0,0)
turtle.bgcolor('skyblue')
uda.speed(10)
uda.penup()
uda.goto(-500,-300)
uda.pendown()

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

uda.right(angle)
uda.backward(length)
uda.left(angle)

uda.color('#F4F5F8')
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
uda.right(angle)
uda.backward(length)
uda.left(angle)


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

uda.end_fill()
uda.right(angle)
uda.backward(length)
uda.left(angle)


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

uda.end_fill()
uda.right(angle)
uda.backward(length)
uda.left(angle)


uda.color('#F4F5F8')
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
uda.right(angle)
uda.backward(length)
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







turtle.exitonclick()