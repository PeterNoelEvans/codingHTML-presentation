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
boat = turtle.Turtle()
boat.goto(-200,-300)
boat_width = 250
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

def move_boat(boat):
    boat.color('black')
    point1 = boat.pos()
    print(point1)
    boat.color('gray56')
    boat.begin_fill()
    boat.left(2)
    boat.forward(boat_width)
    boat.left(70)
    boat.forward(boat_width/4)
    boat.left(110)
    boat.forward(boat_width*(2/3))
    boat.left(2)
    boat.forward(boat_width/2.1)
    print(boat_width/2.1)
    boat.left(100)
    boat.goto(point1)
    boat.end_fill()

def mast(boat):
    boat.pendown()
    boat.setheading(0)
    boat.forward(boat_width/3)
    boat.left(90)
    boat.forward(boat_width/3.7)
    boat.color('gray19')
    boat.pensize(12)
    boat.setheading(90)
    boat.forward(boat_width/2.8)
    boat.right(90-12) #jib
    boat.forward(boat_width*1.7)
    mast1 = boat.position()
    boat.backward(boat_width*1.7)
    mast2 = boat.position()
    boat.setheading(90)
    boat.forward(boat_width*1.73)
    return mast1, mast2

def sail(boat, mast1, mast2):
    boat.pendown()
    boat.pensize(2)
    boat.pencolor('gray56')
    boat.fillcolor('antiquewhite1')
    boat.begin_fill()
    boat.right(30)
    boat.forward(boat_width/0.87)
    print('division boat_width/0.87 = ',boat_width*(1/0.87))
    print('multiplication boat_width/0.87 = ',boat_width*0.87)
    
    boat.setheading(0)
    boat.right(55)
    boat.forward(boat_width*0.87)
    boat.right(16)
    boat.forward(boat_width)
    boat.right(7)
    boat.goto(mast1)
    boat.goto(mast2)

    boat.end_fill()

def side():
    positionside = boat.position()
    boat.color('gray95')
    boat.begin_fill()
    boat.setheading(0)
    boat.left(105)
    boat.forward(boat_width/3 * 0.7)
    boat.setheading(180)
    boat.forward(boat_width/3 * 0.5)
    boat.left(180)
    boat.right(76)
    boat.forward(boat_width/3 * 0.6)
    boat.goto(positionside)
    boat.end_fill()
    boat.penup()



move_boat(boat)
side()

close_mast1, close_mast2 = mast(boat)

sail(boat,close_mast1, close_mast2)

turtle.exitonclick()