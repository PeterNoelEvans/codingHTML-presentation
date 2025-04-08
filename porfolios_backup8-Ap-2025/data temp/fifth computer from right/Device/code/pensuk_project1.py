import turtle
wn = turtle.Screen()
wn.setup(2000,1800,0,0)
wn.bgcolor('orange')

pensuk = turtle.Turtle()
pensuk.speed(10)
pensuk.pensize(2)
radius = 200


pensuk.fillcolor('lightblue')
pensuk.begin_fill()
pensuk.circle(radius)
pensuk.end_fill()


turtle.exitonclick()