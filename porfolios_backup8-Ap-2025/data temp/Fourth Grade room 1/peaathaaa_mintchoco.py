import turtle
peta = turtle.Turtle()
peta.pensize(2)
peta.speed(0)

radius=100

peta.circle(radius)
for i in range(72):
	peta.circle(-radius)
	peta.circle(radius,5)



turtle.exitonclick()