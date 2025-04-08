import turtle
import time
sky = turtle.Turtle()	
screen = turtle.Screen()
screen.setup(2000,1800,0,0)
screen.bgcolor('skyblue')

sky.penup()
sky.goto(-400,-300)
sky.speed(0)
sky.pendown()

length = 130
angle = 90

sky2 = turtle.Turtle()
sky2.penup()
sky2.goto(-400,-300)
sky2.speed(0)
sky2.pendown()




sky2.setheading(0)
sky2.fillcolor('#A51931') # red
sky2.begin_fill()
sky2.forward(length*9)
sky2.left(angle)
sky2.forward(length*6)
sky2.left(angle)
sky2.forward(length*9)
sky2.left(angle)
sky2.forward(length*6)
sky2.end_fill()

screen.addshape("1855-1893.gif")  # Ensure this is the correct path to your elephant image


elephant = turtle.Turtle()
elephant.shape("1855-1893.gif")
elephant.penup()
elephant.goto(200,100)
sky2.penup()
sky2.goto(-400, -300)
sky2.pendown()

sky2.backward(length*6)

sky2.color('black')
sky2.pensize(15)
sky2.forward(length*9+100)

time.sleep(3)
turtle.clearscreen()
screen.bgcolor('skyblue')
sky.forward(length*9)
sky.left(angle)
sky.forward(length*6)
sky.left(angle)
sky.forward(length*9)
sky.left(angle)
sky.forward(length*6)
sky.left(angle)


sky.color('#A51931')
sky.begin_fill()
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.end_fill()

sky.right(90)
sky.backward(length)
sky.left(90)


sky.fillcolor('#FFFFFF')
sky.begin_fill()
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.end_fill()

sky.right(90)
sky.backward(length)
sky.left(90)


sky.color('#2D2A4A')
sky.begin_fill()
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.end_fill()

sky.right(90)
sky.backward(length)
sky.left(90)


sky.color('#2D2A4A')
sky.begin_fill()
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.end_fill()


sky.right(90)
sky.backward(length)
sky.left(90)



sky.color('#FFFFFF')
sky.begin_fill()
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.end_fill()


sky.right(90)
sky.backward(length)
sky.left(90)



sky.color('#A51931')
sky.begin_fill()
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.forward(length*9)
sky.left(angle)
sky.forward(length*1)
sky.left(angle)
sky.end_fill()


sky.right(90)
sky.backward(length)
sky.left(90)
sky.right(90)

sky.color('black')
sky.pensize(15)
sky.forward(length*9+100)


sky.hideturtle()




turtle.exitonclick()
