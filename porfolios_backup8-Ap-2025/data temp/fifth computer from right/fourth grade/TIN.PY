import turtle 
import time
window =turtle.Screen()
window.setup(2000,1800,0,0)
window.bgcolor('SKYBLUE')


tin=turtle.Turtle()
tin.speed(0)
tin.shapesize(1)
tin.shape('turtle')
tin.goto(x=-400,y=-200)
tin.pendown()

tin.penup()

step =100


tin.fillcolor('#A51931')
tin.begin_fill()
tin.forward(step*9)
tin.left(90)
tin.forward(step*6)
tin.left(90)
tin.forward(step*9)
tin.left(90)
tin.forward(step*6)
tin.left(90)
tin.end_fill()

time.sleep(3)
#tin.clear()
window.clear()
p = turtle.Turtle()
screen = turtle.Screen()
screen.bgcolor('skyblue')
p.speed(0)
p.shapesize(1)
p.shape('turtle')
p.penup()
p.goto(x=-400,y=-200)
p.pd()


tin.fillcolor('#A51931')
tin.begin_fill()
tin.forward(step*9)
tin.left(90)
tin.forward(step*6)
tin.left(90)
tin.forward(step*9)
tin.left(90)
tin.forward(step*6)
tin.left(90)
tin.end_fill()

# Create a turtle
flag_turtle = turtle.Turtle()
# Load the image
image_file = "1790-1820.gif"  # Ensure this file is in the same directory or provide the full path
screen.addshape(image_file)
flag_turtle.shape(image_file)

# Move the turtle to a position if necessary
flag_turtle.penup()  # Lift the tin to avoid drawing lines
flag_turtle.goto(50, 100)  # Move the turtle to the center of the screen






# Create a turtle
flag_turtle = turtle.Turtle()
# Load the image
image_file = "1790-1820.gif"  # Ensure this file is in the same directory or provide the full path
screen.addshape(image_file)
flag_turtle.shape(image_file)

# Move the turtle to a position if necessary
flag_turtle.penup()  # Lift the tin to avoid drawing lines
flag_turtle.goto(50, 100)  # Move the turtle to the center of the screen


time.sleep(3)
#tin.clear()
window.clear()
p = turtle.Turtle()
screen = turtle.Screen()
screen.bgcolor('skyblue')

p.shapesize(1)
p.shape('turtle')
p.penup()
p.goto(x=-400,y=-200)
p.pendown()


tin.fillcolor('#A51931')
tin.begin_fill()
tin.forward(step*9)
tin.left(90)
tin.forward(step*6)
tin.left(90)
tin.forward(step*9)
tin.left(90)
tin.forward(step*6)
tin.left(90)
tin.end_fill()



# Create a turtle
flag_turtle = turtle.Turtle()
# Load the image
image_file = "1790-1820.gif"  # Ensure this file is in the same directory or provide the full path
screen.addshape(image_file)
flag_turtle.shape(image_file)

# Move the turtle to a position if necessary
flag_turtle.penup()  # Lift the tin to avoid drawing lines
flag_turtle.goto(50, 100)  # Move the turtle to the center of the screen






turtle.exitonclick()