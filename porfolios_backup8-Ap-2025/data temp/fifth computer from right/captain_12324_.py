import turtle
c = turtle.Turtle()
c.pensize =(1)
c.speed(0)
radius = 100

c.circle(radius)
for i in range(72):
    c.circle(-radius)
    c.circle(radius, 5)

turtle.exitonclick()