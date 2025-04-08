"""
 The red background symbolizes revolution and bloodshed. The golden star symbolizes the soul of the nation and the 
 five points of the star represents the five main classes in Vietnamese society—intellectuals, farmers, workers, 
 entrepreneurs, and soldiers.
"""

import turtle
p = turtle.Turtle()
p.shape("turtle")
screen = turtle.Screen()
screen.title("Vietnamese Flag")
screen.setup(1300, 800)
screen.bgcolor('skyblue')
length = 900
width = length * (2 / 3)
diameter = 12*30
radius = diameter/2
p.speed(0)
p.up()
p.goto(-400, -250)
p.down()
p.fillcolor('#DA251D')
p.begin_fill()
for i in range(1):
    p.fd(length)
    p.lt(90)
    p.fd(width)
    p.lt(90)
    p.fd(length)
    p.lt(90)
    p.fd(width)
p.end_fill()



def star():
    p.setheading(0)
    p.fd(length/2)
    p.setheading(90)
    p.forward(width/2)
    p.stamp()
    p.forward(radius)
    p.setheading(180)
    p.color('black')
    p.shape('circle')
    p.shapesize(0.2)
    positions = []

    for i in range(5):
        p.circle(radius, 360/5)
        p.stamp()
        positions.append(p.position())

    return positions
p.speed(1)
positions = star()
print(positions)
p.fillcolor('#FFFF00')
p.begin_fill()
p.goto(positions[1])
p.goto(positions[2])
p.end_fill()
p.begin_fill()
p.goto(positions[0])
p.goto(positions[3])
p.end_fill()
p.goto(positions[1])
'''
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
'''
turtle.exitonclick()
