import turtle
# import mycolors

ma=turtle.Turtle()
screen=turtle.Screen()
screen.bgcolor('ivory')
ma.shape('turtle')
ma.speed(0)
ma.pensize(0.5)
radius=30
y=250
ma.penup()
ma.goto(-300,y)
ma.pendown()

for i in range(1,101):	
	ma.pendown()
	ma.circle(radius)
	ma.penup()
	ma.forward(radius*2)
	if i % 10==0:
		y=y-radius*2
		ma.goto(-300,y)
		ma.pendown()



turtle.exitonclick()


































