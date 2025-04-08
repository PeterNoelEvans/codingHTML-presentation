import turtle
pi=turtle.Turtle()		
pi.shapesize(2)
pi.shape('turtle')
screen=turtle.Screen()
screen.setup(2000,1800,0,0)
turtle.bgcolor('skyblue')
pi.speed(10)
pi.penup()
pi.goto(-500,-300)
pi.pendown()

length = 130
angle = 90

pi.forward(length*9)
pi.left(angle)
pi.forward(length*6)
pi.left(angle)
pi.forward(length*9)
pi.left(angle)
pi.forward(length*6)
pi.left(angle)

pi.color('red')
pi.begin_fill()
pi.forward(length*9)
pi.left(angle)
pi.forward(length*1)
pi.left(angle)
pi.forward(length*9)
pi.left(angle)
pi.forward(length*1)
pi.left(angle)
pi.end_fill()

pi.right(angle)
pi.backward(length)
pi.left(angle)
pi.color('blue')
pi.begin_fill()
pi.forward(length*9)
pi.left(angle)
pi.forward(length*1)
pi.left(angle)
pi.forward(length*9)
pi.left(angle)
pi.forward(length*1)
pi.left(angle)
pi.end_fill()










turtle.exitonclick()