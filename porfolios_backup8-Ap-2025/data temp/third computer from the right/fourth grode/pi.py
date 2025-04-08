import turtle
screen=turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('lime')

pi=turtle.Turtle()
pi.shape("turtle")
pi.shapesize(2)
pi.color('crimson')
pi.pensize(2)
radius = 300

pi.pu()
pi.goto(0,-300)
pi.pd()

pi.circle(radius - 25)
pi.circle(radius - 50)
pi.circle(radius - 75)
pi.circle(radius - 100)
pi.circle(radius - 125)

turtle.exitonclick()