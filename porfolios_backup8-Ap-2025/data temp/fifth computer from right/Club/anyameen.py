import turtle
window = turtle.Screen()


window.setup(2000,1800,0,0)

ma=turtle.Turtle()
ma.shape('turtle')
ma.pensize(3)
ma.penup()
ma.goto(0,0)
ma.pendown()
ma.speed(0)

radius=200

ma.fillcolor('red')
ma.begin_fill()
ma.circle(radius)
ma.end_fill()
ma.circle(radius)
ma.fillcolor('blue')
ma.begin_fill()
ma.circle(radius-25)





turtle.exitonclick()