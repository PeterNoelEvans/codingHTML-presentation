import turtle
window=turtle.Screen()
window.setup(2000,1800,0,0)
window.bgcolor('skyblue')
window.title('My Sailing Tri')
copter= turtle.Turtle()
copter.speed(-10000000)  
copter.fillcolor('turquoise')
copter.begin_fill()
copter.fd(1000)
copter.right(90)
copter.fd(1000)
copter.right(90)
copter.fd(2000)
copter.right(90)
copter.fd(1000)
copter.right(90)
copter.fd(1000)

copter.end_fill()
copter.right(90)
copter.hideturtle()


pen=turtle.Turtle()
pen.speed()
pen.shapesize(1)

pen.penup()
pen.goto(x=-400,y=-200)
pen.pendown()

pen.speed(-900)
pen.color('gray60')
pen.begin_fill()
point1 = pen.pos()
pen.fd(490)
pen.left(75)
pen.fd(90)
pen.left(90+15)
pen.fd(550/2)
point2 = pen.pos()
pen.fd(550/2)
pen.setheading(0)
pen.goto(point1)
pen.end_fill()

mast = turtle.Turtle()
mast.speed(-900)

mast.pu()
mast.goto(point2)
mast.pd()
mast.left(90)
mast.pensize(8)
mast.forward(400)
mast.right(45)
mast.fd(300)
mast.right(90)
mast.fd(200)
mast.right(45)
mast.fd(250)
mast.right(90)

mast.fd(350)

































turtle.exitonclick()