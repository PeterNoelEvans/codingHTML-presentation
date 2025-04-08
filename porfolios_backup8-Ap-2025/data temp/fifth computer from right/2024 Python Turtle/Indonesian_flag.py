"""
The Flag Act of BE 2522 (1979)[4] stipulates the design of the national flag as "rectangular in shape
with 6 part width and 9 part length, divided into five stripes throughout the length of the flag; with
the middle stripe being 2 part wide, of deep blue colour, and the white stripes being 1 part wide next
to each side of the deep blue stripes, and the red stripes being 1 part wide next to each side of the
white stripes. The National Flag shall also be called the Tri-Rong flag".[5]
"""

import turtle
p = turtle.Turtle()
p.shape("turtle")
screen = turtle.Screen()
screen.title("Indonesian Flag")
screen.setup(1300, 800)
screen.bgcolor('skyblue')
length = 900
width = length * (6 / 9)

p.up()
p.goto(-400, -250)
p.down()
p.fillcolor('#FFFFFF')
p.begin_fill()
for i in range(1):
    p.fd(length)
    p.lt(90)
    p.fd(width/2)
    p.lt(90)
    p.fd(length)
    p.lt(90)
    p.fd(width/2)
p.end_fill()

p.fillcolor('#ED1C24')


def rect():
    p.setheading(90)
    p.fd(width/2)
    p.setheading(0)
    p.begin_fill()
    p.fd(length)
    p.lt(90)
    p.fd(width/2)
    p.lt(90)
    p.fd(length)
    p.lt(90)
    p.fd(width/2)
    p.end_fill()


rect()

p.penup()
p.pensize(5)
p.pencolor('black')
p.back(width/2)
p.pendown()
p.fd(width + 100)
p.rt(90)
p.fd(5)
p.rt(90)
p.fd(width + 100)
p.rt(90)
p.fd(5)
p.hideturtle()
turtle.exitonclick()
