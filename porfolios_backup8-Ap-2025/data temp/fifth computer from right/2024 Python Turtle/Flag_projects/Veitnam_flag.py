import math
import turtle

# Set up the turtle and screen
p = turtle.Turtle()
p.shape("turtle")
screen = turtle.Screen()
screen.title("Vietnamese flag")
screen.bgcolor('skyblue')
screen.setup(1700, 1700, 200, 0)
p.speed(0)
p.color('black')

# Define the flag dimensions and star radius
length = 900
width = length * (6 / 9)
radius = length * (6 / 30)
side_length = 3 * radius * math.sin(math.radians(36))

print('length',length, 'width = ', width, 'radius = ', radius)
print('side length = ',side_length)

# Function to draw the flag outline
def flag_outline(color):
    p.up()
    p.goto(-length / 2, -width / 2)
    p.down()
    p.color(color)
    p.begin_fill()
    for _ in range(2):
        p.forward(length)
        p.left(90)
        p.forward(width)
        p.left(90)
    p.end_fill()

# Function to draw the star
def draw_star(side_length):
    p.fillcolor('yellow')
    p.begin_fill()
    for _ in range(5):
        p.forward(side_length)
        p.left(144)
    p.end_fill()

# Function to draw the inner pentagon
def draw_inner_pentagon(radius):
    # Calculate the side length of the inner pentagon
    side_length_pentagon = 2 * radius * math.sin(math.radians(36)) * math.cos(math.radians(18))
    p.color('green')
    p.begin_fill()
    for _ in range(5):
        p.forward(side_length_pentagon)
        p.right(72)
    p.end_fill()

# Draw the flag
flag_outline('#DA251D')  # Red


# Move the turtle to the center of the flag and draw the star
p.penup()
p.pendown()
p.pencolor('black')
p.goto(0, radius)
p.setheading(180+72)  # Point the turtle upwards

p.speed(1)
draw_star(side_length)
p.pensize(5)
p.color('green')
p.forward(side_length)
'''
p.goto(0,0)
p.pencolor('black')
p.shape('circle')
p.shapesize(0.5)
p.stamp()
p.setheading(0)
p.pensize(1)
p.forward(200)
p.backward(400)
p.hideturtle()
'''
# Finish drawing
turtle.exitonclick()
