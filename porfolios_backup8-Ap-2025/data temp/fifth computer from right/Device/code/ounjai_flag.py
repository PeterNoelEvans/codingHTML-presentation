import turtle
screen = turtle.Screen()
screen.setup(2000,1000,0,0)
screen.bgcolor('skyblue')
ounjai=turtle.Turtle( )
ounjai.shape('turtle')
ounjai.shapesize(1)
ounjai.pensize(3)

length = 100
angle = 90

ounjai.forward(length*9)
ounjai.left(angle)
ounjai.forward(length*6)
ounjai.left(angle)
ounjai.forward(length*9)
ounjai.left(angle)
ounjai.forward(length*6)





turtle.exitonclick()
