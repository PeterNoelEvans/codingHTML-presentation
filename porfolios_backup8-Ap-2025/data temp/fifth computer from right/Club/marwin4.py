import turtle
wn = turtle.Screen()
wn.setup(2000,1800,0,0)
marwin=turtle.Turtle()
marwin.speed(10)
marwin.pensize(5)

marwin.shape('turtle')
marwin.shapesize(2, 2, 2)

radius = 100
marwin.penup()
marwin.goto(-300,-450)
marwin.pendown()

marwin.fillcolor('red')
marwin.begin_fill()
marwin.circle(radius)
marwin.end_fill()

marwin.circle(radius,180)
marwin.left(180)

marwin.color('slate blue')
marwin.begin_fill()
marwin.circle(radius)
marwin.end_fill()

marwin.circle(radius,180)
marwin.left(180)

marwin.color('maroon')
marwin.begin_fill()
marwin.circle(radius)
marwin.end_fill()
marwin.circle(radius,180)
marwin.left(180)

marwin.color('chartreuse')
marwin.begin_fill()
marwin.circle(radius)
marwin.end_fill()

turtle.exitonclick()