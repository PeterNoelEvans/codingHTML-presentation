import turtle
import random

ma = turtle.Turtle()
screen = turtle.Screen()
screen.bgcolor('ivory')
screen.colormode(255)  # Set the color mode to accept RGB values
ma.shape('turtle')
ma.speed(0)
ma.pensize(0.5)
radius = 30
y = 250
ma.penup()
ma.goto(-300, y)
ma.pendown()

def random_color():
    return (random.randint(0, 255), random.randint(0, 255), random.randint(0, 255))

for i in range(1, 101):
    ma.color(random_color())  # Use a random color
    ma.begin_fill()  # Start filling
    ma.pendown()
    ma.circle(radius)
    ma.end_fill()  # End filling
    ma.penup()
    ma.forward(radius * 2)
    if i % 10 == 0:
        y = y - radius * 2
        ma.goto(-300, y)
        ma.pd

turtle.exitonclick()