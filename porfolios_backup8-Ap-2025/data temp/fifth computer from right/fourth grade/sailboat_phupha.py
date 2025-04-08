bimport turtle
window =turtle.Screen()
window.setup(2000,1800,0,0)     
window.bgcolor('skyblue')


phupha=turtle.Turtle()
phupha.speed(-10)
phupha.shapesize(1)
phupha.shape('turtle')  


phupha.fillcolor('turquoise')
phupha.begin_fill()
phupha.fd(1000)
phupha.right(90)
phupha.fd(1000)
phupha.right(90)
phupha.fd(2000)
phupha.right(90)
phupha.fd(1000)
phupha.right(90)
phupha.fd(1000)
phupha.end_fill()


phupha.right(90)
phupha.penup()
phupha.goto(x=-400,y=-200)
phupha.pendown()
phupha.left(90)


phupha.fillcolor('gray70')
phupha.begin_fill()
phupha.fd(490)
phupha.left(75)
phupha.fd(90)
phupha.left(90+15)
phupha.fd(550/2)
point1 = phupha.pos()
print(point1)
phupha.fd(550/2)
phupha.goto(x=-400,y=-200)
phupha.penup()
phupha.goto(point1)
phupha.end_fill()

phupha.pendown()
phupha.pencolor('black')
phupha.right(90)
phupha.pensize(10)
phupha.fd(400)

phupha.fillcolor('cornsilk')
phupha.begin_fill()
phupha.right(45)
phupha.fd(200)
phupha.right(90)
phupha.fd(200)
phupha.right(40)
phupha.fd(200)
phupha.right(90)
phupha.fd(300)
phupha.end_fill()

phupha.right(95)
phupha.fd(150)
phupha.right(35)
phupha.fd(250)

phupha.penup()
phupha.goto(0,200)

phupha.write("9", align="center", font=("Arial", 80, "bold"))





























turtle.exitonclick()