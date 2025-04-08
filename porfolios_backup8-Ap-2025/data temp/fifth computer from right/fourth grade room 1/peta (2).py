import turtle
window = turtle.Screen()
window.setup(2000,1800,0,0)
peta=turtle.Turtle()
peta.shape('turtle')
peta.shapesize(2)
peta.pensize(3)

radius= 200
peta.color('blue')
peta.begin_fill()
peta.circle(radius)
peta.end_fill()



peta.color('blueviolet')
peta.begin_fill()
peta.circle(radius-25)
peta.end_fill()


peta.color('pink')
peta.begin_fill()
peta.circle(radius-50)
peta.end_fill()


peta.color('cornsilk4')
peta.begin_fill()
peta.circle(radius-75)
peta.end_fill()


peta.color('aqua')
peta.begin_fill()
peta.circle(radius-100)
peta.end_fill()
turtle.exitonclick()