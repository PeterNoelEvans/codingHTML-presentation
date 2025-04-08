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
screen.title("Thai flag")
screen.bgcolor('skyblue')
screen.setup(1700, 1700, 200, 0)
p.speed(0)
p.color('black')
length = 900
width = length * (6 / 9)

p.up()
p.goto(-400, -250)
p.down()
#p.fillcolor('#2d2a4a')

def flag_outline(color):
    for i in range(1):
        p.color(color)
        p.begin_fill()
        p.fd(length)
        p.lt(90)
        p.fd(width)
        p.lt(90)
        p.fd(length)
        p.lt(90)
        p.fd(width)
        p.lt(90)
        p.end_fill()


def strip(color):
    p.color(color)
    p.begin_fill()
    p.setheading(0)
    p.fd(length)
    p.lt(90)
    p.fd(width / 6)
    p.lt(90)
    p.fd(length)
    p.lt(90)
    p.fd(width / 6)
    p.lt(90)
    p.end_fill()

def re_align():
    p.right(90)
    p.backward(width/6)
    p.left(90)


flag_outline('#2d2a4a') #blue

strip('#A51931') # red
re_align()
strip('#f4f5f8') # white
re_align()
re_align()
re_align()
strip('#f4f5f8') # white
re_align()
strip('#A51931') # red
re_align()

p.pencolor('black')
p.pensize(6)
p.right(90)
p.fd(width + 100)
p.rt(90)
p.fd(5)
p.rt(90)
p.fd(width + 100)
p.rt(90)
p.fd(5)
p.hideturtle()


turtle.exitonclick()
