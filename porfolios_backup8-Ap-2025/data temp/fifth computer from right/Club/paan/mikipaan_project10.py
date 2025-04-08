import turtle
paan = turtle.Turtle()
paan.pensize(20)
radius=100

paan.pencolor('lime')
paan.circle(radius,180)

paan.pencolor('violet')
paan.circle(radius,180)

paan.pencolor('lime')
paan.circle(-radius,180)

paan.pencolor('violet')
paan.circle(-radius,180)

paan.pencolor('lime')
paan.circle(-radius,60)

paan.pencolor('lime')
paan.circle(radius)

paan.pu()
paan.pencolor('lime')
paan.circle(-radius,-60)
paan.left(180)
paan.circle(radius,-60)

paan.pd()

paan.pencolor('white')







	














turtle.exitonclick()