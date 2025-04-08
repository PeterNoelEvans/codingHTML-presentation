import turtle
import time
darin = turtle.Turtle()	
screen = turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('skyblue')

darin.penup()
darin.goto(-400,-300)
darin.speed(0)
darin.pendown()

length = 130
angle = 90

darin2 = turtle.Turtle()
darin2.penup()
darin2.goto(-400,-300)
darin2.speed(0)
darin2.pendown()




darin2.setheading(0)
darin2.fillcolor('#A51931') # red
darin2.begin_fill()
darin2.forward(length*9)
darin2.left(angle)
darin2.forward(length*6)
darin2.left(angle)
darin2.forward(length*9)
darin2.left(angle)
darin2.forward(length*6)
darin2.end_fill()

screen.addshape("1855-1893.gif")  # Ensure this is the correct path to your elephant image


elephant = turtle.Turtle()
elephant.shape("1855-1893.gif")
elephant.penup()
elephant.goto(200,100)
darin2.penup()
darin2.goto(-400, -300)
darin2.pendown()

darin2.backward(length*6)

darin2.color('black')
darin2.pensize(15)
darin2.forward(length*9+100)

time.sleep(3)
turtle.clearscreen()
screen.bgcolor('skyblue')
darin.forward(length*9)
darin.left(angle)
darin.forward(length*6)
darin.left(angle)
darin.forward(length*9)
darin.left(angle)
darin.forward(length*6)
darin.left(angle)


darin.color('#A51931')
darin.begin_fill()
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.end_fill()

darin.right(90)
darin.backward(length)
darin.left(90)


darin.fillcolor('#FFFFFF')
darin.begin_fill()
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.end_fill()

darin.right(90)
darin.backward(length)
darin.left(90)


darin.color('#2D2A4A')
darin.begin_fill()
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.end_fill()

darin.right(90)
darin.backward(length)
darin.left(90)


darin.color('#2D2A4A')
darin.begin_fill()
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.end_fill()


darin.right(90)
darin.backward(length)
darin.left(90)



darin.color('#FFFFFF')
darin.begin_fill()
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.end_fill()


darin.right(90)
darin.backward(length)
darin.left(90)



darin.color('#A51931')
darin.begin_fill()
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.forward(length*9)
darin.left(angle)
darin.forward(length*1)
darin.left(angle)
darin.end_fill()


darin.right(90)
darin.backward(length)
darin.left(90)
darin.right(90)

darin.color('black')
darin.pensize(15)
darin.forward(length*9+100)


darin.hideturtle()





turtle.exitonclick()