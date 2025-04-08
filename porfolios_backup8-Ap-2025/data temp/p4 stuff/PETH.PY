
import turtle
n=turtle.Turtle()
n.speed=(-900)

n.shapesize(3)
screen=turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('skyblue')
n.shape('turtle')
n.pensize(2)
n.color('red')

n.begin_fill()

step = 110
n.penup()
n.goto(-400,-300)
n.pendown()
n.forward(step*9)
n.left(90)
n.forward(step*6)
n.left(90)
n.forward(step*9)
n.left(90)
n.forward(step*6)
n.left(90)
n.left(45)
n.end_fill()
n.forward(450)
n.color('white')
n.begin_fill()
#n.circle(50)
n.end_fill()








turtle.exitonclick()