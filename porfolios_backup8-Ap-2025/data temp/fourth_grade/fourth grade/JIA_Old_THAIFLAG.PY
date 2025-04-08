import turtle
window = turtle.Screen()
window.setup(2000,1800,0,0)
window.bgcolor('skyblue')

JIA = turtle.Turtle()
JIA.shape('turtle')
JIA.shapesize(3)
JIA.speed(0)
angle = 90
length=100
JIA.penup()
JIA.goto(-400,-300)
JIA.pendown()


JIA.fillcolor('#A51931')
JIA.begin_fill()
JIA.begin_fill()
JIA.forward(length*9)
JIA.left(angle)
JIA.forward(length*6)
JIA.left(angle)
JIA.forward(length*9)
JIA.left(angle)
JIA.forward(length*6)
JIA.left(angle)
JIA.end_fill()







turtle.exitonclick()