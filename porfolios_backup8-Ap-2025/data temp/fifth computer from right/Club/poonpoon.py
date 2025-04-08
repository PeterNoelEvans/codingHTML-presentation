import turtle
poonpoon=turtle.Turtle()
screen=turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('skyblue')
poonpoon.shape('turtle')
poonpoon.pensize(2)
poonpoon.speed(5)
length = 130
angle = 90
poonpoon.penup()
poonpoon.goto(-500,-300)
poonpoon.pendown()
poonpoon.forward(length*9)
poonpoon.left(90)
poonpoon.forward(length*6)
poonpoon.left(90)
poonpoon.forward(length*9)
poonpoon.left(90)
poonpoon.forward(length*6)
poonpoon.left(90)

poonpoon.color('red')
poonpoon.begin_fill()
poonpoon.forward(length*9)
poonpoon.left(90)
poonpoon.forward(length*1)
poonpoon.left(90)
poonpoon.forward(length*9)
poonpoon.left(90)
poonpoon.forward(length*1)
poonpoon.end_fill()


poonpoon.backward(length)
poonpoon.left(angle)


poonpoon.color('white')
poonpoon.begin_fill()
poonpoon.forward(length*9)
poonpoon.left(90)
poonpoon.forward(length*1)
poonpoon.left(90)
poonpoon.forward(length*9)
poonpoon.left(90)
poonpoon.forward(length*1)
poonpoon.end_fill()


poonpoon.backward(length)
poonpoon.left(angle)



poonpoon.color('blue')
poonpoon.begin_fill()
poonpoon.forward(length*9)
poonpoon.left(90)
poonpoon.forward(length*1)
poonpoon.left(90)
poonpoon.forward(length*9)
poonpoon.left(90)
poonpoon.forward(length*1)
poonpoon.end_fill()


poonpoon.backward(length)
poonpoon.left(angle)


poonpoon.color('blue')
poonpoon.begin_fill()
poonpoon.forward(length*9)
poonpoon.left(90)
poonpoon.forward(length*1)
poonpoon.left(90)
poonpoon.forward(length*9)
poonpoon.left(90)
poonpoon.forward(length*1)
poonpoon.end_fill()


poonpoon.backward(length)
poonpoon.left(angle)













poonpoon.pendown()

turtle.exitonclick()