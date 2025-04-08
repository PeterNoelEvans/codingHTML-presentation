import turtle
import time
#setupthescreen
screen = turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('skyblue')

#register the gif imageas a new shape adds screen.
screen.addshape('1855-1893.gif') # ensure this is the correct path to your elephant image 

part = 100
ounjai=turtle.Turtle()
ounjai.speed(5)
#create turtle object for drawing the flag

#draw the flag the

ounjai.penup()
ounjai.goto(-400, -300)
ounjai.pendown()

ounjai.color('#A51931')
ounjai.begin_fill()
ounjai.forward(part*9)
ounjai.left(90)
ounjai.forward(part*6)






ounjai.left(90)
ounjai.forward(part*9)
ounjai.left(90)
ounjai.forward(part*6)
ounjai.left(90)
ounjai.end_fill()
#create another turtle object for the elephant image
elephant=turtle.Turtle()
elephant.shape('1855-1893.gif')
elephant.penup()

ounjai.right(90)
ounjai.backward(part*6)
ounjai.pencolor('black')
ounjai.pensize('15')
ounjai.forward(part*6+150)
time.sleep(5)
#____________________________________________________________#
#new flag

part = 100
ounjai_new=turtle.Turtle()
ounjai_new.speed(0)



ounjai_new.penup()
ounjai_new.goto(-400, -300)
ounjai_new.pendown()

#draw the flag the
ounjai_new.begin_fill()
ounjai_new.fillcolor('#A51931') #red
#ounjai_new.color('red')
ounjai_new.begin_fill()
ounjai_new.forward(part*9)
ounjai_new.left(90)
ounjai_new.forward(part*1)
ounjai_new.left(90)
ounjai_new.forward(part*9)
ounjai_new.left(90)
ounjai_new.forward(part*1)
ounjai_new.left(90)
ounjai_new.end_fill()

ounjai_new.right(90)
ounjai_new.backward(part)
ounjai_new.left(90)


ounjai_new.begin_fill()
ounjai_new.fillcolor('#FFFFFF') #red
#ounjai_new.color('red')
ounjai_new.begin_fill()
ounjai_new.forward(part*9)
ounjai_new.left(90)
ounjai_new.forward(part*1)
ounjai_new.left(90)
ounjai_new.forward(part*9)
ounjai_new.left(90)
ounjai_new.forward(part*1)
ounjai_new.left(90)
ounjai_new.end_fill()

ounjai_new.right(90)
ounjai_new.backward(part*6)

ounjai_new.pencolor('black')
ounjai_new.pensize('15')
ounjai_new.forward(part*6+150)

turtle.exitonclick()