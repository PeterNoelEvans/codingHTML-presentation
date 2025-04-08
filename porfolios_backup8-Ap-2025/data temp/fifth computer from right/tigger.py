import turtle
tigger =turtle.Turtle()		
tigger.shape("turtle")
tigger.shapesize(2)
tigger.pensize(3)
screen=turtle.Screen()
screen.setup(2000,1800,0,0)
turtle.fillcolor()
tigger.speed(10)
radius = 100


tigger.circle(radius)

tigger.circle(radius-50)

tigger.circle(radius-100)

tigger.circle(radius-150)

tigger.circle(radius-200)




turtle.exitonclick()
