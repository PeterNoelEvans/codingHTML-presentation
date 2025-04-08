import turtle
sky =turtle.Turtle()		
sky.shape("turtle")
sky.shapesize(2)
sky.pensize(3)
screen=turtle.Screen()
screen.setup(2000,1800,0,0)
turtle.bgcolor('pink')
sky.speed(10)
radius = 200

sky.color("red")
sky.begin_fill()
sky.circle(radius)
sky.end_fill()

sky.color('blue')
sky.begin_fill()
sky.circle(radius - 25)
sky.end_fill()

sky.color("green")
sky.begin_fill()
sky.circle(radius - 50)
sky.end_fill()

sky.color("yellow")
sky.begin_fill()
sky.circle(radius - 75)
sky.end_fill()

sky.color("red")
sky.begin_fill()
sky.circle(-radius)
sky.end_fill()

sky.color("blue")
sky.begin_fill()
sky.circle(-radius+25)
sky.end_fill()

sky.color("green")
sky.begin_fill()
sky.circle(-radius+50)
sky.end_fill()

sky.color("yellow")
sky.begin_fill()
sky.circle(-radius+75)
sky.end_fill()



turtle.exitonclick()