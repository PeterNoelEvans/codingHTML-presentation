import turtle
jia = turtle.Turtle() 
jia.pensize(2)
jia.speed(0)

radius = 100

jia.circle(radius)
for x in range(72):
	jia.circle(-radius)
	jia.circle(radius, 5)


turtle.exitonclick()