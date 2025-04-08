import turtle 
po = turtle.Turtle()
po.shape('turtle')
po.shapesize(3)
po.pensize(3)
po.color('green')

po.color('skyblue')
po.begin_fill()
po.forward(200)
po.right(90)
po.forward(100)
po.right(90)
po.forward(200)
po.right(90)
po.forward(100)
po.end_fill()

po.color('red')
po.begin_fill()
po.right(30)
po.forward(200)
po.right(120)
po.forward(200)
po.right(120)
po.forward(200)
po.end_fill()

po.left(90) 
po.forward(100)
po.left(90)
po.forward(200)
po.left(90)
po.forward(100)
po.hideturtle()

circleTurtle = turtle.Turtle()
circleTurtle.penup()
circleTurtle.goto(100,-200)
circleTurtle.pendown()
circleTurtle.circle(300)

def sun():
sun=turtle.Turtle()
sun











turtle.exitonclick()