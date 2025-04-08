import turtle
wn = turtle.Screen()
wn.setup(2000,1800,0,0)

c=turtle.Turtle()
c.shape('turtle')
c.shapesize(2)
c.speed(0)

c.pu()
c.goto(0,-400)
c.pd()

radius = 5
for i in range(100):
	c.circle(radius*4)
	radius=radius+2


turtle.exitonclick()