import turtle
window = turtle.Screen()

window.bgcolor('skyblue')
window.setup(2000,1800,0,0)

p = turtle.Turtle()
p.shapesize(3)
p.shape('turtle')
p.penup()
p.goto(x=-400,y=-200)
p.pendown()


p.speed(9)
length=130
angle=90

step=80
p.fd(step*9)
p.left(90)
p.fd(step*6)
p.left(90)
p.fd(step*9)
p.left(90)
p.fd(step*6)
p.left(90)

p.fillcolor('red')
p.begin_fill()



pen=turtle.Turtle()
pen.shapesize(3)
pen.shape('turtle')
pen.penup()
pen.goto(x=-400,y=-200)
pen.pendown()


pen.speed(9)
length=130
angle=90

step=80
pen.fd(step*9)
pen.left(90)
pen.fd(step*6)
pen.left(90)
pen.fd(step*9)
pen.left(90)
pen.fd(step*6)
pen.left(90)

pen.fillcolor('red')
pen.begin_fill()


pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.end_fill()

pen.right(90)
pen.backward(step)
pen.left(90)


pen.fillcolor('white')
pen.begin_fill()
pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.penup()
pen.end_fill()

pen.right(90)
pen.backward(step)
pen.left(90)

pen.fillcolor('blue')
pen.begin_fill()
pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.penup()
pen.end_fill()

pen.right(90)
pen.backward(step)
pen.left(90)

pen.fillcolor('blue')
pen.begin_fill()
pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.penup()
pen.end_fill()

pen.right(90)
pen.backward(step)
pen.left(90)

pen.fillcolor('white')
pen.begin_fill()
pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.penup()
pen.end_fill()

pen.right(90)
pen.backward(step)
pen.left(90)bg

pen.fillcolor('red')
pen.begin_fill()
pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.fd(step*9)
pen.left(90)
pen.fd(step*1)
pen.left(90)
pen.penup()
pen.end_fill()

#pen.clear()







turtle.exitonclick()