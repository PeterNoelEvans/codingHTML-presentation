import turtle
khun=turtle.Turtle()		
khun.shapesize(2)
khun.shape('turtle')
screen=turtle.Screen()
screen.setup(2000,1800,0,0)
turtle.bgcolor('skyblue')
khun.speed(10)
khun.penup()
khun.goto(-500,-300)
khun.pendown()

length = 130
angle = 90

khun.forward(length*9)
khun.left(angle)
khun.forward(length*6)
khun.left(angle)
khun.forward(length*9)
khun.left(angle)
khun.forward(length*6)
khun.left(angle)


khun.color('#DA251D')
khun.begin_fill()
khun.forward(length*9)
khun.left(angle)
khun.forward(length*6)
khun.left(angle)
khun.forward(length*9)
khun.left(angle)
khun.forward(length*6)
khun.left(angle)
khun.end_fill()

turtle.exitonclick()