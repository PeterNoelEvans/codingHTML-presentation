import turtle

screen = turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('SKYBLUE')
darin=turtle.Turtle()
darin.speed(10)
darin.shape('turtle')
darin.shapesize(1)
radius = 200
darin.color('pink')



darin.fillcolor('purple')
darin.begin_fill()
darin.circle(radius)
darin.end_fill()


darin.fillcolor('blue')
darin.begin_fill()
darin.circle(radius-25)
darin.end_fill()


darin.fillcolor('yellow')
darin.begin_fill()
darin.circle(radius-50)
darin.end_fill()


darin.fillcolor('pink')
darin.begin_fill()
darin.circle(radius-75)
darin.end_fill()


darin.fillcolor('orange')
darin.begin_fill()
darin.circle(radius-100)
darin.end_fill()


darin.fillcolor('green')
darin.begin_fill()
darin.circle(radius-125)
darin.end_fill()





turtle.exitonclick()