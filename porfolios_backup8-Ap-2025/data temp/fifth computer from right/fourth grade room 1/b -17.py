import turtle

screen = turtle.Screen()
screen.bgcolor('skyblue')
screen.setup(2000,1800,0,0)
n = turtle.Turtle()
n.speed(0)
n.goto(-300,-300)
length = 100
angle = 90

n.forward(length*9)
n.forward(length*6)
n.left(angle)
n.left(angle)
n.forward(length*9)
n.left(angle)
n.forward(length*6)
n.left(angle)



n.color('#A51931') # red
n.begin_fill()
n.forward(length*9)
n.left(angle)
n.forward(length*6)
n.left(angle)
n.forward(length*9)
n.end_fill()













n.forward(length*9)
n.forward(length*6)
n.left(angle)
n.left(angle)
n.forward(length*9)
n.left(angle)
n.forward(length*6)
n.left(angle)



n.color('#A51931') # red
n.begin_fill()
n.forward(length*9)
n.left(angle)
n.forward(length*6)
n.left(angle)
n.forward(length*9)
n.end_fill()
















































































turtle.exitonclick()
