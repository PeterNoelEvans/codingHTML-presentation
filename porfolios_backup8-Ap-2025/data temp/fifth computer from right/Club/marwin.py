import turtle	

wn = turtle.Screen()
marwin = turtle.Turtle()
marwin.speed(5)

wn.setup(2000,1800,0,0)
wn.bgcolor('darkblue')

marwin.fillcolor('lightblue')
marwin.begin_fill()
marwin.circle(radius=200)
marwin.end_fill()


marwin.fillcolor('gray')
marwin.begin_fill()
marwin.circle(radius-50)
marwin.end_fill()


marwin.fillcolor('darkorange')
marwin.begin_fill()
marwin.circle(radius-50)
marwin.end_fill()


marwin.fillcolor('pink')
marwin.begin_fill()
marwin.circle(radius-75)
marwin.end_fill()


marwin.fillcolor('purple')
marwin.begin_fill()
marwin.circle(radius-100)
marwin.end_fill()


radius = -200
marwin.fillcolor('lightblue')
marwin.begin_fill()
marwin.circle(radius)
marwin.end_fill()


marwin.fillcolor('gray')
marwin.begin_fill()
marwin.circle(radius+25)
marwin.end_fill()


marwin.fillcolor('darkorange')
marwin.begin_fill()
marwin.circle(radius+50)
marwin.end_fill()


marwin.fillcolor('pink')
marwin.begin_fill()
marwin.circle(radius+75)
marwin.end_fill()


marwin.fillcolor('purple')
marwin.begin_fill()
marwin.circle(radius+100)
marwin.end_fill()










turtle.exitonclick()