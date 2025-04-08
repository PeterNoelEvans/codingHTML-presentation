import turtle

ma = turtle.Turtle()
screen = turtle.Screen()
screen.bgcolor('ivory')
ma.shape('turtle')
ma.speed(0)
ma.pensize(0.5)
radius = 30
y = 250
ma.penup()
ma.goto(-300, y)
ma.pendown()

colors = ['red', 'blue', 'green', 'yellow', 'orange', 'purple', 'pink', 'cyan', 'magenta', 'brown']

for i in range(1, 101):
    ma.color(colors[i % len(colors)])  # Cycle through colors
    ma.begin_fill()  # Start filling
    ma.pendown()
    ma.circle(radius)
    ma.end_fill()  # End filling
    ma.penup()
    ma.forward(radius * 2)
    if i % 10 == 0:
        y = y - radius * 2
        ma.goto(-300, y)
        ma.pendown()

turtle.exitonclick()
