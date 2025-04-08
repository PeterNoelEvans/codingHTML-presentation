import turtle
n=turtle.Turtle()		
n.shapesize(2)
n.shape('turtle')
screen=turtle.Screen()
screen.setup(2000,1800,0,0)
turtle.bgcolor('skyblue')
n.speed(10)
n.penup()
n.goto(-500,-300)
n.pendown()

length = 130
angle = 90

n.forward(length*9)
n.left(angle)
n.forward(length*6)
n.left(angle)
n.forward(length*9)
n.left(angle)
n.forward(length*6)
n.left(angle)


n.color('#DA251D')
n.begin_fill()
n.forward(length*9)
n.left(angle)
n.forward(length*6)
n.left(angle)
n.forward(length*9)
n.left(angle)
n.forward(length*6)
n.left(angle)
n.end_fill()


n.begin_fill()
n.forward(length*9)
n.left(angle)
n.forward(length*6)
n.left(angle)
n.forward(length*9)
n.left(angle)
n.forward(length*6)
n.left(angle)
n.end_fill()
n.penup
n.left(45)
n.forward(515)
n.color('white')
n.begin_fill()
n.circle(70)
n.end_fill()






turtle.exitonclick()