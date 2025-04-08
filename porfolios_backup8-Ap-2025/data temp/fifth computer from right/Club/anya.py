import turtle
anya = turtle.Turtle()
anya.speed(5)
anya.shape('turtle')

radius = 200

anya.fillcolor('yellow')
anya.begin_fill()
anya.circle(radius)
anya.end_fill()

anya.color('red', 'red')
anya.begin_fill()
anya.circle(radius - 30)
anya.end_fill()

anya.color('yellow', 'yellow')
anya.begin_fill()
anya.circle(radius - 60)
anya.end_fill()

anya.color('red', 'red')
anya.begin_fill()
anya.circle(radius - 90)
anya.end_fill()

anya.color('yellow', 'yellow')
anya.begin_fill()
anya.circle(radius - 120)
anya.end_fill()

anya.color('red', 'red')
anya.begin_fill()
anya.circle(radius - 150)
anya.end_fill()
anya.circle(radius)
radius = -200

anya.fillcolor('yellow')
anya.begin_fill()
anya.circle(radius)
anya.end_fill()
anya.circle(radius + 30)
anya.end_fill()

anya.color('yellow', 'yellow')
anya.begin_fill()
anya.circle(radius + 60)
anya.end_fill()

anya.color('red', 'red')
anya.begin_fill()

anya.end_fill()

anya.color('yellow', 'yellow')
anya.begin_fill()
anya.circle(radius + 120)
anya.end_fill()

anya.color('red', 'red')
anya.begin_fill()
anya.circle(radius + 150)
anya.end_fill()

anya.color('yellow', 'yellow')
anya.end_fill()



turtle.exitonclick()