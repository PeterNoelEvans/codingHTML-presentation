import turtle
window=turtle.Screen()
window.setup(2000,1000,0,0)
window.bgcolor('skyblue')

pen=turtle.Turtle()
pen.shapesize(3)
pen.shape('turtle')
pen.forward(length)
pen.left(angle)

pen.penup()
pen.goto(x=-400,y=-200)
pen.pendown()

step=80
pen.forward(step*9)
pen.lefe(90)
pen.forward(step*6)
pen.lefe(90)
pen.forward(step*6)
pen.lefe(90)
pen.forward(step*6)



	
turtle.exitonclick()