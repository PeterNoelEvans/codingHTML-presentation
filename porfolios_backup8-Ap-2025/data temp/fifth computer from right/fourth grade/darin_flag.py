import turtle

screen = turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('SKYBLUE')
darin=turtle.Turtle()
darin.speed(10)
darin.shape('turtle')
darin.shapesize(1)
radius = 200
darin.color('black')
length = 100
angle = 90
darin.fillcolor('red')
darin.begin_fill()


darin.forward(length*9)
darin.left(angle)

darin.forward(length*6)
darin.left(angle)

darin.forward(length*9)
darin.left(angle)

darin.forward(length*6)
darin.left(angle)








turtle.exitonclick()