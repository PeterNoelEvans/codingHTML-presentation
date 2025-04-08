import math
import turtle

# Set up the turtle and screen
p = turtle.Turtle()

p.shape("turtle")

import math
import turtle

# Set up the turtle and screen
p = turtle.Turtle()

p.shape("turtle")
screen = turtle.Screen()
screen.title("Vietnamese flag")
screen.bgcolor('green')
screen.setup(1700, 1700, 200, 0)
p.speed(0)
p.color('black')
perth = turtle.Turtle()
perth.goto(-200,-300)
perth_width = 250
p.goto(-900,0)
p.begin_fill()
for i in range(4):
    p.color('skyblue')
    p.forward(2000)
    p.left(90)
p.end_fill()


p.begin_fill()
for i in range(4):
    p.color('lightseagreen')
    p.forward(2000)
    p.right(90)
p.end_fill()

def move_perth(perth):
    perth.color('black')
    point1 = perth.pos()
    print(point1)
    perth.color('gray56')
    perth.begin_fill()
    perth.left(2)
    perth.forward(perth_width)
    perth.left(70)
    perth.forward(perth_width/4)
    perth.left(110)
    perth.forward(perth_width*(2/3))
    perth.left(2)
    perth.forward(perth_width/2.1)
    print(perth_width/2.1)
    perth.left(100)
    perth.goto(point1)
    perth.end_fill()

def mast(perth):
    perth.pendown()
    perth.setheading(0)
    perth.forward(perth_width/3)
    perth.left(90)
    perth.forward(perth_width/3.7)
    perth.color('gray19')
    perth.pensize(12)
    perth.setheading(90)
    perth.forward(perth_width/2.8)
    perth.right(90-12) #jib
    perth.forward(perth_width*1.7)
    mast1 = perth.position()
    perth.backward(perth_width*1.7)
    mast2 = perth.position()
    perth.setheading(90)
    perth.forward(perth_width*1.73)
    return mast1, mast2

def sail(perth, mast1, mast2):
    perth.pendown()
    perth.pensize(2)
    perth.pencolor('gray56')
    perth.fillcolor('antiquewhite1')
    perth.begin_fill()
    perth.right(30)
    perth.forward(perth_width/0.87)
    print('division perth_width/0.87 = ',perth_width*(1/0.87))
    print('multiplication perth_width/0.87 = ',perth_width*0.87)
    
    perth.setheading(0)
    perth.right(55)
    perth.forward(perth_width*0.87)
    perth.right(16)
    perth.forward(perth_width)
    perth.right(7)
    perth.goto(mast1)
    perth.goto(mast2)

    perth.end_fill()

def side():
    positionside = perth.position()
    perth.color('gray95')
    perth.begin_fill()
    perth.setheading(0)
    perth.left(105)
    perth.forward(perth_width/3 * 0.7)
    perth.setheading(180)
    perth.forward(perth_width/3 * 0.5)
    perth.left(180)
    perth.right(76)
    perth.forward(perth_width/3 * 0.6)
    perth.goto(positionside)
    perth.end_fill()
    perth.penup()



move_perth(perth)
side()

close_mast1, close_mast2 = mast(perth)

sail(perth,close_mast1, close_mast2)

turtle.exitonclick()
screen = turtle.Screen()
screen.title("Vietnamese flag")
screen.bgcolor('green')
screen.setup(1700, 1700, 200, 0)
p.speed(0)
p.color('black')
perth = turtle.Turtle()
perth.goto(-200,-300)
perth_width = 250
p.goto(-900,0)
p.begin_fill()
for i in range(4):
    p.color('skyblue')
    p.forward(2000)
    p.left(90)
p.end_fill()


p.begin_fill()
for i in range(4):
    p.color('lightseagreen')
    p.forward(2000)
    p.right(90)
p.end_fill()

def move_perth(perth):
    perth.color('black')
    point1 = perth.pos()
    print(point1)
    perth.color('gray56')
    perth.begin_fill()
    perth.left(2)
    perth.forward(perth_width)
    perth.left(70)
    perth.forward(perth_width/4)
    perth.left(110)
    perth.forward(perth_width*(2/3))
    perth.left(2)
    perth.forward(perth_width/2.1)
    print(perth_width/2.1)
    perth.left(100)
    perth.goto(point1)
    perth.end_fill()

def mast(perth):
    perth.pendown()
    perth.setheading(0)
    perth.forward(perth_width/3)
    perth.left(90)
    perth.forward(perth_width/3.7)
    perth.color('gray19')
    perth.pensize(12)
    perth.setheading(90)
    perth.forward(perth_width/2.8)
    perth.right(90-12) #jib
    perth.forward(perth_width*1.7)
    mast1 = perth.position()
    perth.backward(perth_width*1.7)
    mast2 = perth.position()
    perth.setheading(90)
    perth.forward(perth_width*1.73)
    return mast1, mast2

def sail(perth, mast1, mast2):
    perth.pendown()
    perth.pensize(2)
    perth.pencolor('gray56')
    perth.fillcolor('antiquewhite1')
    perth.begin_fill()
    perth.right(30)
    perth.forward(perth_width/0.87)
    print('division perth_width/0.87 = ',perth_width*(1/0.87))
    print('multiplication perth_width/0.87 = ',perth_width*0.87)
    
    perth.setheading(0)
    perth.right(55)
    perth.forward(perth_width*0.87)
    perth.right(16)
    perth.forward(perth_width)
    perth.right(7)
    perth.goto(mast1)
    perth.goto(mast2)

    perth.end_fill()

def side():
    positionside = perth.position()
    perth.color('gray95')
    perth.begin_fill()
    perth.setheading(0)
    perth.left(105)
    perth.forward(perth_width/3 * 0.7)
    perth.setheading(180)
    perth.forward(perth_width/3 * 0.5)
    perth.left(180)
    perth.right(76)
    perth.forward(perth_width/3 * 0.6)
    perth.goto(positionside)
    perth.end_fill()
    perth.penup()



move_perth(perth)
side()

close_mast1, close_mast2 = mast(perth)

sail(perth,close_mast1, close_mast2)

turtle.exitonclick()