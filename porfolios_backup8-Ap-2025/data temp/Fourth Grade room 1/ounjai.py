import turtle
ounjai =turtle.Turtle()		
ounjai.shape("turtle")
ounjai.shapesize(2)
ounjai.pensize(3)
screen=turtle.Screen()
screen.setup(2000,1800,0,0)
turtle.bgcolor('pink')
ounjai.speed(10)
radius = 300


ounjai.circle(radius)
ounjai.circle(radius-50)

	
turtle.exitonclick()
