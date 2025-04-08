import turtle
window = turtle.Screen()
window.setup(2000,1800,0,0)
peta=turtle.Turtle()
peta.shape('turtle')
peta.shapesize(2)
peta.pensize(3)
radius= 200
window.bgcolor('skyblue')


peta.penup()
peta.goto(-400,-400)
peta.pendown()
step = 120

peta.color('white') # white
peta.begin_fill()
peta.forward(step*9)
peta.left(90)
peta.forward(step*6)
peta.left(90)
peta.forward(step*9)
peta.left(90)
peta.forward(step*6)
peta.left(90)
peta.end_fill()

peta.penup()
peta.forward(step*9/2)
peta.pendown()
peta.left(90)
peta.forward(step*6/2-radius)
peta.right(90)


peta.color('red')
peta.begin_fill()
peta.circle(radius)
peta.end_fill()



turtle.exitonclick()