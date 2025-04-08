import turtle
marwin = turtle.Turtle()

marwin.color('white')
marwin.goto(200, 200)
marwin.color('blue')
marwin.fillcolor('blue')
marwin.begin_fill()
marwin.circle(80)
marwin.left(90)
marwin.forward(80 * 2)
marwin.right(90)
marwin.end_fill()


marwin.color('white')
marwin.goto(-200, 200)
marwin.color('green')
marwin.fillcolor('green')
marwin.begin_fill()
marwin.circle(80)
marwin.left(90)
marwin.forward(80 * 2)
marwin.right(90)
marwin.end_fill()


marwin.color('white')
marwin.goto(-200, -200)
marwin.color('red')
marwin.fillcolor('red')
marwin.begin_fill()
marwin.circle(80)
marwin.left(90)
marwin.forward(80 * 2)
marwin.right(90)
marwin.end_fill()


marwin.color('white')
marwin.goto(200, -200)
marwin.color('pink')
marwin.fillcolor('pink')
marwin.begin_fill()
marwin.circle(80)
marwin.left(90)
marwin.forward(80 * 2)
marwin.right(90)
marwin.end_fill()


turtle.exitonclick()

